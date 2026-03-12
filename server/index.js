const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// --- MIDDLEWARE ---
app.use(
	cors({
		origin: [
			"http://localhost:5173",
			"advance-personal-finance-tracker.netlify.app",
		],
		credentials: true,
	}),
); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

// --- ROUTES ---
const expenseRoutes = require("./routes/expenseRoutes"); // Import the expense routes
app.use("/api/expenses", expenseRoutes); // Use the expense routes for any requests to /api/expenses

// --- DATABASE CONNECTION ---
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log("✅ MongoDB connection established!"))
	.catch((err) => console.log("❌ MongoDB connection error:", err));

// --- TEST ROUTE ---
app.get("/", (req, res) => {
	res.send("Finance Tracker API is Live!!!");
});

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
	console.log(`🚀 Server is live and listening on port: ${PORT}`);
});
