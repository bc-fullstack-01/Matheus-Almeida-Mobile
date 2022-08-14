import { useContext, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer, TabActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TouchableOpacity } from "react-native";
import {MaterialIcons} from '@expo/vector-icons'
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ProfilesScreen from "./screens/ProfilesScreen";
import HomeNavigationScreen from "./screens/HomeNavigationScreen";
import {
  Provider as AuthProvider,
  Context as AuthContext,
} from "./context/AuthContext";
import {
  Provider as PostProvider
} from './context/PostContext'
import {navigationRef} from './RootNavigation'

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

const App = () => {
  const {tryLocalLogin, token, isLoading } = useContext(AuthContext);

  useEffect(() => {
    tryLocalLogin && tryLocalLogin();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        { isLoading ? null : !token ? (
          <Stack.Navigator
            screenOptions={({ route, navigation }) => ({
              headerShown: false,
            })}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Navigator>
        ) : (
          <Tab.Navigator
            screenOptions={({route}) => ({
              tabBarIcon: ({color, size}) => {
                switch(route.name){
                  case "Home":
                    return (<MaterialIcons name="home" size={size} color={color}/>)
                  case "Profiles":
                    return (<MaterialIcons name="groups" size={size} color={color}/>)
                  case "Profile":
                    return (<MaterialIcons name="account-circle" size={size} color={color}/>)
                }
              },
              headerShown: false,
            })}
          >
            <Tab.Screen name="Home" component={HomeNavigationScreen} />
            <Tab.Screen name="Profiles" component={ProfilesScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
          </Tab.Navigator>
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default () => {
  return (
    <AuthProvider>
      <PostProvider>
        <App/>
      </PostProvider>
    </AuthProvider>
  );
};
