import React, { createContext, useState, useContext, useEffect } from "react";
import {
  loginUser,
  getUserData,
  logoutUser,
  getCardBalance,
} from "../services/Service";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null); // null means logged out
  const [user, setUser] = useState(null); // Store user details
  const [isLoading, setIsLoading] = useState(false); // For loading states

  const signIn = async (phoneNumber, password) => {
    setIsLoading(true);
    console.log(`Attempting login with phone: ${phoneNumber}`);
    try {
      // Step 1: Attempt login via the service
      const loginSuccess = await loginUser(phoneNumber, password);

      if (loginSuccess) {
        // Step 2: If login succeeded, fetch user data via the service
        console.log("Login successful, fetching user data and balance...");
        // Fetch user data (which includes name and cycles according to the new structure)
        const userDataResponse = await getUserData();
        // Fetch card balance separately (assuming it's still a separate endpoint)
        const balance = await getCardBalance();

        // Step 3: Update state if data fetch is successful
        // Extract data based on the new structure
        const userName = userDataResponse?.name;
        // console.log(userName);
        const userCycles = userDataResponse?.bicycles || [];
        console.log(userCycles);
        // Format the user object for the context state
        const formattedUser = {
          name: userName || "User", // Use extracted name or default
          phoneNumber: phoneNumber, // Add the phone number used for login
          walletBalance: balance, // Add the fetched balance
          bicycles: userCycles,
        };

        setUserToken("loggedIn");
        setUser(formattedUser);
        return true; // Indicate overall success
      } else {
        // Login failed (handled within loginUser service)
        return false;
      }
    } catch (error) {
      // Catch errors from either loginUser or getUserData (e.g., network error, non-ok status in getUserData)
      console.error("Sign in process failed:", error);
      return false; // Network or other error
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserData = async () => {
    if (!userToken) {
      // Only refresh if user is considered logged in
      console.log("User not logged in, skipping refresh.");
      return;
    }
    setIsLoading(true);
    console.log("Refreshing user data and balance...");
    try {
      // Fetch user data (name, cycles)
      const userDataResponse = await getUserData();
      // Fetch card balance
      const balance = await getCardBalance();

      // Extract data
      const userName = userDataResponse?.name;
      const userCycles = userDataResponse?.bicycles || [];

      // Format the user object for the context state
      // Preserve existing phone number if available, as getUserData might not return it
      const updatedUser = {
        name: userName || user?.name || "User", // Prioritize new, then old, then default
        phoneNumber: user?.phoneNumber, // Keep existing phone number
        walletBalance: balance,
        bicycles: userCycles,
      };
      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      // Optionally, you could set an error state here to display to the user
    } finally {
      setIsLoading(false);
    }
  };
  const signOut = async () => {
    setIsLoading(true); // Optional: show loading during logout
    await logoutUser();
    setUserToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ userToken, user, isLoading, signIn, signOut, refreshUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
