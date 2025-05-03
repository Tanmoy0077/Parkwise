import React, { createContext, useState, useContext, useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage'; // Or your preferred storage
import { loginUser, getUserData, logoutUser } from '../services/Service'; // Import API functions

const AuthContext = createContext(null);
 
export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null); // null means logged out
  const [user, setUser] = useState(null); // Store user details
  const [isLoading, setIsLoading] = useState(false); // For loading states

  // Optional: Check initial login state (e.g., from storage) when app loads
  // useEffect(() => {
  //   const bootstrapAsync = async () => {
  //     let token;
  //     try {
  //       // Check if a session/token exists (maybe check if a cookie is valid via an API call)
  //       // For simplicity, we might just check a stored flag
  //       token = await AsyncStorage.getItem('userToken');
  //       if (token) {
  //          // You might want to verify the token/session with the backend here
  //          setUserToken(token);
  //          // Fetch user data if needed based on the valid session/token
  //          // setUser(fetchedUserData);
  //       }
  //     } catch (e) {
  //       // Restoring token failed
  //     }
  //     setIsLoading(false); // Done checking
  //   };
  //   setIsLoading(true);
  //   bootstrapAsync();
  // }, []);

  const signIn = async (phoneNumber, password) => {
    setIsLoading(true);
    console.log(`Attempting login with phone: ${phoneNumber}`);
    try {
      // Step 1: Attempt login via the service
      const loginSuccess = await loginUser(phoneNumber, password);

      if (loginSuccess) {
        // Step 2: If login succeeded, fetch user data via the service
        console.log('Login successful, fetching user data...');
        const userData = await getUserData(); // Service handles errors internally or throws
        
        // Step 3: Update state if data fetch is successful
        setUserToken('loggedIn');
        setUser(userData);
        // Optional: await AsyncStorage.setItem('userToken', 'loggedIn');
        return true; // Indicate overall success
      } else {
        // Login failed (handled within loginUser service)
        return false; 
      }
    } catch (error) {
      // Catch errors from either loginUser or getUserData (e.g., network error, non-ok status in getUserData)
      console.error('Sign in process failed:', error);
      return false; // Network or other error
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true); // Optional: show loading during logout
    await logoutUser(); // Call the logout service function
    // Clear local state regardless of API call success/failure
    setUserToken(null);
    setUser(null);
    // Optional: Clear stored token/flag
    // await AsyncStorage.removeItem('userToken');
  };

  return (
    <AuthContext.Provider value={{ userToken, user, isLoading, signIn, signOut }}> 
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);