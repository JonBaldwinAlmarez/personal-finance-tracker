const Expense = require("../models/Expense");

// @desc    Get all expenses
// @route   GET /api/expenses
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

// @desc    Add new expense
// @route   POST /api/expenses
exports.addExpense = async (req, res) => {
	try {
		const newExpense = await Expense.create(req.body);

		res.status(201).json({ success: true, data: newExpense });
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
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

// @desc    Update expense
// @route   PUT /api/expenses/:id
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
