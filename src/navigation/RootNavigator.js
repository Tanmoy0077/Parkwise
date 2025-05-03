import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { View, ActivityIndicator } from 'react-native'; // Use ActivityIndicator for loading state if needed
import { colors } from '../styles/globalStyles';

export default function RootNavigator() {
  const { userToken } = useAuth();
  // Optional: Add a loading state if checking token takes time

  return (
    <NavigationContainer>
      {userToken ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}