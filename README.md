# Personal Finance Tracker

A lightweight MERN-style expense tracker with a React + Vite frontend and an Express + MongoDB backend.

## Features

- Create, list, update, and delete expense records (REST API)
- Search and sort transactions in the UI
- Spending visualizations (breakdown + timeline)

## Tech Stack

- **Client**: React, TypeScript, Vite, Tailwind CSS, Recharts, Framer Motion
- **Server**: Node.js, Express, Mongoose
- **Database**: MongoDB (local or Atlas)

## Repository Structure

```text
personal-finance-tracker/
  client/              # React + Vite frontend
  server/              # Express + MongoDB API
  README.md            # You are here
```

## Prerequisites

- Node.js (LTS recommended)
- npm (comes with Node.js)
- MongoDB connection string (local MongoDB or MongoDB Atlas)

## Environment Variables

Create a `.env` file in `server/`:

```bash
MONGO_URI="mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority"
PORT=5000
```

Create a `.env` file in `client/` (optional):

```bash
VITE_API_URL="http://localhost:5000"
```

Notes:
- If `VITE_API_URL` is not set, the client defaults to `http://localhost:5000`.
- The server reads `MONGO_URI` from `server/.env`.

## Getting Started (Local Development)

### 1) Start the server

```bash
cd server
npm install
npm run dev
```

The API will be available at `http://localhost:5000`.

### 2) Start the client

```bash
cd client
npm install
npm run dev
```

The web app will be available at the Vite dev URL (usually `http://localhost:5173`).

## API Reference

Base URL: `/api/expenses`

- `GET /api/expenses`: list all expenses
- `POST /api/expenses`: create a new expense
- `PUT /api/expenses/:id`: update an expense
- `DELETE /api/expenses/:id`: delete an expense

Response format:
- Most endpoints return `{ success: boolean, data: any }`

## Scripts

### Server (`server/package.json`)

- `npm run dev`: start with Nodemon (development)
- `npm start`: start with Node (production)

### Client (`client/package.json`)

- `npm run dev`: run Vite dev server
- `npm run build`: build for production
- `npm run preview`: preview the production build locally
- `npm run lint`: run ESLint

## Deployment Notes

- **Client**: set `VITE_API_URL` to point to your deployed API base URL.
- **Server**: ensure `MONGO_URI` is configured and CORS origin matches your deployed frontend domain.

## Security Notes

- Do not commit `.env` files.
- Rotate credentials immediately if a connection string or secret is exposed.

## License

This project is currently unlicensed. Add a `LICENSE` file if you plan to distribute it.
