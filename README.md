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

## 🚀 Start Server

```bash
npm run dev
```