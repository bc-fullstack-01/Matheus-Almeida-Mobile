import React, {useContext, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native'
import {Context as PostContext} from '../context/PostContext'
import PostItem from '../components/PostItem'

export default function PostListScreen(){
  const {posts, errorMessage, getPosts} = useContext(PostContext)

  useEffect(() => {
    getPosts()
  })

  return (
    <>
    {errorMessage ? (
      <View style={styles.errorContainer}><Text style={styles.errorMessageStyle}>{errorMessage}</Text></View>
    ) : (
      <FlatList
      data={posts}
      keyExtractor={({_id}) => _id}
      renderItem={({item}) => <PostItem post={item}/>}
    />
    )}
    </>
  )
}

const styles = StyleSheet.create({
  errorMessageStyle: {
    color: "red",
  },
  errorContainer: {
    marginTop: 20,
    alignItems: "center",
  },
})