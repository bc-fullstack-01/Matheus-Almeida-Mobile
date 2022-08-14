import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, KeyboardAvoidingView, Platform} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import sever from '../api/server';
import PostItem from '../components/PostItem';
import {Post} from '../Models/Post';
import {Text, Input, Button, Divider} from '@rneui/base';
import server from '../api/server';
import Spacer from '../components/Spacer'

interface Props{
  route: any;
}

export default function PostScreen({route}: Props){
  const {id} = route.params;
  const [post, setPost] = useState<Post>();
  const [description, setDescription] = useState("");

  useEffect(() => {
    const getPost = async () => {
      try{
        const token = await SecureStore.getItemAsync("token")
        const profile = await SecureStore.getItemAsync("profile")
        const response = await server.get(`/posts/${id}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        const post = {
          ...response.data,
          liked: response.data.likes.includes(profile),
        };
        setPost(post);
      }catch(err){
        console.log(err)
      }
    };

    getPost();
  }, [])

  const addComment = async () => {
    try{
      const token = await SecureStore.getItemAsync("token");

      const response = await server.post(
        `/posts/${id}/comments`,
        {description},
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
    }catch(err){
      console.log(err)
    }
  };

  return (
    <>
      {post ? (
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.container}
        >
          <PostItem post={post}/>
            <Spacer>
            <>
              <Divider/>
              <Text >Comentários:</Text>
            <Input
              label="Comentário"
              value={description}
              onChangeText={setDescription}
              autoCorrect={false}
            />
            <Button
              title="Postar"
              onPress={() => {
                setDescription("");
                addComment()
              }}
            />
            <FlatList
              data={post.comments}
              keyExtractor={({_id}) => _id}
              renderItem={({item}) => {
                return(
                  <View>
                    <Text>{item.description}</Text>
                  </View>
                );
              }}
            />
          </>
          </Spacer>
        </KeyboardAvoidingView>
      ) : null}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})