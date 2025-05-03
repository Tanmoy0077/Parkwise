import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { colors } from '../styles/globalStyles'; // Import colors if needed for styling

export default function HomeScreen() {
  // Get user data from context
  // Assuming context provides user object with name, walletBalance, and parkingZone
  const { user, isLoading } = useAuth();

  // Handle loading state while user data is fetched
  if (isLoading || !user) {
    return (
      <View style={[globalStyles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Text style={styles.greeting}>Hello, {user.name || 'User'}!</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Wallet Balance</Text>
        <Text style={styles.infoValue}>${user.walletBalance?.toFixed(2) ?? '0.00'}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Bicycle Parked At</Text>
        <Text style={styles.infoValue}>{user.parkingZone || 'Not Parked'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    fontSize: 16,
    marginTop: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.textPrimary, // Assuming you have textPrimary in globalStyles
  },
  infoBox: {
    backgroundColor: colors.lightGray, // Assuming you have lightGray
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 14,
    color: colors.textSecondary, // Assuming textSecondary
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});