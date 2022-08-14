import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native'
import {Context as PostContext} from '../context/PostContext'
import PostItem from '../components/PostItem'
import InfiniteScroll from 'react-native-infinite-scrolling'
import {Post} from '../Models/Post'

interface Props{
  navigation: any
}

export default function PostListScreen({navigation}){
  const {posts, errorMessage, getPosts} = useContext(PostContext)
  const [actualPage, setActualPage] = useState(0)

  useEffect(() => {
    getPosts() && getPosts({page: actualPage});
  }, [actualPage]);

  const renderData = ({item} : {item: Post}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("PostDetail", {id: item._id});
        }}
      >
        <PostItem post={item}/>
      </TouchableOpacity>
    );
  };

  const loadMore = () => {
    setActualPage((p) => p + 1)
  }

  return (
    <>
    {errorMessage ? (
      <View style={styles.errorContainer}><Text style={styles.errorMessageStyle}>{errorMessage}</Text></View>
    ) : (
      <InfiniteScroll
      data={posts}
      renderData={renderData}
      loadMore={loadMore}
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