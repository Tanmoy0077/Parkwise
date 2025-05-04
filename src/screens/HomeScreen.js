import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Button, // Can use Button for simplicity in modal or TouchableOpacity
} from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { useAuth } from "../context/AuthContext";
import { colors } from "../styles/globalStyles"; // Import colors if needed for styling
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Example using MaterialCommunityIcons
import { Camera, CameraType, BarCodeType, CameraView } from "expo-camera"; // Import specific types
import { updateBicycleZone } from "../services/Service"; // Import the new service function

export default function HomeScreen() {
  // Get user data from context
  // Assuming context provides user object with name, walletBalance, and parkingZone
  const { user, isLoading, refreshUserData } = useAuth(); // Assuming refreshUserData exists in context

  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [isBicycleSelectionModalVisible, setIsBicycleSelectionModalVisible] =
    useState(false);
  const [selectedBicycleId, setSelectedBicycleId] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false); // To prevent multiple scans
  const [isUpdatingZone, setIsUpdatingZone] = useState(false); // State for update loading

  // --- Camera Permission Logic (Moved Before Early Return) ---
  useEffect(() => {
    // Request permission when component mounts or when needed
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };
    // You might want to call this only when the user intends to scan
    // getCameraPermissions(); // Consider calling this conditionally later if needed
  }, []);

  // Handle loading state while user data is fetched
  if (isLoading || !user) {
    return (
      <View style={[globalStyles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const renderBicycleItem = ({ item }) => (
    <View style={styles.bicycleItem}>
      <Icon
        name="bike"
        size={24}
        color={colors.primary}
        style={styles.bikeIcon}
      />
      <View style={styles.bicycleTextContainer}>
        <Text style={styles.bicycleId}>ID: {item._id}</Text>
        <Text style={styles.bicycleZone}>Zone: {item.zone || "N/A"}</Text>
      </View>
    </View>
  );

  // --- QR Code Scanning Logic ---

  const handleScanButtonPress = async () => {
    if (!user.bicycles || user.bicycles.length === 0) {
      Alert.alert(
        "No Bicycles",
        "You don't have any registered bicycles to park."
      );
      return;
    }

    // Open the bicycle selection modal
    setIsBicycleSelectionModalVisible(true);
  };

  const startScan = async (bicycleId) => {
    // Check permission status again or request if not granted
    let { status } = await Camera.getCameraPermissionsAsync(); // Use let as it might be reassigned
    if (status !== "granted") {
      const { status: newStatus } =
        await Camera.requestCameraPermissionsAsync();
      if (newStatus !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Camera permission is required to scan QR codes."
        );
        return;
      }
      status = newStatus; // Update status if permission was just granted
      setHasPermission(true); // Update state if granted now
    } else {
      setHasPermission(true); // Already granted
    }

    // Proceed only if permission is granted
    if (status === "granted" || hasPermission) {
      setSelectedBicycleId(bicycleId);
      setScanned(false); // Reset scanned state before opening camera
      setIsCameraVisible(true);
    } else {
      Alert.alert(
        "Permission Denied",
        "Camera permission is required to scan QR codes."
      );
    }
  };

  // Function called when a bicycle is selected from the modal
  const handleBicycleSelected = (bicycleId) => {
    setIsBicycleSelectionModalVisible(false); // Close selection modal
    // Wait a tiny bit for the modal to close before starting scan to avoid UI glitches
    setTimeout(() => startScan(bicycleId), 100);
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned) return; // Prevent multiple triggers
    setScanned(true); // Mark as scanned
    setIsCameraVisible(false); // Close camera immediately
    console.log(
      `Scanned Zone ID: ${data} (Type: ${type}) for Bicycle ID: ${selectedBicycleId}`
    );
    Alert.alert(
      "QR Code Scanned",
      `Zone ID: ${data}\nUpdate zone for Bicycle ${selectedBicycleId}?`,
      [
        { text: "Cancel", onPress: () => setScanned(false), style: "cancel" }, // Allow rescanning if cancelled
        {
          text: "Confirm",
          onPress: () => handleZoneUpdate(selectedBicycleId, data),
        },
      ]
    );
  };

  // --- Zone Update Logic ---
  const handleZoneUpdate = async (bicycleId, zoneId) => {
    if (!bicycleId || !zoneId) {
      Alert.alert("Error", "Missing bicycle or zone information.");
      setScanned(false); // Allow rescanning
      return;
    }

    setIsUpdatingZone(true);
    try {
      const success = await updateBicycleZone(bicycleId, zoneId);
      if (success) {
        Alert.alert(
          "Success",
          `Bicycle ${bicycleId} parked in zone ${zoneId}.`
        );
        await refreshUserData(); // Refresh user data to show updated zone
      } else {
        // Assuming updateBicycleZone returns false on failure handled by the service
        Alert.alert(
          "Update Failed",
          "Could not update the bicycle zone. Please try again."
        );
        setScanned(false); // Allow rescanning on failure
      }
    } catch (error) {
      console.error("Zone update error:", error);
      Alert.alert(
        "Error",
        "An unexpected error occurred while updating the zone."
      );
      setScanned(false); // Allow rescanning on error
    } finally {
      setIsUpdatingZone(false);
    }
  };

  return (
    // Use ScrollView if content might exceed screen height
    <ScrollView
      style={globalStyles.container}
      contentContainerStyle={styles.scrollContainer}
    >
      <View style={styles.header}>
        {/* Placeholder for User Avatar */}
        <Image // Use require for local default asset
          source={require("../../assets/boy.png")} // Adjust path if needed
          style={styles.avatar}
        />
        <Text style={styles.greeting}>Hello, {user.name || "User"}!</Text>
      </View>

      <View style={styles.infoBox}>
        <Icon name="wallet-outline" size={30} color={colors.primary} />
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoTitle}>Wallet Balance</Text>
          {/* Changed currency symbol */}
          <Text style={styles.infoValue}>
            ₹{user.walletBalance?.toFixed(2) ?? "0.00"}
          </Text>
        </View>
      </View>

      {/* Show indicator while updating zone */}
      {isUpdatingZone && (
        <ActivityIndicator
          size="small"
          color={colors.primary}
          style={styles.updateIndicator}
        />
      )}

      {/* QR Code Scan Button */}
      <TouchableOpacity
        style={styles.scanButton}
        onPress={handleScanButtonPress}
      >
        <Icon name="qrcode-scan" size={24} color={colors.white} />
        <Text style={styles.scanButtonText}>Scan QR to Park</Text>
      </TouchableOpacity>

      {/* Display Bicycles and Zones */}
      <View style={styles.bicycleListContainer}>
        <Text style={styles.listTitle}>Your Bicycles</Text>
        {user.bicycles && user.bicycles.length > 0 ? (
          <FlatList // FlatList inside ScrollView needs careful handling or fixed height, but for short lists it's often okay.
            data={user.bicycles}
            renderItem={renderBicycleItem}
            keyExtractor={(item) => String(item._id)} // Use bicycle ID as the key
            scrollEnabled={false} // Disable FlatList scrolling if ScrollView handles it
          />
        ) : (
          <Text style={styles.noBicyclesText}>No bicycles registered.</Text>
        )}
      </View>

      {/* --- Bicycle Selection Modal --- */}
      <Modal
        animationType="slide"
        transparent={true} // Make background semi-transparent
        visible={isBicycleSelectionModalVisible}
        onRequestClose={() => setIsBicycleSelectionModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Bicycle to Park</Text>
            <FlatList
              data={user.bicycles}
              keyExtractor={(item) => String(item._id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.bicycleSelectItem}
                  onPress={() => handleBicycleSelected(item._id)}
                >
                  <Icon name="bike" size={20} color={colors.primary} />
                  <Text style={styles.bicycleSelectText}>
                    ID: {item._id} (Zone: {item.zone || "N/A"})
                  </Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />} // Add separators
            />
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setIsBicycleSelectionModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Camera Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={isCameraVisible}
        onRequestClose={() => {
          setIsCameraVisible(false);
          setScanned(false); // Reset scanned state on close
        }}
      >
        <View style={styles.cameraContainer}>
          {hasPermission === null && (
            <Text>Requesting camera permission...</Text>
          )}
          {hasPermission === false && (
            <Text>No access to camera. Please enable it in settings.</Text>
          )}
          {hasPermission && (
            <CameraView
              style={styles.cameraPreview}
              facing="back" // Use imported CameraType
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned} // Only scan if not already scanned
              barcodeScannerSettings={{
                barcodeTypes: [
                  "aztec",
                  "ean13",
                  "ean8",
                  "qr",
                  "pdf417",
                  "upc_e",
                  "datamatrix",
                  "code39",
                  "code93",
                  "itf14",
                  "codabar",
                  "code128",
                  "upc_a",
                ],
              }}
            />
          )}
          {/* Position Cancel button at the bottom */}
          <TouchableOpacity
            style={styles.cancelScanButton}
            onPress={() => setIsCameraVisible(false)}
          >
            <Text style={styles.cancelScanButtonText}>Cancel Scan</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20, // Add padding at the bottom if using ScrollView
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    // fontFamily: 'YourCustomFont-Bold', // Example: Apply custom font
    marginLeft: 15, // Space between avatar and text
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    justifyContent: "space-between", // Justify content (avatar left, text right)
    width: "100%", // Ensure header takes full width for alignment
    paddingHorizontal: 5, // Add some horizontal padding if needed
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30, // Make it circular
    backgroundColor: colors.lightGray, // Placeholder background
  },
  infoBox: {
    backgroundColor: colors.surface, // Use surface color from global styles
    padding: 20,
    borderRadius: 8,
    marginBottom: 25,
    width: "100%",
    flexDirection: "row", // Align icon and text horizontally
    alignItems: "center", // Center items vertically
    // Add shadow for depth (optional, platform-specific)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTextContainer: {
    marginLeft: 15, // Space between icon and text
  },
  infoTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 5,
    // fontFamily: 'YourCustomFont-Regular', // Example: Apply custom font
  },
  infoValue: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
    // fontFamily: 'YourCustomFont-Bold', // Example: Apply custom font
  },
  bicycleListContainer: {
    width: "100%",
    marginTop: 15,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 10,
    // fontFamily: 'YourCustomFont-Bold', // Example: Apply custom font
    // textAlign: 'center', // Keep centered if preferred
  },
  bicycleItem: {
    backgroundColor: colors.surface, // Consistent background
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    // Add subtle border (optional)
    // borderColor: colors.border,
    // borderWidth: 1,
  },
  bikeIcon: {
    marginRight: 15, // Space between icon and text
  },
  bicycleTextContainer: {
    flex: 1, // Allow text to take remaining space
  },
  bicycleId: {
    fontSize: 15,
    color: colors.textPrimary,
    // fontFamily: 'YourCustomFont-Regular', // Example: Apply custom font
    marginBottom: 3, // Space between ID and Zone
  },
  bicycleZone: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: "500",
    // fontFamily: 'YourCustomFont-Regular', // Example: Apply custom font
  },
  noBicyclesText: {
    textAlign: "center",
    color: colors.textSecondary,
    marginTop: 10,
    // fontFamily: 'YourCustomFont-Regular', // Example: Apply custom font
  },
  loadingContainer: {
    flex: 1, // Ensure loading container takes full screen
    justifyContent: "center",
    alignItems: "center",
  },
  scanButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 25,
    // Shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  scanButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  updateIndicator: {
    marginVertical: 10, // Add some space around the indicator
  },
  // --- Camera Modal Styles ---
  cameraContainer: {
    flex: 1,
    justifyContent: "flex-end", // Push content (button) to the bottom
    alignItems: "center", // Center content horizontally
    backgroundColor: "black",
  },
  cameraPreview: {
    // Use StyleSheet.absoluteFillObject for fullscreen or define specific dimensions
    ...StyleSheet.absoluteFillObject,
    zIndex: 0, // Ensure preview is behind the button
  },
  cancelScanButton: {
    position: "absolute", // Position absolutely within the container
    bottom: 40, // Distance from the bottom
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent white
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    zIndex: 1, // Ensure button is above the camera preview
  },
  cancelScanButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  // --- Bicycle Selection Modal Styles ---
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 20,
    width: "85%",
    maxHeight: "70%", // Limit height
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 15,
    textAlign: "center",
  },
  bicycleSelectItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  bicycleSelectText: {
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 10,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 5,
  },
});
