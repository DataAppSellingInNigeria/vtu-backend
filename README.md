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

## 🚀 Start Server

```bash
npm run dev
```