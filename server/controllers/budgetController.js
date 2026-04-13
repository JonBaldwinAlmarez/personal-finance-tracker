const Budget = require("../models/Budget");
const Expense = require("../models/Expense");

/**
 * Check if an active budget already exists.
 * If true, creation of another active budget is blocked.
 */
const hasActiveBudget = async () =>
	!!(await Budget.findOne({ isActive: true }));

/**
 * Sum expenses inside a budget date range (excluding future-dated expenses).
 */
const calculateSpentAmount = async (budgetId) => {
	const budget = await Budget.findById(budgetId);
	if (!budget) return 0;

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const expenses = await Expense.find({
		date: { $gte: budget.startDate, $lte: today },
	});

	return expenses.reduce((sum, exp) => sum + exp.amount, 0);
};

/**
 * Compute percentage and alert level.
 * Custom thresholds are [50,70,90] default.
 */

const calculateAlertLevel = (spent, amount, thresholds = [50, 70, 90]) => {
	if (!amount) return { percentage: 0, alertLevel: "error" };

	const percentage = (spent / amount) * 100;
	let alertLevel = "ok";

	if (percentage >= 90) alertLevel = "critical";
	else if (percentage >= 70) alertLevel = "warning";
	else if (percentage >= 50) alertLevel = "info";
	if (percentage > 100) alertLevel = "error";

	return { percentage: Math.round(percentage * 10) / 10, alertLevel };
};

/**
 * GET /api/budgets
 */
exports.getAllBudgets = async (req, res) => {
	try {
		const budgets = await Budget.find().sort({ createdAt: -1 });

		const enriched = await Promise.all(
			budgets.map(async (budget) => {
				const spent = await calculateSpentAmount(budget._id);
				const { percentage, alertLevel } = calculateAlertLevel(
					spent,
					budget.amount,
					budget.alertThresholds,
				);
				return { ...budget.toObject(), spent, percentage, alertLevel };
			}),
		);

		res
			.status(200)
			.json({ success: true, count: enriched.length, data: enriched });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};

/**
 * GET /api/budgets/current
 *
 */
exports.getActiveBudget = async (req, res) => {
	try {
		const activeBudget = await Budget.findOne({ isActive: true });

		if (!activeBudget) {
			return res
				.status(200)
				.json({ success: true, data: null, message: "No active budget." });
		}

		// 1. Calculate the spent amount using your existing helper
		const spent = await calculateSpentAmount(activeBudget._id);

		// 2. Determine expiration status
		const today = new Date();
		today.setHours(0, 0, 0, 0); // Normalize to start of day for fair comparison

		const endDate = new Date(activeBudget.endDate);
		// If today is past the end date, it's expired
		const isExpired = today > endDate;

		// 3. Get your existing alert level calculations
		const { percentage, alertLevel } = calculateAlertLevel(
			spent,
			activeBudget.amount,
			activeBudget.alertThresholds,
		);

		// 4. Send the data back with the new 'isExpired' flag
		res.status(200).json({
			success: true,
			data: {
				...activeBudget.toObject(),
				spent,
				percentage,
				alertLevel,
				isExpired,
			},
		});
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};

/**
 * POST /api/budgets
 */
exports.createBudget = async (req, res) => {
	try {
		if (await hasActiveBudget()) {
			return res.status(400).json({
				success: false,
				error: "Active budget already exists; close it first.",
			});
		}

		const { startDate, endDate } = req.body;
		if (new Date(endDate) <= new Date(startDate)) {
			return res.status(400).json({
				success: false,
				error: "End date must be after start date.",
			});
		}

		const newBudget = await Budget.create(req.body);
		const spent = await calculateSpentAmount(newBudget._id);
		const { percentage, alertLevel } = calculateAlertLevel(
			spent,
			newBudget.amount,
			newBudget.alertThresholds,
		);

		res.status(201).json({
			success: true,
			data: { ...newBudget.toObject(), spent, percentage, alertLevel },
		});
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
};

/**
 * PUT /api/budgets/:id
 */
exports.updateBudget = async (req, res) => {
	try {
		const budget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!budget) {
			return res
				.status(404)
				.json({ success: false, error: "Budget not found." });
		}

		const spent = await calculateSpentAmount(budget._id);
		const { percentage, alertLevel } = calculateAlertLevel(
			spent,
			budget.amount,
			budget.alertThresholds,
		);

		res.status(200).json({
			success: true,
			data: { ...budget.toObject(), spent, percentage, alertLevel },
		});
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
};

/**
 * DELETE /api/budgets/:id
 */
exports.deleteBudget = async (req, res) => {
	try {
		const budget = await Budget.findById(req.params.id);
		if (!budget) {
			return res
				.status(404)
				.json({ success: false, error: "Budget not found." });
		}

		if (budget.isActive) {
			return res.status(400).json({
				success: false,
				error: "Cannot delete active budget; deactivate first.",
			});
		}

		await budget.deleteOne();
		res.status(200).json({ success: true, data: {} });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};

/**
 * POST /api/budgets/reset
 */
exports.resetBudget = async (req, res) => {
	try {
		const activeBudget = await Budget.findOne({ isActive: true });
		if (activeBudget) {
			activeBudget.isActive = false;
			await activeBudget.save();
		}

		const newBudget = await Budget.create({ ...req.body, isActive: true });
		const spent = await calculateSpentAmount(newBudget._id);
		const { percentage, alertLevel } = calculateAlertLevel(
			spent,
			newBudget.amount,
			newBudget.alertThresholds,
		);

		res.status(201).json({
			success: true,
			data: {
				old: activeBudget ? activeBudget.toObject() : null,
				new: { ...newBudget.toObject(), spent, percentage, alertLevel },
			},
		});
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
};
