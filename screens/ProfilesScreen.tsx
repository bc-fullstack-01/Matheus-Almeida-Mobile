import React, {useState, useEffect} from 'react';
import * as SecureStore from 'expo-secure-store';
import {View, FlatList, StyleSheet} from 'react-native';
import {Card, Text, Button} from '@rneui/base';
import Spacer from '../components/Spacer';
import CustomAvatar from '../components/CustomAvatar';
import server from '../api/server'

interface Profile{
  _id: string;
  name: string;
  followers: string[];
  following: string[];
}

export default function ProfilesScreen(){
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    const getProfiles = async () => {
      try{
        const token = await SecureStore.getItemAsync("token");
        const response = await server.get("/profiles", {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setProfiles(response.data);
      } catch(err){
        console.log(err)
      }
    }
    getProfiles();
  }, []);

  const handleFollow = async (id: string) => {
    try{
      const actualProfile = await SecureStore.getItemAsync("profile")
      const token = await SecureStore.getItemAsync("token");
      await server.post(`/profiles/${id}/follow`, null, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      setProfiles((p: Profile[]) => {
        const indexFollowing = p.findIndex(
          (profile: Profile) => profile._id == id
        );
        const indexFollower = p.findIndex(
          (profile: Profile) => profile._id == actualProfile
        );
        p[indexFollowing].followers.push(actualProfile);
        p[indexFollower].following.push(id);

        return [...p];
      });
    }catch(err){
      console.log(err.request);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={profiles}
        keyExtractor={({_id}) => _id}
        renderItem={({item}) => (
          <Card>
            <View style={styles.cardHeaderStyle}>
              <CustomAvatar name={item.name}/>
              <Text h4 style={styles.cardHeaderTextStyle}>
                {item.name}
              </Text>
            </View>
            <Spacer/>
            <Text>{item.followers.length} seguidores</Text>
            <Text>
              Seguindo{" "}
              {item.following.length == 1
                ? item.following.length + " perfil"
                : item.following.length + " perfis"}
            </Text>
            <Spacer/>
            <Button
              title="Seguir"
              onPress={() => handleFollow(item._id)}
            ></Button>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  cardHeaderStyle: {
    flexDirection: "row",
  },
  cardHeaderTextStyle: {
    marginLeft: 15,
  },
});