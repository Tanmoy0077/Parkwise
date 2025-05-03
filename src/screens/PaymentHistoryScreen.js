import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

export default function PaymentHistoryScreen() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Payment History</Text>
      <Text style={styles.content}>Your past payments will be listed here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    fontSize: 16,
  },
});