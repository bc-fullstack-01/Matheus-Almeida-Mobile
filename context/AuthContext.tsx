import React, { Dispatch, ReactElement, useReducer } from "react";
import * as SecureStore from 'expo-secure-store'
import server from "../api/server";
import jwt_decode from "jwt-decode";
import {navigate} from '../RootNavigation';

interface TokenUser {
  profile: string;
  user: string;
}

interface Action {
  type: string;
  payload: any;
}

interface IAuthContext {
  token: string | null;
  user: string | null;
  profile: string | null;
  errorMessage?: string | null;
  login?: () => void;
  clearErrorMessage?: () => void;
  register?: () => void;
}

interface ILogin {
  user: string; 
  password: string 
}
 
const defaultValue = { token: null, user: null, profile: null, errorMessage: null, };

const Context = React.createContext<IAuthContext>(defaultValue);

const Provider = ({ children }: { children: ReactElement }) => {
  const reducer = (state: any, action: Action) => {
    switch (action.type) {
      case "login":
        return { ...state, ...action.payload, errorMessage: null };
      case "user_created":
        return {...state, errorMessage: null}
      case "add_error":
        return {...state, errorMessage: action.payload}
      case "clear_error_message":
        return {...state, errorMessage: null };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, defaultValue);
  const login =
    (dispatch: any) =>
    async ({ user, password }: ILogin) => {
      try {
        const response = await server.post("/security/login", {
          user,
          password,
        });
        const { accessToken } = response.data;
        const { profile, user: userName } = jwt_decode(
          accessToken
        ) as TokenUser;

        await SecureStore.setItemAsync("token", accessToken);
        await SecureStore.setItemAsync("user", userName);
        await SecureStore.setItemAsync("profile", profile);

        dispatch({
          type: "login",
          payload: { token: accessToken, profile, user: userName },
        });
      } catch (err) {
        dispatch({
          type: "add_error",
          payload: "Houve um erro no processo de login",
        });
      }
    };

    const register = (dispatch: any) => async ({user, password} : ILogin) => {
      try{
        await server.post("/security/register", {
          user,
          password,
        })
        dispatch({type: "user_created"})
        navigate("Login")
      }catch(err){
        dispatch({
          type: "add_error",
          payload: "Houve um erro no processo de cadastro.",
        })
      }
    }

    const clearErrorMessage = (dispatch: any) => () => {
      dispatch({type: "clear_error_message"});
    }

  return (
    <Context.Provider value={{ ...state, login: login(dispatch), clearErrorMessage: clearErrorMessage(dispatch), register: register(dispatch), }}>
      {children}
    </Context.Provider>
  );
};

export { Provider, Context };