// Define your API endpoints
const LOGIN_API_URL = 'http://localhost:3000/api/cookie-based-login-user'; // <-- Replace with your actual Login API URL
const USER_DATA_API_URL = 'http://localhost:3000/api/user-data'; // <-- Replace with your actual User Data API URL (GET request)
const LOGOUT_API_URL = 'http://localhost:3000/api/logout'; // <-- Optional: Replace with your actual Logout API URL

/**
 * Attempts to log in the user via API.
 * @param {string} phoneNumber - The user's phone number.
 * @param {string} password - The user's password.
 * @returns {Promise<boolean>} - True if login is successful, false otherwise.
 * @throws {Error} - Throws error if network request fails.
 */
export const loginUser = async (phoneNumber, password) => {
  const response = await fetch(LOGIN_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phone: phoneNumber, password: password }),
    credentials: 'include', // Important: sends cookies and handles Set-Cookie
  });

  if (!response.ok) {
    console.error('Login API failed:', response.status, await response.text());
    return false; // Indicate login failure
  }
  return true; // Indicate login success (cookie should be set)
};

/**
 * Fetches user data from the API (expects session cookie to be sent).
 * @returns {Promise<object>} - The user data object.
 * @throws {Error} - Throws error if network request fails or returns non-ok status.
 */
export const getUserData = async () => {
  const response = await fetch(USER_DATA_API_URL, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
    credentials: 'include', // Crucial: send the session cookie
  });

  if (!response.ok) {
    console.error('Fetch user data API failed:', response.status, await response.text());
    throw new Error(`Failed to fetch user data: ${response.status}`);
  }
  return await response.json(); // Return parsed user data
};

/**
 * Optional: Calls the backend logout endpoint.
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
  try {
    await fetch(LOGOUT_API_URL, { method: 'POST', credentials: 'include' });
  } catch (error) {
    console.error('Logout API call failed:', error);
    // Decide if you want to re-throw or just log
  }
};