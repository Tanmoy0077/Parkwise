import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#6200ee',
  primaryVariant: '#3700b3',
  secondary: '#03dac6',
  background: '#ffffff',
  surface: '#ffffff',
  error: '#b00020',
  text: '#000000',
  textSecondary: '#888888',
  onPrimary: '#ffffff',
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
    color: colors.text,
  },
  // Add more shared styles as needed
});