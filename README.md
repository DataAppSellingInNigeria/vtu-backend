# VTU Backend

This is the backend API service for the VTU & Bill Payment Platform. Built with Node.js and Express, it provides RESTful endpoints for authentication, wallet management, and VTU service integration.

## 🔧 Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## 📁 Project Structure


- `server.js`: Entry point of the application
- `routes/`: Route handlers that map URLs to controller functions
- `controllers/`: Contains business logic and API endpoint logic
- `models/`: Mongoose schema definitions for MongoDB collections
- `config/`: Configuration files (e.g., DB connection, environment setup)
- `utils/`: Utility functions (e.g., token generation, email helpers)
- `middlewares/`: Custom Express middleware (e.g., authentication, error handling)

## 🌐 VTU Authentication APIs

This API provides authentication and user management features for the VTU platform, including registration, login, profile access, email verification, and password reset.

## Base URL

```
http://localhost:8000/api/auth
```

---

## Endpoints

### 1. Register User

**POST** `/register`  
Registers a new user and sends an email verification link.

**Headers**:
- `Content-Type: application/json`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "08012345678",
  "password": "StrongPassword123"
}
```

**Notes**:
- Uses `multipart/form-data` (no file upload required).
- Sends a verification email after registration.

---

### 2. Login

**POST** `/login`  
Authenticates the user and returns a JWT token in an HTTP-only cookie.

**Headers**:
- `Content-Type: application/json`

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "StrongPassword123"
}
```

**Notes**:
- Rate limited to 5 requests per minute.

---

### 3. Get User Profile

**GET** `/profile`  
Fetches the authenticated user's profile.

**Headers**:
- `Cookie: token=<JWT_TOKEN>`

**Notes**:
- Requires valid JWT token in cookie.

---

### 4. Update User Info

**PUT** `/users/:id`  
Updates the authenticated user's data.

**Headers**:
- `Authorization: Bearer <JWT_TOKEN>`
- `Content-Type: application/json`

**Request Body**:
```json
{
  "name": "Updated Name",
  "phone": "08098765432"
}
```

**Notes**:
- JWT-protected route.
- Only the user can update their own data.

---

### 5. Verify Email

**GET** `/verify-email/:token`  
Verifies the user's email with the token received via email.

**Notes**:
- Token is valid for a limited time (e.g., 24 hours).

---

### 6. Forgot Password

**POST** `/forgot-password`  
Sends a password reset link to the user's email.

**Headers**:
- `Content-Type: application/json`

**Request Body**:
```json
{
  "email": "john@example.com"
}
```

**Notes**:
- User receives an email with a reset token.

---

### 7. Reset Password

**PUT** `/reset-password/:token`  
Resets the user's password using a valid reset token.

**Headers**:
- `Content-Type: application/json`

**Request Body**:
```json
{
  "password": "NewSecurePassword123"
}
```

## 🌐 Wallet API

This module handles wallet operations including auto-creation upon registration, credit/debit logic, and balance retrieval.

### Base URL

```
http://localhost:8000/api/wallet
```

---

### 1. Get Wallet Balance

**GET** `/wallet/balance`

**Description**: Retrieves the wallet balance for the authenticated user.

**Headers**:
- `Authorization: Bearer <JWT_TOKEN>`

**Response**:
```json
{
  "balance": 5000,
  "frozen": 0
}
```

---

### 2. Credit Wallet

**POST** `/wallet/credit`

**Description**: Credits a specific amount to the user’s wallet.

**Headers**:
- `Authorization: Bearer <JWT_TOKEN>`
- `Content-Type: application/json`

**Request Body**:
```json
{
  "amount": 2000,
  "reference": "ref12345"
}
```

**Response**:
```json
{
  "message": "Wallet credited successfully",
  "new_balance": 7000
}
```

---

### 3. Debit Wallet

**POST** `/wallet/debit`

**Description**: Debits a specific amount from the user’s wallet.

**Headers**:
- `Authorization: Bearer <JWT_TOKEN>`
- `Content-Type: application/json`

**Request Body**:
```json
{
  "amount": 1000,
  "reference": "ref67890"
}
```

**Response**:
```json
{
  "message": "Wallet debited successfully",
  "new_balance": 6000
}
```

---

### 4. Freeze Wallet Funds

**POST** `/wallet/freeze`

**Description**: Temporarily locks a portion of the user’s balance.

**Headers**:
- `Authorization: Bearer <JWT_TOKEN>`
- `Content-Type: application/json`

**Request Body**:
```json
{
  "amount": 1500
}
```

**Response**:
```json
{
  "message": "Funds frozen",
  "frozen_amount": 1500
}
```

---

### 5. Unfreeze Wallet Funds

**POST** `/wallet/unfreeze`

**Description**: Releases previously frozen funds back to available balance.

**Headers**:
- `Authorization: Bearer <JWT_TOKEN>`
- `Content-Type: application/json`

**Request Body**:
```json
{
  "amount": 1500
}
```

**Response**:
```json
{
  "message": "Funds unfrozen",
  "available_balance": 6000
}
```

## 🌐 Withdrawal Request API

This API manages withdrawal requests from user wallets and includes both user and admin endpoints.

### Base URL

```
http://localhost:8000/api/withdrawal
```

---

### 1. Submit Withdrawal Request

**POST** `/api/withdrawal`  
Submits a new withdrawal request for the authenticated user.

**Headers**:
- `Authorization: Bearer <JWT_TOKEN>`
- `Content-Type: application/json`

**Request Body**:
```json
{
  "amount": 5000
}
```

**Notes**:
- The specified amount is frozen from the user's wallet upon submission.

---

### 2. Get My Withdrawal Requests

**GET** `/api/withdrawal/me`  
Fetches all withdrawal requests submitted by the authenticated user.

**Headers**:
- `Authorization: Bearer <JWT_TOKEN>`

**Response Example**:
```json
[
  {
    "id": "1",
    "amount": 5000,
    "status": "pending",
    "createdAt": "2025-05-17T08:30:00Z"
  }
]
```

---

### 3. Get All Withdrawal Requests (Admin Only)

**GET** `/api/withdrawal`  
Retrieves all withdrawal requests across all users.

**Headers**:
- `Authorization: Bearer <ADMIN_JWT>`

**Notes**:
- Admin access only.
- Includes user data with each request.

---

### 4. Update Withdrawal Request Status (Admin Only)

**PUT** `/api/withdrawal/:id`  
Approves or rejects a withdrawal request.

**Headers**:
- `Authorization: Bearer <ADMIN_JWT>`
- `Content-Type: application/json`

**Request Body**:
```json
{
  "status": "approved",
  "adminNote": "Processed successfully"
}
```

**Notes**:
- Performs wallet debit/unfreeze based on status.
- Sends email notification to the user.

## 🌐 Transaction Logging & Monitoring

This module handles transaction logging for user payments, wallet funding, VTU actions, and error logging. It also provides admin-level filtered transaction access.

### Base URL

```
http://localhost:8000/api/transaction-logs
```

---

### 1. Log a Transaction Automatically

Transactions are automatically logged during:
- Wallet funding via Paystack webhook
- Airtime/Data/Cable/Electricity/Exam PIN purchases
- Withdrawal approvals

**Fields Logged**:
- `refId`: Unique reference ID (e.g., Paystack or transaction ID)
- `type`: Type of transaction (`wallet_funding`, `airtime`, `data`, etc.)
- `status`: `pending`, `success`, or `failed`
- `amount`: Amount involved
- `service`: Service or provider name (e.g., MTN, DSTV)
- `timestamp`: Auto-assigned by MongoDB
- `userId`: User performing the action

All are stored in the `transactions` collection.

---

### 2. Centralized Error Logging

**Purpose**: Capture all runtime errors and track system behavior.

**Collection**: `logs`

**Fields**:
- `level`: Log severity (`info`, `warn`, `error`)
- `message`: Summary of the event or error
- `context`: Route, user, or action context
- `stackTrace`: Stack trace for debugging (errors only)
- `timestamp`: Log creation time

**Auto-trigger**: via centralized Express middleware using `next(err)`

---

### 3. View Transaction History (User)

**GET** `/`  
Returns all transactions belonging to the authenticated user.

**Headers**:
- `Authorization: Bearer <JWT_TOKEN>`

**Response**:
```json
[
  {
    "type": "wallet_funding",
    "amount": 5000,
    "status": "success",
    "service": "Paystack",
    "timestamp": "2024-06-03T12:00:00.000Z"
  }
]
```

---

### 4. View Admin Filtered Transaction List

**GET** `/admin/transactions`  
Fetches filtered transaction logs (admin only).

**Query Parameters**:
- `type`: (optional) `wallet_funding`, `airtime`, etc.
- `status`: (optional) `success`, `pending`, `failed`
- `userId`: (optional) Filter by user ID
- `startDate`: (optional) `YYYY-MM-DD`
- `endDate`: (optional) `YYYY-MM-DD`

**Headers**:
- `Authorization: Bearer <ADMIN_JWT>`

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "refId": "TXN98765",
      "type": "airtime",
      "status": "success",
      "userId": {
        "name": "Aisha Bello",
        "email": "aisha@example.com"
      },
      "amount": 200,
      "createdAt": "2024-06-01T08:00:00Z"
    }
  ]
}
```

---

### 5. Retrieve all Users

**GET** `/admin/users`
Retrieve a list of all registered users (admin-only).

**Headers**:
- Authorization: Bearer <admin_token>

**Response**:
```json
{
  "success": true,
  "users": [
    {
      "_id": "64cde45678fbb4",
      "name": "Hassan Bello",
      "email": "hassan@example.com",
      "phone": "08123456789",
      "role": "user",
      "createdAt": "2024-05-01T08:00:00.000Z"
    }
  ]
}
```

---

### 6. List of all transactions

**GET** `/admin/transactions/all`
Retrieve a list of all transactions on the platform.

**Headers**:
- Authorization: Bearer <admin_token>

**Response**:
```json
{
  "success": true,
  "transactions": [
    {
      "_id": "trxn001",
      "userId": {
        "name": "Hassan Bello",
        "email": "hassan@example.com"
      },
      "refId": "TX12345",
      "type": "wallet_funding",
      "service": "Paystack",
      "amount": 5000,
      "status": "success",
      "createdAt": "2024-06-01T10:00:00.000Z"
    }
  ]
}
```

---

## 📌 Best Practices

- Limit result set to 100 or paginate
- Add indexes on `refId`, `createdAt`, and `userId`
- Log only errors with stack trace for performance
- Encrypt sensitive user context (if applicable)

# 📲 Services Module – VTU APIs (Data, Airtime & Utilities)

This module provides APIs that allow users to purchase **mobile data**, **airtime**, and **utility services** (such as TV subscriptions and electricity tokens) through integrated VTU (Virtual Top-Up) providers like **Dorosub** and **VTpass**. It ensures secure, wallet-based transactions and logs all successful purchases.

---

## ✅ Features

### 🔹 Mobile Data API
- Purchase mobile data using wallet balance
- Dynamically fetch available data bundle plans by network
- Integrate with VTU providers (e.g., Dorosub, VTpass)
- Log each successful data transaction

### 🔹 Airtime API
- Secure airtime purchase for authenticated users
- Validates wallet balance before initiating purchase
- Connects to third-party VTU providers to complete purchase
- Debits wallet and logs transaction on successful top-up
- Uses middleware for JWT-based authentication

### 🔹 Utility Top-up API (TV, Electricity, etc.)
- Support for TV subscriptions (e.g., DStv, GOtv, Startimes)
- Purchase electricity tokens using meter number and provider
- Validate service parameters before processing
- Deducts wallet balance and logs utility transactions
- Integrates with third-party APIs (e.g., Dorosub, VTpass)

## ✅ Features

- Verify electricity meter (optional)
- Pay electricity bill using wallet balance
- Debit wallet and log transaction
- Integration with third-party VTU providers
- JWT-protected endpoints

## ✅ Features

- Recharge DSTV/GOTV subscriptions
- Wallet balance validation and debit
- Transaction logging
- Integration with third-party VTU provider (e.g., Dorosub)
- 
---

## 🔐 Security
- All endpoints are protected using JWT middleware to ensure only authenticated users can initiate transactions.

---

## 📦 Integrations
- **VTU Providers:** Currently supports Dorosub and VTpass, with a modular structure that allows easy integration of additional providers in the future.

---

### Base URL

```
http://localhost:8000/api/services
```

---

## 🧾 Endpoint

### Purchase Airtime

**POST** `/airtime`
Send airtime to a phone number using the user's wallet balance.

### 🔐 Authentication

```
Authorization: Bearer <JWT_TOKEN>
```

---

## 📥 Request Body

```json
{
  "network": "MTN",
  "phone": "08012345678",
  "amount": 100
}
```

| Field    | Type   | Required | Description                      |
|----------|--------|----------|----------------------------------|
| network  | String | ✅ Yes   | Network name (e.g., MTN, GLO)    |
| phone    | String | ✅ Yes   | Recipient phone number           |
| amount   | Number | ✅ Yes   | Airtime amount (NGN)             |

---

## 📤 Sample Success Response

```json
{
  "message": "Airtime sent successfully",
  "data": {
    "ref": "TX123456789",
    "status": "success",
    "network": "MTN",
    "amount": 100,
    "phone": "08012345678"
  }
}
```

---

## 🔄 Process Flow

1. Client submits airtime request.
2. Backend verifies JWT and fetches user.
3. Wallet balance is checked.
4. VTU provider is called via API.
5. On success:
   - Wallet is debited
   - Transaction is logged
6. Response is sent to user

---

## 📁 Files Involved

- `routes/service.js` – Route definition
- `controllers/serviceController.js` – Purchase logic
- `utils/vtuService.js` – External VTU API integration
- `utils/transaction.js` – Reusable logging function

---

## 🔐 Middleware Used

- `verifyJWT` – Validates access token
- `wallet.balance` – Checked before purchase

---

## ✅ Deliverables

- [x] Airtime API Route
- [x] Wallet Validation
- [x] VTU Integration
- [x] Transaction Logging


### 2. Purchase Data

**POST** `/data`
Purchases a data plan for a specified number.

#### Headers
```
Authorization: Bearer <JWT_TOKEN>
```

#### Body Parameters
```json
{
  "network": "MTN",
  "phone": "08012345678",
  "planCode": "mtn-1gb-daily",
  "amount": 300
}
```

#### Response
```json
{
  "message": "Data purchase successful",
  "data": {
    "ref": "TX123456",
    "status": "success",
    "network": "MTN",
    "amount": 300,
    "phone": "08012345678"
  }
}
```

---

### 3. Fetch Data Plans

**GET** `/data/plans/:network`
Fetches all available data plans for a specific network (e.g., MTN, GLO).

#### Example
```
GET /api/services/data/plans/MTN
Authorization: Bearer <JWT_TOKEN>
```

#### Response
```json
{
  "success": true,
  "plans": [
    {
      "code": "mtn-1gb-daily",
      "price": 300,
      "validity": "1 day",
      "volume": "1GB"
    },
    ...
  ]
}
```

---

## 🔄 Functions Explained

| Function           | Purpose                                  | Usage                                   |
|--------------------|------------------------------------------|-----------------------------------------|
| `fetchDataPlans`   | Get available data bundles by network    | Frontend: for populating dropdown lists |
| `sendDataPurchase` | Trigger actual VTU data delivery         | Backend: after purchase form submitted  |

---

## 📁 Files Involved

- `routes/data.js` – Endpoint definitions
- `controllers/dataController.js` – Main logic
- `services/vtuService.js` – Handles VTU provider requests
- `utils/transactionLogger.js` – Stores logs in DB

---

## ✅ Deliverables

- [x] Data Plan Fetch API
- [x] Data Purchase API
- [x] Wallet Validation
- [x] VTU Integration
- [x] Transaction Logging

---

### 4. Verify Meter Number

**POST** `/api/services/electricity/verify`
Optionally verify a meter number before bill payment.

#### Headers
```
Authorization: Bearer <JWT_TOKEN>
```

#### Body Parameters
```json
{
  "disco": "ikeja-electric",
  "meter_number": "12345678901",
  "meter_type": "prepaid"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "customer_name": "John Doe",
    "meter_verified": true
  }
}
```

---

### 5. Purchase Electricity

**POST** `/api/services/electricity`
Pays an electricity bill to a verified meter using the user's wallet.

#### Headers
```
Authorization: Bearer <JWT_TOKEN>
```

#### Body Parameters
```json
{
  "disco": "ikeja-electric",
  "meter_number": "12345678901",
  "meter_type": "prepaid",
  "amount": 1000
}
```

#### Response
```json
{
  "message": "Electricity bill paid successfully",
  "data": {
    "ref": "ELEC-TX123",
    "status": "success",
    "disco": "ikeja-electric",
    "amount": 1000
  }
}
```

---

## 🔄 Process Flow

1. User may optionally verify meter number.
2. User submits payment form.
3. Backend checks wallet balance.
4. VTU provider is called for transaction.
5. On success:
   - Wallet is debited
   - Transaction is logged
6. User receives confirmation

---

## 📁 Files Involved

- `routes/electricity.js` – Endpoint definitions
- `controllers/electricityController.js` – Verification and payment logic
- `services/vtuService.js` – Handles API requests to electricity providers
- `utils/transactionLogger.js` – Logs billing events

---

## ✅ Deliverables

- [x] Meter Verification API
- [x] Electricity Payment API
- [x] Wallet Validation
- [x] VTU Provider Integration
- [x] Transaction Logging

---

### 6. Recharge DSTV/GOTV etc

**POST** `/api/cable`
Recharges a smart card for DSTV or GOTV with a selected bouquet.

#### Headers
```
Authorization: Bearer <JWT_TOKEN>
```

#### Body Parameters
```json
{
  "provider": "DSTV",
  "smartcard": "1234567890",
  "bouquet": "dstv-padi",
  "amount": 2500
}
```

#### Response
```json
{
  "message": "Cable subscription successful",
  "data": {
    "ref": "DSTV-TX123",
    "status": "success",
    "provider": "DSTV",
    "smartcard": "1234567890",
    "bouquet": "dstv-padi"
  }
}
```

---

## 🔄 Process Flow

1. User selects provider, smart card, bouquet.
2. Backend checks wallet balance.
3. Calls VTU provider to process recharge.
4. On success:
   - Debits wallet
   - Logs transaction
5. Returns confirmation

---

## 📁 Files Involved

- `routes/cable.js` – Endpoint definition
- `controllers/cableController.js` – Subscription logic
- `services/vtuService.js` – External VTU integration
- `utils/transactionLogger.js` – Stores logs in MongoDB

---

## ✅ Deliverables

- [x] Cable Recharge API
- [x] Wallet Validation
- [x] VTU Provider Integration
- [x] Transaction Logging

## 🚀 Start Server

```bash
npm run dev
```