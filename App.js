import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    // SafeAreaProvider ensures your app content respects device notches and status bars
    <SafeAreaProvider>
        {/* AuthProvider manages the user's login state */}
        <AuthProvider>
          {/* RootNavigator handles switching between Login and the main App */}
          <RootNavigator />
          {/* StatusBar component to style the device's status bar */}
          <StatusBar style="auto" />
        </AuthProvider>
    </SafeAreaProvider>
  );
}