const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
	amount: {
		type: Number,
		required: [true, "Please add a budget amount"],
		min: [0.01, "Budget amount must be greater than zero"],
	},
	startDate: {
		type: Date,
		required: [true, "Please add a start date"],
	},
	endDate: {
		type: Date,
		required: [true, "Please add an end date"],
	},
	isActive: {
		type: Boolean,
		default: true,
	},
	alertThreshold: {
		type: [Number],
		default: [50, 70, 90],
	},
	note: {
		type: String,
		maxlength: [500, "Note cannot exceed 500 characters"],
	},
	createAT: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Budget", budgetSchema);
