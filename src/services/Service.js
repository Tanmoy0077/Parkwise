import Constants from "expo-constants";
const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl;

const LOGIN_API_URL = `${API_BASE_URL}/user/cookie-based-login-user`;
const USER_DATA_API_URL = `${API_BASE_URL}/user/cookie-based-view-user`;
const LOGOUT_API_URL = `${API_BASE_URL}/user/cookie-based-logout-user`;
const CARD_BALANCE_API_URL = `${API_BASE_URL}/card/cookie-based-view-card-details`;
const UPDATE_CYCLE_ZONE_API_URL = `${API_BASE_URL}/cycle/cookie-based-update-entry`;
const PAYMENT_HISTORY_API_URL = `${API_BASE_URL}/card/cookie-based-view-card-details`;
const EXIT_CYCLE_API_URL = `${API_BASE_URL}/cycle/cookie-based-pay-exit-single-user-cycle`;

// Fallback for API_BASE_URL if not set
if (!API_BASE_URL) {
  console.error(
    "apiBaseUrl is not defined in app.json's extra field. Ensure it's set for your current environment."
  );
}

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
    return false;
  }
  return true;
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
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cycleId: cycleId, zoneId: zoneId }), // Adjust payload based on your API requirements
    credentials: "include", // Send session cookie
  });

  if (!response.ok) {
    console.error(
      "Update cycle zone API failed:",
      response.status,
      await response.text()
    );
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

/**
 * Exits a bicycle and processes payment via API.
 * @param {string} cycleId - The ID of the bicycle to exit.
 * @returns {Promise<{success: boolean, message?: string}>} - An object indicating success status and an optional message.
 * @throws {Error} - Throws error if network request fails.
 */
export const exitBicycle = async (cycleId) => {
  try {
    // 1. Fetch current card balance
    const currentBalance = await getCardBalance(); // Assuming getCardBalance is reliable and fetches the correct balance

    // 2. Check if balance is below 20
    if (
      currentBalance === undefined ||
      currentBalance === null ||
      currentBalance < 20
    ) {
      let message = "Insufficient wallet balance. Please top up.";
      if (currentBalance !== undefined && currentBalance !== null) {
        message = `Insufficient wallet balance (₹${currentBalance.toFixed(
          2
        )}). Minimum ₹20 required. Please top up.`;
      }
      console.warn("Exit attempt failed due to low balance:", message);
      return { success: false, message: message };
    }

    // 3. If balance is sufficient, proceed to exit the cycle
    const response = await fetch(EXIT_CYCLE_API_URL, {
      method: "PUT", // Or 'PUT', depending on your API design
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cycleId: cycleId }), // Send cycleId in the request body
      credentials: "include", // Send session cookie
    });

    if (!response.ok) {
      const errorBody = await response.text();
      const errorMessage = `Exit cycle API failed with status ${response.status}.`;
      console.error(errorMessage, errorBody);
      // You might want to parse errorBody if it's JSON and provide a more specific message from the API
      return {
        success: false,
        message: "Failed to exit bicycle. Please try again later.",
      };
    }

    // Assuming the API returns some data on successful exit, you might want to parse it.
    // For now, just returning success.
    // const responseData = await response.json(); // If your API returns JSON
    return { success: true, message: "Bicycle exited successfully." };
  } catch (error) {
    console.error("Error in exitBicycle service:", error);
    // Handle errors from getCardBalance or network issues with the EXIT_CYCLE_API_URL fetch
    let errorMessage = "An unexpected error occurred during the exit process.";
    if (
      error.message &&
      error.message.includes("Failed to fetch card balance")
    ) {
      errorMessage = "Could not verify wallet balance. Please try again.";
    }
    return { success: false, message: errorMessage };
  }
};
