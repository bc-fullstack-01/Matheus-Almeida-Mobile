import React, {ReactElement, useReducer} from "react";
import server from '../api/server'
import * as SecureStore from 'expo-secure-store'
import {Post} from '../Models/Post'
import { Action } from "../Models/Action";

interface IPostContext{
  posts: Post[];
  errorMessage: string | null;
  getPosts?: ({page}: {page: number}) => void;
  likePost?: ({id}: {id: string}) => void;
  unlikePost?: ({id}: {id: string}) => void;
  createPost?: ({
    title,
    description,
    file,
  }: {
    title: string;
    description: string;
    file?: File;
  }) => void;
}

const defaultValue = {posts: [], errorMessage: null}

const Context = React.createContext<IPostContext>(defaultValue);

const Provider = ({children} : {children: ReactElement}) => {
  const reducer = (state: any, action: Action) => {
    const {posts} = state
    const index = posts.findIndex(
      (post: Post) => post._id == action.payload.id
    );
    switch(action.type) {
      case "show_posts":
        return {
          ...state,
          posts: [].concat(posts).concat(action.payload),
          errorMessage: null,
        }
      case "like_post":
        posts[index].liked = action.payload.liked;
        posts[index].likes = posts[index].likes.filter((profile: string) => profile != action.payload.profile);
        posts[index].likes = [...posts[index].likes, action.payload.profile];
        return {...state, posts, errorMessage: null};
      case "unlike_post":
        posts[index].liked = action.payload.liked;
        posts[index].likes = posts[index].likes.filter((profile: string) => profile != action.payload.profile);
        return {...state, posts, errorMessage: null};
      case "add_error":
        return {...state, errorMessage: action.payload}
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, defaultValue);

  const getPosts = (dispatch: any) => async ({page} : {page: number}) => {
    try{
      const token = await SecureStore.getItemAsync("token")
      const profile = await SecureStore.getItemAsync("profile")
      const response = await server.get(`/feed?page=${page}`, {
        headers: {
          authorization: `Bearer ${token}`,
        }
      })
      const posts = response.data.map((post: Post) => {
        return {...post, liked: post.likes.includes(profile)}
      })
      dispatch({type: "show_posts", payload: posts})
    }catch(err){
      dispatch({type: "add_error", payload: "Erro ao obter os posts"})
    }
  }

  const likePost = (dispatch: any) => async ({id} : {id: string}) => {
    try{
      const token = await SecureStore.getItemAsync("token");
      const profile = await SecureStore.getItemAsync("profile")
      await server.post(`/posts/${id}/like`, null, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      dispatch({
        type: "like_post",
        payload: {id, liked: true, profile},
      });
    }catch(err){
      console.log(err.request)
    }
  }

  const unlikePost = (dispatch: any) => async ({id} : {id: string}) => {
    try{
      const token = await SecureStore.getItemAsync("token");
      const profile = await SecureStore.getItemAsync("profile")
      await server.post(`/posts/${id}/unlike`, null, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      dispatch({
        type: "unlike_post",
        payload: {id, liked: false, profile},
      });
    }catch(err){
      console.log(err.request)
    }
  }

  const createPost = (dispatch: any) => async ({title, description, image,}: {
    title: string;
    description: string;
    image?: File;
  }) => {
    try{
      const token = await SecureStore.getItemAsync("token");
      const data = new FormData();
      data.append("title", title);
      data.append("description", description || "");
      data.append("file", image);
      const response = await server.post("/posts", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${token}`,
        },
      });
    }catch(err){
      console.log(err)
    }
  };

  return (
    <Context.Provider
    value={{
      ...state,
      getPosts: getPosts(dispatch),
      likePost: likePost(dispatch),
      unlikePost: unlikePost(dispatch),
      createPost: createPost(dispatch),
    }}
    >
      {children}
    </Context.Provider>
  )
}

export {Provider, Context};