const express = require("express"); // Import Express
const router = express.Router(); // Create a new router

/**
 * Router for all expense-related HTTP endpoints.
 *
 * @module routes/expenseRoutes
 * @see ../controllers/expenseController
 */
const {
	getExpenses,
	addExpense,
	deleteExpense,
	updateExpense,
} = require("../controllers/expenseController"); // Import the controller functions

// Collection-level routes: list all expenses and create new expense
router.route("/").get(getExpenses).post(addExpense);

// Item-level routes: update or delete a single expense by ID
router.route("/:id").delete(deleteExpense).put(updateExpense);

module.exports = router; // Export the router so it can be mounted in the main app
