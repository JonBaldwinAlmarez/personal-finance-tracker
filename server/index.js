/**
 * Main entry point for the Finance Tracker API.
 * Handles server configuration, middleware, database connection, and routing.
 */

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables from .env file

const app = express();

// --- MIDDLEWARE ---

/**
 * Configure Cross-Origin Resource Sharing (CORS).
 * Restricted to the production frontend URL for security.
 */
app.use(
	cors({
		origin: [
			"https://advance-personal-finance-tracker.netlify.app",
			"http://localhost:5173",
		], // Allow both production and local development frontends
		credentials: true,
	}),
);

// Built-in Express middleware to parse incoming requests with JSON payloads
app.use(express.json());

// --- ROUTES ---

// Mount expense-related routes to the /api/expenses endpoint
const expenseRoutes = require("./routes/expenseRoutes");
app.use("/api/expenses", expenseRoutes);

// Mount AI-related routes to the /api/ai endpoint
const aiRoutes = require("./routes/aiRoutes");
app.use("/api/ai", aiRoutes);

// --- DATABASE CONNECTION ---

/**
 * Establish connection to MongoDB using the URI provided in environment variables.
 * Success and error messages are logged to the console for debugging.
 */
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log("✅ MongoDB connection established!"))
	.catch((err) => console.log("❌ MongoDB connection error:", err));

// --- TEST ROUTE ---

/**
 * Health check route to verify the API is running correctly.
 */
app.get("/", (req, res) => {
	res.send("Finance Tracker API is Live and Ready to Serve!");
});

// --- START SERVER ---

/**
 * Initialize the server on the specified port.
 * Uses process.env.PORT for deployment (e.g., Render) or defaults to 5000 for local dev.
 */
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
	console.log(`🚀 Server is live and listening on port: ${PORT}`);
});
