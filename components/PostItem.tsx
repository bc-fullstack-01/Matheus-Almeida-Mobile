import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Card } from '@rneui/base';
import CustomAvatar from './CustomAvatar';
import {MaterialIcons} from '@expo/vector-icons'
import FavoriteIconButton from './FavoriteIconButton';
import {Post} from "../Models/Post";

interface Props{
  post: Post;
}

export default function PostItem ({post} : Props) {
  return (
    <TouchableOpacity>
      <Card>
        <View style={styles.cardHeaderStyle}>
          <CustomAvatar name={post.profile.name} />
          <Text style={styles.cardTitleStyle}>{post.title}</Text>
        </View>
        {post.image ? (
          <Card.Image source={{uri: post.description}} style={styles.cardImageStyle}/>
        ) : (
          <Text style={styles.descriptionStyle}>{post.description}</Text>
        )}
        <Card.Divider />
          <View style={styles.actionContainer}>
            <FavoriteIconButton liked={true} handleLike={() => {}}/>
            <Text style={styles.actionItemStyle}>{post.likes.length}</Text>
            <MaterialIcons name='chat-bubble-outline' size={24} style={styles.actionItemStyle} />
            <Text style={styles.actionItemStyle}>{post.comments.length}</Text>
          </View>
      </Card>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  cardHeaderStyle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  cardTitleStyle: {
    marginLeft: 15,
    fontWeight: "bold",
  },
  cardImageStyle: {
    resizeMode: "contain",
    maxHeight: 600,
    marginBottom: 15,
  },
  descriptionStyle: {
    fontSize: 12
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "space-around",
  },
  actionItemStyle: {
    marginLeft: 5,
  },
})