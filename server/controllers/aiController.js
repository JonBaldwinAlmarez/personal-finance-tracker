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
