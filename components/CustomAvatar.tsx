import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Avatar } from "@rneui/base";

interface Props {
  name: string;
}

export default function CustomAvatar({name} : Props){
  const initials = name
  .split(" ")
  .slice(0, 2)
  .map((name) => name[0])
  .join()
  .replace(",", "");

  return(
    <Avatar
      size="small"
      rounded
      title={initials}
      containerStyle={styles.avatarStyle}
    />
  )
}

const styles = StyleSheet.create({
  avatarStyle: {
    backgroundColor: "red"
  }
})