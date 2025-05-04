import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#6200ee',
  primaryVariant: '#3700b3',
  secondary: '#03dac6', // Teal accent
  background: '#ffffff',
  surface: '#ffffff',
  error: '#b00020',
  textPrimary: '#000000', // Renamed for clarity
  textSecondary: '#888888',
  onPrimary: '#ffffff',
  white: '#ffffff', // Explicit white color
  onSecondary: '#000000',
  border: '#cccccc',
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.textPrimary,
  },
  // Input style used in LoginScreen
  input: {
    height: 50,
    borderColor: colors.border,
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: colors.surface,
    color: colors.textPrimary, // Ensure text color is set
    width: '100%', // Default to full width within its container
  },
  // Button style used in LoginScreen
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', // Default to full width
    minHeight: 50, // Consistent height
  },
  buttonText: {
    color: colors.onPrimary, // Use onPrimary for text on primary background
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Error text style used in LoginScreen
  errorText: {
    color: colors.error,
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 14,
  },
});