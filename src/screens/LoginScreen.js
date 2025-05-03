import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { globalStyles, colors } from '../styles/globalStyles';

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      setError('Please enter both phone number and password.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const success = await signIn(phoneNumber, password);
      if (!success) {
        setError('Invalid phone number or password.');
        // Keep isLoading true briefly to show feedback, then turn off
        setTimeout(() => setIsLoading(false), 500);
      }
      // On success, the RootNavigator will automatically switch screens
      // because userToken changes, so no need to setLoading(false) here immediately.
    } catch (e) {
      console.error("Login error:", e);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <View style={[globalStyles.container, styles.container]}>
      <Text style={[globalStyles.title, styles.title]}>Welcome Back!</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Phone Number (e.g., 1234567890)"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        placeholderTextColor={colors.textSecondary}
      />
      <TextInput
        style={styles.input}
        placeholder="Password (e.g., password)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={colors.textSecondary}
      />
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.buttonSpacing} />
      ) : (
        <View style={styles.buttonSpacing}>
           <Button title="Login" onPress={handleLogin} color={colors.primary} disabled={isLoading} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 30,
  },
  input: {
    width: '90%',
    height: 50,
    borderColor: colors.border,
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: colors.surface,
  },
  buttonSpacing: {
    marginTop: 10,
    width: '90%',
  },
  errorText: {
    color: colors.error,
    marginBottom: 10,
    textAlign: 'center',
  },
});