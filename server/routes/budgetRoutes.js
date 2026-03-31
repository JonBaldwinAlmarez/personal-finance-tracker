const express = require("express");
const router = express.Router();

/**
 * Router for all budget-related HTTP endpoints.
 *
 * @module routes/budgetRoutes
 * @see ../controllers/budgetController
 */
const {
	getAllBudgets,
	getActiveBudget,
	createBudget,
	updateBudget,
	deleteBudget,
	resetBudget,
} = require("../controllers/budgetController");

// Get all budgets
router.get("/", getAllBudgets);

// Get currently active budget
router.get("/current", getActiveBudget);

// Create a new budget
router.post("/", createBudget);

// Update a budget by ID
router.put("/:id", updateBudget);

// Delete a budget by ID
router.delete("/:id", deleteBudget);

// Reset/start a new budget period
router.post("/reset", resetBudget);

module.exports = router;
