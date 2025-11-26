import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import LaberintoScreen from '../screens/LaberintoScreen';
import RankingScreen from '../screens/RankingScreen';
import { AuthContext } from '../contexts/AuthContext';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { token } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      {!token ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Laberinto" component={LaberintoScreen} />
          <Stack.Screen name="Ranking" component={RankingScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
