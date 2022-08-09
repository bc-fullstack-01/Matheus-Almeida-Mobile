import React, {useContext} from 'react';
import {View, Image, TouchableOpacity, Text, StyleSheet} from 'react-native'
import Spacer from '../components/Spacer'
import AuthForm from '../components/AuthForm'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {Context as AuthContext} from '../context/AuthContext'

interface Props{
  navigation: NativeStackNavigationProp<any, any>
}

export default function RegisterScreen({navigation} : Props){
  const {register, clearErrorMessage, errorMessage} = useContext(AuthContext)

  const handleLoginClick = () => {
    clearErrorMessage && clearErrorMessage();
    navigation.navigate("Login")
  };

  return (
    <View style={styles.container}>
      <AuthForm 
        submitButtonText="Cadastrar"
        onSubmit={register}
      />
      <TouchableOpacity onPress={handleLoginClick}>
        <Spacer>
          <Text style={styles.link}>Já tem uma conta ? Faça o login</Text>
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
    alignItems: "center",
    marginTop: 100,
    marginBottom: 150,
  },
  link: {
    color: 'blue',
  },
  errorText: {
    textAlign: "center",
    color: "red",
  },
})