import React, {useContext} from 'react';
import {View, Image, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {Context as AuthContext} from "../context/AuthContext";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Spacer from '../components/Spacer';
import AuthForm from '../components/AuthForm';

interface Props {
  navigation: NativeStackNavigationProp<any, any>
}

export default function LoginScreen({navigation}: Props){
  const {login, clearErrorMessage, errorMessage} = useContext(AuthContext);

  const handleRegisterClick = () => {
     clearErrorMessage && clearErrorMessage();
    navigation.navigate('Register')
  }

  return (
    <View style={styles.container}>
      <AuthForm 
        submitButtonText="Login"
        onSubmit={login}
      />
      <TouchableOpacity onPress={() => handleRegisterClick()}>
        <Spacer>
          <Text style={styles.link}>Não tem uma conta ? Faça o cadastro</Text>
        </Spacer>
      </TouchableOpacity>
      {errorMessage && (
        <Spacer>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </Spacer>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    marginTop: 100,
    marginBottom: 150,
  },
  link: {
    textAlign: 'center',
    color: 'blue',
  },
  errorText: {
    textAlign: "center",
    color: "red",
  },
})