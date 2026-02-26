const Expense = require("../models/Expense");

exports.addExpense = async (req, res) => {
	try {
		const { desScription, amount, date } = req.body; // Get data from request body

		// Create new expense document
		const newExpense = new Expense({
			desScription,
			amount,
			date,
		});

		res.status(201).json({ success: true, data: newExpense });
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
};
