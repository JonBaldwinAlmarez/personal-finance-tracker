const mongoose = require("mongoose");

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
