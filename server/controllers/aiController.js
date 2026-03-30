const Expense = require("../models/Expense");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const SavedAdvice = require("../models/SavedAdvice");
const { request } = require("node:http");

// Initialize Gemini with the key from your .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Get all saved AI advice from the database.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getSavedAdvice = async (req, res) => {
	try {
		const items = await SavedAdvice.find().sort({ dateSaved: -1 }); // Sort by most recent
		res.json({ data: items });
	} catch (error) {
		console.error("Error fetching saved advice:", error);
		res.status(500).json({ error: "Failed to fetch saved advice." });
	}
};

/**
 * Save a new AI advice to the database.
 *
 * @param {Object} req - Express request object with advice and suggestedBudget
 * @param {Object} res - Express response object
 */
exports.saveAdvice = async (req, res) => {
	try {
		const { advice, suggestedBudget } = req.body;

		if (!advice || !suggestedBudget) {
			return res
				.status(400)
				.json({ error: "Advice and suggested budget are required." });
		}

		const saved = await SavedAdvice.create({ advice, suggestedBudget });
		res.status(201).json(saved);
	} catch (error) {
		console.error("Error saving advice:", error);
		res.status(500).json({ error: "Failed to save advice." });
	}
};

/**
 * Delete a saved AI advice by ID.
 *
 * @param {Object} req - Express request object with ID parameter
 * @param {Object} res - Express response object
 */
exports.deleteAdvice = async (req, res) => {
	try {
		const deletedItem = await SavedAdvice.findByIdAndDelete(req.params.id);

		if (!deletedItem) {
			return res.status(404).json({ error: "Advice not found." });
		}

		res.status(200).json({ message: "Advice deleted successfully." });
	} catch (error) {
		console.error("Error deleting advice:", error);
		res.status(500).json({ error: "Failed to delete advice." });
	}
};

exports.getSpendingAnalysis = async (req, res) => {
	try {
		// 1. Get the data from MongoDB
		const expenses = await Expense.find();

		if (expenses.length === 0) {
			return res.json({
				advice: "Add some expenses first!",
				suggestedBudget: 0,
			});
		}

		// 2. Prepare the data for the AI
		const total = expenses.reduce((sum, e) => sum + e.amount, 0);
		const dataSummary = expenses
			.map((e) => `${e.description}: $${e.amount}`)
			.join(", ");

		// 3. Set up the Model (gemini-3-flash-preview is the fast/free one)
		const model = genAI.getGenerativeModel({
			model: "gemini-3-flash-preview",
			generationConfig: { responseMimeType: "application/json" },
		});

		// 4. The Prompt
		const prompt = `
		You are a personal finance assistant inside a finance tracking app.

		Your goal is to analyze a user’s transaction history and provide practical, personalized advice to help them reduce spending and improve financial habits.

		INPUT DATA:
		You will receive a list of transactions. Each transaction includes:
		- _id: string;
		- description: string;
		- amount: number;
		- category: string; (optional)
		- date: string; (optional)

		YOUR TASK:
		1. Analyze spending patterns:
		- Identify top spending categories
		- Detect unusual or high expenses
		- Spot frequent small expenses that add up

		2. Provide clear and actionable advice:
		- Suggest specific ways to reduce spending
		- Recommend realistic adjustments (not extreme or unrealistic cuts)
		- Focus on the categories where the user spends the most

		3. Be personalized:
		- Reference actual categories and behavior from the data
		- Avoid generic advice unless necessary

		4. Keep tone:
		- Friendly and supportive
		- Not judgmental
		- Simple and easy to understand

		5. Output format:
		- Short summary of spending behavior
		- 3–5 actionable recommendations
		- Optional: one encouraging sentence

		CONSTRAINTS:
		- Do NOT give investment advice
		- Do NOT assume missing data
		- Do NOT shame or criticize the user
		- Keep response under BELOW 4 sentences
		
		Analyze these expenses: ${dataSummary}. Total is $${total}.
        Return ONLY JSON: { "advice": "string", "suggestedBudget": number }`;

		// 5. Generate and Send
		const result = await model.generateContent(prompt);
		res.json(JSON.parse(result.response.text()));
	} catch (error) {
		console.error("Gemini Error:", error);
		res.status(500).json({ error: "AI is offline." });
	}
};
