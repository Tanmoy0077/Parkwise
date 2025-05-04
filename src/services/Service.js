// Define your API endpoints
const LOGIN_API_URL = "http://192.168.10.3:3000/api/user/cookie-based-login-user"; // <-- Replace with your actual Login API URL
const USER_DATA_API_URL =
  "http://192.168.10.3:3000/api/user/cookie-based-view-user"; // <-- Replace with your actual User Data API URL (GET request)
const LOGOUT_API_URL =
  "http://192.168.10.3:3000/api/user/cookie-based-logout-user"; // <-- Optional: Replace with your actual Logout API URL
const CARD_BALANCE_API_URL =
  "http://192.168.10.3:3000/api/card/cookie-based-view-card-details"; // <-- Replace with your actual Card Balance API URL
const UPDATE_CYCLE_ZONE_API_URL =
  "http://192.168.10.3:3000/api/cycle/update-zone"; // <-- Replace with your actual Update Zone API URL (POST request)
const PAYMENT_HISTORY_API_URL =
  "http://192.168.10.3:3000/api/card/cookie-based-view-card-details"; // <-- Assuming this endpoint returns the full history as shown in the example
/**
 * Attempts to log in the user via API.
 * @param {string} phoneNumber - The user's phone number.
 * @param {string} password - The user's password.
 * @returns {Promise<boolean>} - True if login is successful, false otherwise.
 * @throws {Error} - Throws error if network request fails.
 */
export const loginUser = async (phoneNumber, password) => {
  const response = await fetch(LOGIN_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userPhone: phoneNumber, userPassword: password }),
    credentials: "include", // Important: sends cookies and handles Set-Cookie
  });

  if (!response.ok) {
    console.error("Login API failed:", response.status, await response.text());
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
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    credentials: "include", // Crucial: send the session cookie
  });

  if (!response.ok) {
    console.error(
      "Fetch user data API failed:",
      response.status,
      await response.text()
    );
    throw new Error(`Failed to fetch user data: ${response.status}`);
  }
  const responseData = await response.json();
  const userName = responseData?.data?.user?.userName;
  const userCycles = responseData?.data?.userCycles || [];
  console.log(userCycles);
  // Format and return the extracted data
  return {
    name: userName || "User", // Use extracted name or default
    bicycles: userCycles.map((cycle) => ({
      _id: cycle.cycleId,
      zone: cycle.zoneId,
    })), // Map cycles to the expected format
  }; // Return parsed user data
};

export const getCardBalance = async () => {
  const response = await fetch(CARD_BALANCE_API_URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    credentials: "include", // Send session cookie if needed
  });

  if (!response.ok) {
    console.error(
      "Fetch card balance API failed:",
      response.status,
      await response.text()
    );
    throw new Error(`Failed to fetch card balance: ${response.status}`);
  }
  const responseData = await response.json();
  return responseData?.data?.currentBalance; // Extract balance, handles potential missing fields gracefully
};

/**
 * Optional: Calls the backend logout endpoint.
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
  try {
    await fetch(LOGOUT_API_URL, { method: "POST", credentials: "include" });
  } catch (error) {
    console.error("Logout API call failed:", error);
    // Decide if you want to re-throw or just log
  }
};

/**
 * Updates the zone for a specific bicycle via API.
 * @param {string} cycleId - The ID of the bicycle to update.
 * @param {string} zoneId - The new zone ID scanned from the QR code.
 * @returns {Promise<boolean>} - True if the update is successful, false otherwise.
 * @throws {Error} - Throws error if network request fails.
 */
export const updateBicycleZone = async (cycleId, zoneId) => {
  const response = await fetch(UPDATE_CYCLE_ZONE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cycleId: cycleId, zoneId: zoneId }), // Adjust payload based on your API requirements
    credentials: "include", // Send session cookie
  });

  if (!response.ok) {
    console.error("Update cycle zone API failed:", response.status, await response.text());
    // Consider throwing a more specific error based on response status/body
    return false; // Indicate update failure
  }

  return true; // Indicate update success
};

/**
 * Fetches payment history (credit/debit) from the API.
 * @returns {Promise<{credit: Array<object>, debit: Array<object>}>} - An object containing credit and debit transaction arrays.
 * @throws {Error} - Throws error if network request fails or returns non-ok status.
 */
export const getPaymentHistory = async () => {
  const response = await fetch(PAYMENT_HISTORY_API_URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    credentials: "include", // Send session cookie
  });

  if (!response.ok) {
    console.error(
      "Fetch payment history API failed:",
      response.status,
      await response.text()
    );
    throw new Error(`Failed to fetch payment history: ${response.status}`);
  }
  const responseData = await response.json();
  // Extract credit and debit arrays, providing empty arrays as defaults
  const credit = responseData?.data?.credit || [];
  const debit = responseData?.data?.debit || [];
  return { credit, debit };
};
