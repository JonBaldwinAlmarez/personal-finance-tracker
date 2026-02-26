const express = require("express"); // Import Express
const router = express.Router(); // Create a new router

const { addExpense } = require("../controllers/expenseController"); // Import the controller function

router.post("/", addExpense); // Define the route for adding an expense

module.exports = router; // Export the router
