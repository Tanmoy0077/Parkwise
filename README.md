# Parkwise

Parkwise is a React Native mobile application built with Expo, designed to streamline bicycle parking management. It allows users to register, park their bicycles by scanning QR codes at designated zones, manage their wallet balance, and view their payment history.

## Features

- **User Authentication:** Secure login and logout functionality.
- **Wallet Management:** View current wallet balance.
- **Bicycle Management:**
  - View a list of registered bicycles and their current parking status/zone.
  - Park bicycles by scanning QR codes associated with parking zones.
  - Initiate "Pay & Exit" for parked bicycles.
- **Payment History:** View a detailed list of credit and debit transactions.
- **User Profile:** Display user information and provide a logout option.
- **QR Code Scanning:** Utilizes the device camera to scan QR codes for parking.

## Tech Stack

- **Framework:** React Native with Expo
- **Navigation:** React Navigation (Bottom Tabs and Stack Navigator)
- **State Management:** React Context API (for Authentication)
- **API Communication:** Fetch API for interacting with the backend services.
- **Permissions & Hardware:** `expo-camera` for QR code scanning.
- **Styling:** StyleSheet and global style definitions.

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm or Yarn
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your mobile device (for testing) or an emulator/simulator.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/Tanmoy0077/Parkwise.git
    cd parkwise
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Application

1.  Start the Metro Bundler:
    ```bash
    expo start
    ```
    This will open a new tab in your web browser with the Expo Developer Tools.
2.  You can then:
    - Scan the QR code with the Expo Go app on your iOS or Android device.
    - Run on an Android emulator/device (`a` in the terminal).
    - Run on an iOS simulator (`i` in the terminal, macOS only).

## API Services

All interactions with the backend API are handled in `src/services/Service.js`. This file exports functions for:

- Logging in users (`loginUser`)
- Fetching user data (`getUserData`)
- Fetching card/wallet balance (`getCardBalance`)
- Logging out users (`logoutUser`)
- Updating bicycle parking zone (`updateBicycleZone`)
- Fetching payment history (`getPaymentHistory`)
- Exiting a bicycle from a parking zone (`exitBicycle`)

The services use cookie-based authentication, relying on the `credentials: "include"` option in `fetch` requests.

## Available Screens

- **Login Screen:** (`src/screens/LoginScreen.js`) For user authentication.
- **Home Screen:** (`src/screens/HomeScreen.js`) Displays user greeting, wallet balance, list of bicycles, and provides functionality to scan QR codes for parking and to exit parked bicycles.
- **Payment History Screen:** (`src/screens/PaymentHistoryScreen.js`) Shows current wallet balance and a list of past transactions.
- **Profile Screen:** (`src/screens/ProfileScreen.js`) Displays user's name, phone number, and a logout button.
