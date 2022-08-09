import React, { useState } from "react";
import { View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import logo from "../assets/imagens/logo.png";
import { Input, Button } from "@rneui/base";
import Spacer from "../components/Spacer";

interface Props {
  submitButtonText: string;
  onSubmit: any;
}

export default function AuthForm({ submitButtonText, onSubmit }: Props) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <View style={styles.container}>
        <Spacer>
          <Image source={logo} style={styles.image} />
        </Spacer>
        <Input
          label="Usuário"
          value={user}
          onChangeText={setUser}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Spacer />
        <Input
          secureTextEntry
          label="Senha"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <Spacer>
        <Button
          title={submitButtonText}
          onPress={() => onSubmit({ user, password })}
        />
      </Spacer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 5,
  },
});
