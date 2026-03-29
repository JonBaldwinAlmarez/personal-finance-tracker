const mongoose = require("mongoose");

/**
 * SavedAdvice schema representing a single saved AI advice entry.
 *
 * @typedef SavedAdvice
 * @property {string} advice - The AI-generated advice text.
 * @property {number} suggestedBudget - The suggested budget amount from AI.
 * @property {Date} dateSaved - Timestamp when the advice was saved.
 */
const savedAdviceSchema = new mongoose.Schema({
	advice: {
		type: String,
		required: [true, "Please add advice text"],
	},
	suggestedBudget: {
		type: Number,
		required: [true, "Please add a suggested budget"],
	},
	dateSaved: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("SavedAdvice", savedAdviceSchema);
