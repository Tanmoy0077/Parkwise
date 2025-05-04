import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { getPaymentHistory, getCardBalance } from "../services/Service"; // Import service functions

export default function PaymentHistoryScreen() {
  const [history, setHistory] = useState([]);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Reset state before fetching
        setLoading(true);
        setError(null);
        const { credit, debit } = await getPaymentHistory();

        // Add type and combine transactions
        const combinedHistory = [
          ...credit.map((item) => ({ ...item, type: "credit" })),
          ...debit.map((item) => ({ ...item, type: "debit" })),
        ];

        // Sort by timestamp (newest first)
        combinedHistory.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );

        setHistory(combinedHistory);

        // Fetch balance separately (or could be combined if API allows)
        const currentBalance = await getCardBalance();
        setBalance(currentBalance);
      } catch (err) {
        console.error("Failed to fetch payment data:", err);
        // Provide a more general error message as it could be history or balance failing
        setError("Could not load payment details. Please try again later.");
        // Optionally clear balance if fetch failed
        setBalance(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []); // Empty dependency array ensures this runs only once on mount

  const renderTransaction = ({ item }) => {
    const isCredit = item.type === "credit";
    const amountStyle = isCredit ? styles.creditAmount : styles.debitAmount;
    const date = new Date(item.timestamp);
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

    return (
      <View style={styles.transactionItem}>
        <Text style={styles.transactionDate}>{formattedDate}</Text>
        <Text style={[styles.transactionAmount, amountStyle]}>
          {isCredit ? "+" : "-"} ₹{item.amount.toFixed(2)}
        </Text>
      </View>
    );
  };

  return (
    <View style={globalStyles.container}>
      {/* Display Balance if available, otherwise show loading/default text */}
      <Text style={globalStyles.title}>
        {balance !== null
          ? `Wallet Balance: ₹${balance.toFixed(2)}`
          : loading
          ? "Loading Balance..."
          : "Wallet Balance"}
      </Text>
      <Text style={styles.historySubheader}>Transaction History</Text>
      {/* Added subheader */}
      {loading && (
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
      {!loading && !error && (
        <FlatList
          data={history}
          renderItem={renderTransaction}
          keyExtractor={(item) => item._id} // Use the unique _id from the API
          ListEmptyComponent={
            <Text style={styles.emptyText}>No payment history found.</Text>
          }
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  historySubheader: {
    // Style for the new subheader
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 15, // Add some space below the balance
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 20, // Add some padding at the bottom
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff", // Optional: background for each item
    marginVertical: 4, // Optional: space between items
    borderRadius: 5, // Optional: rounded corners
  },
  transactionDate: {
    fontSize: 14,
    color: "#555",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  creditAmount: {
    color: "green",
  },
  debitAmount: {
    color: "red",
  },
});
