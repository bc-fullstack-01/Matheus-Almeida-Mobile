import React, {useState, useContext} from 'react';
import {View, Text, StyleSheet} from 'react-native'
import {Input, Button} from '@rneui/base'
import Spacer from '../components/Spacer'
import PostImagePicker from '../components/PostImagePicker';
import {File} from '../Models/File'
import {Context as PostContext} from '../context/PostContext'

export default function CreatePostScreen(){
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File>();
  const {createPost} = useContext(PostContext)

  return (
    <View>
      <Spacer>
        <>
        <Input
          label="Titulo"
          value={title}
          onChangeText={setTitle}
          autoCorrect={false}
        />
        <Spacer/>
        {image ? null : (
          <Input
            label="O que esta acontecendo?"
            value={description}
            onChangeText={setDescription}
            numberOfLines={3}
            autoCorrect={false}
          />
        )}
        <PostImagePicker onFileLoaded={setImage}/>
        <Spacer/>
        <Button title="Publicar" onPress={() => {createPost && createPost({title, description, image})}}/>
        </>
      </Spacer>
    </View>
  )
}

const styles = StyleSheet.create({})