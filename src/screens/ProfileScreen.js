import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // Example icon set
import { useAuth } from '../context/AuthContext';
import { globalStyles, colors } from '../styles/globalStyles';

export default function ProfileScreen() {
  const { user, signOut } = useAuth(); // Assuming useAuth provides user object

  // Placeholder user data if not available from context yet or for testing
  const displayUser = user || {
    name: 'Guest User',
    phoneNumber: 'N/A'
    // avatarUrl is no longer needed here as we use a fixed asset
  };
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Hey There!</Text>
      {/* Use require for local assets */}
      <View style={styles.profileInfoContainer}>
        <Image source={require('../../assets/boy.png')} style={styles.avatar} />
        <Text style={styles.userName}>{displayUser.name}</Text>
        <Text style={styles.userPhone}>{displayUser.phoneNumber}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <MaterialCommunityIcons name="logout" size={22} color={colors.white} style={styles.logoutIcon} />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  profileInfoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60, // Make it circular
    marginBottom: 15,
    borderWidth: 2,
    borderColor: colors.primary, // Optional border
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 5,
  },
  userPhone: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: colors.error,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25, // Rounded corners
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    // Add shadow for depth (optional)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutIcon: {
    marginRight: 10,
  },
});