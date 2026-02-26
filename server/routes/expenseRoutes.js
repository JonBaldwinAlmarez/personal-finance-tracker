const express = require("express"); // Import Express
const router = express.Router(); // Create a new router
const {
	getExpenses,
	addExpense,
	deleteExpense,
	updateExpense,
} = require("../controllers/expenseController"); // Import the controller function

router.route("/").get(getExpenses).post(addExpense); // Define the route for adding an expense and getting all expenses

router.route("/:id").delete(deleteExpense).put(updateExpense); // Define the route for deleting and updating an expense by ID

module.exports = router; // Export the router
