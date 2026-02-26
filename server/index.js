const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log("✅ MongoDB connection established!"))
	.catch((err) => console.log("❌ MongoDB connection error:", err));

// Test Route
app.get("/test-db", (req, res) => {
	const status = mongoose.connection.readyState;
	const statusMap = {
		0: "Disconnected",
		1: "Connected",
		2: "Connecting",
		3: "Disconnecting",
	};
	res.json({ status: statusMap[status] });
});

app.get("/", (req, res) => {
	res.send("Finance Tracker API is Live!!!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`🚀 Server is running on port ${PORT}`);
});
