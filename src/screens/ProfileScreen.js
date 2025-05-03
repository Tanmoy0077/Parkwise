import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { globalStyles, colors } from '../styles/globalStyles';

export default function ProfileScreen() {
  const { signOut } = useAuth();

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Profile</Text>
      <Text style={styles.content}>User profile details would go here.</Text>
      <View style={styles.buttonContainer}>
        <Button title="Logout" onPress={signOut} color={colors.error} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 30,
  }
});