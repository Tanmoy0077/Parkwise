import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { globalStyles, colors } from '../styles/globalStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import Icon

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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingContainer}
    >
      <ScrollView contentContainerStyle={[globalStyles.container, styles.scrollContainer]}>
        <View style={styles.logoContainer}>
          {/* You can replace this Text with an actual Image logo */}
          <Icon name="parking" size={60} color={colors.primary} />
          <Text style={styles.appName}>Parkwise</Text>
        </View>

        <Text style={styles.welcomeText}>Welcome Back!</Text>
        <Text style={styles.signInText}>Sign in to continue</Text>

        {error ? <Text style={globalStyles.errorText}>{error}</Text> : null}

        <View style={styles.inputContainer}>
          <Icon name="phone-outline" size={22} color={colors.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={[globalStyles.input, styles.inputField]} // Use global style, add specific overrides
            placeholder="Phone Number" // Simplified placeholder
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            placeholderTextColor={colors.textSecondary}
            maxLength={10} // Example: Set max length if applicable
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock-outline" size={22} color={colors.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={[globalStyles.input, styles.inputField]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <TouchableOpacity style={[globalStyles.button, styles.loginButton]} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? <ActivityIndicator size="small" color={colors.white} /> : <Text style={globalStyles.buttonText}>Login</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30, // Add more horizontal padding for login screen
  },
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: colors.background, // Match background
  },
  scrollContainer: {
    flexGrow: 1, // Ensure content can grow to fill space
    justifyContent: 'center', // Center content vertically
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 10,
    // fontFamily: 'YourBrandFont-Bold', // Apply custom font if you have one
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  signInText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%', // Use full width from globalStyles.input
    backgroundColor: colors.surface, // Background for the whole container
    borderRadius: 8, // Match input border radius
    marginBottom: 15, // Spacing between inputs
    borderColor: colors.border, // Add border to the container
    borderWidth: 1,
  },
  inputIcon: {
    paddingHorizontal: 15,
  },
  inputField: {
    flex: 1, // Take remaining space
    borderWidth: 0, // Remove individual border, container has it now
    marginBottom: 0, // Remove margin from global style if needed
    paddingHorizontal: 0, // Adjust padding as icon provides left padding
  },
  loginButton: {
    marginTop: 20, // Space above the button
  }
});