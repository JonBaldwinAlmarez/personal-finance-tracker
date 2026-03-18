# Server (Express + MongoDB)

This folder contains the backend API for the Personal Finance Tracker.

## Setup

```bash
npm install
```

## Environment

Create `server/.env`:

```bash
MONGO_URI="mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority"
PORT=5000
```

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

## Endpoints

Base URL: `/api/expenses`

- `GET /api/expenses`
- `POST /api/expenses`
- `PUT /api/expenses/:id`
- `DELETE /api/expenses/:id`
