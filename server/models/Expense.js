const mongoose = require("mongoose");

/**
 * Expense schema representing a single financial transaction.
 *
 * @typedef Expense
 * @property {string} description - Human-readable label for the transaction.
 * @property {number} amount - Monetary value of the expense.
 * @property {string} [category="Uncategorized"] - Optional category name for grouping.
 * @property {Date} [date=Date.now] - Timestamp when the expense was recorded.
 */
const expenseSchema = new mongoose.Schema({
	description: {
		type: String,
		required: [true, "Please add a description"],
	},
	amount: {
		type: Number,
		required: [true, "Please add an amount"],
	},
	category: {
		type: String,
		required: false,
		default: "Uncategorized",
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Expense", expenseSchema);
