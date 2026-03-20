const Expense = require("../models/Expense");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini with the key from your .env
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

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
		const prompt = `Analyze these expenses: ${dataSummary}. Total is $${total}. 
        Give 2 sentences of advice to save money and a target budget (15% less than total).
        Return ONLY JSON: { "advice": "string", "suggestedBudget": number }`;

		// 5. Generate and Send
		const result = await model.generateContent(prompt);
		res.json(JSON.parse(result.response.text()));
	} catch (error) {
		console.error("Gemini Error:", error);
		res.status(500).json({ error: "AI is offline." });
	}
};
