const Expense = require("../models/Expense");

/**
 * Get all expenses stored in the database.
 *
 * @route GET /api/expenses
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response containing the list of expenses.
 */
exports.getExpenses = async (req, res) => {
	try {
		const expenses = await Expense.find();
		res.status(200).json({
			success: true,
			count: expenses.length,
			data: expenses,
		});
	} catch (error) {
		res.status(500).json({ success: false, error: "Server Error" });
	}
};

/**
 * Create and persist a new expense document.
 *
 * @route POST /api/expenses
 * @param {import("express").Request} req - Express request containing expense data in the body.
 * @param {import("express").Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response with the created expense or validation error.
 */
exports.addExpense = async (req, res) => {
	try {
		const newExpense = await Expense.create(req.body);

		res.status(201).json({ success: true, data: newExpense });
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
};

/**
 * Delete an existing expense by its identifier.
 *
 * @route DELETE /api/expenses/:id
 * @param {import("express").Request} req - Express request object with `id` URL parameter.
 * @param {import("express").Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response indicating success or failure.
 */
exports.deleteExpense = async (req, res) => {
	try {
		const expense = await Expense.findById(req.params.id);

		if (!expense) {
			return res
				.status(404)
				.json({ success: false, error: "No expense found" });
		}

		await expense.deleteOne();
		res.status(200).json({ success: true, data: {} });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};

/**
 * Update an existing expense with new data.
 *
 * @route PUT /api/expenses/:id
 * @param {import("express").Request} req - Express request with `id` param and updated expense data in the body.
 * @param {import("express").Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response containing the updated expense or error details.
 */
exports.updateExpense = async (req, res) => {
	try {
		const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!expense) {
			return res
				.status(404)
				.json({ success: false, error: "No expense found" });
		}

		res.status(200).json({ success: true, data: expense });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};
