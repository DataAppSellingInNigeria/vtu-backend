# VTU Backend

This is the backend API service for the VTU & Bill Payment Platform. Built with Node.js and Express, it provides RESTful endpoints for authentication, wallet management, and VTU service integration.

## 🔧 Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## 📁 Project Structure

- `server.js`: Entry point
- `routes/`: Route handlers
- `controllers/`: Logic handlers
- `models/`: Mongoose schema definitions
- `config/`: DB and service configurations

## 🌐 APIs

- `POST /api/login` – Login user
- `POST /api/register` – Register user
- `GET /api/wallet` – Check wallet balance

## 🚀 Start Server

```bash
npm run dev
```