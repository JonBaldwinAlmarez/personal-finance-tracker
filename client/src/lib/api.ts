const BASED_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Base endpoint for expense-related network requests
const API_URL = `${BASED_URL}/api/expenses`;

// Import shared types
import type { Expense, AIAnalysis, SavedAdviceItem } from "./types";

/**
 * Light-weight API client for talking to the expense backend.
 *
 * All methods return typed promises to keep the rest of the app strongly typed.
 */
export const api = {
	/**
	 * Fetch the list of all expenses from the server.
	 *
	 * @returns {Promise<Expense[]>} Resolves with an array of expenses.
	 * @throws {Error} When the response is not OK, including a brief body preview.
	 */
	async getExpenses(): Promise<Expense[]> {
		const res = await fetch(API_URL);

		if (!res.ok) {
			const text = await res.text();
			throw new Error(
				`Server error: ${res.status}. Received: ${text.substring(0, 20)}...`,
			);
		}

		const json = await res.json();
		// Return the data array from the response object
		return json.data;
	},

	/**
	 * Send a new expense object to the server to be persisted.
	 *
	 * @param {{ description: string; amount: number; date?: string }} expense - Payload for creating an expense.
	 * @returns {Promise<Expense>} Resolves with the created expense returned from the API.
	 */
	async addExpense(expense: {
		description: string;
		amount: number;
		date?: string;
	}): Promise<Expense> {
		const res = await fetch(API_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			// Convert the JavaScript object to a JSON string for the request body
			body: JSON.stringify(expense),
		});
		const json = await res.json();
		// Return the newly created expense record
		return json.data;
	},

	/**
	 * Remove a specific expense from the database using its unique ID.
	 *
	 * @param {string} id - Unique identifier of the expense to delete.
	 * @returns {Promise<void>} Resolves when the server confirms deletion.
	 */
	async deleteExpense(id: string): Promise<void> {
		await fetch(`${API_URL}/${id}`, {
			method: "DELETE",
		});
	},

	async getAIAnalysis(): Promise<AIAnalysis> {
		const res = await fetch(`${BASED_URL}/api/ai/analyze`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
		});

		if (!res.ok) {
			throw new Error("AI is currently taking a nap. Try again later.");
		}

		return await res.json();
	},

	/**
	 * Fetch all saved AI advice.
	 *
	 * @returns {Promise<SavedAdviceItem[]>} Array of saved advice with IDs and dates.
	 */
	async getSavedAdvice(): Promise<SavedAdviceItem[]> {
		const res = await fetch(`${BASED_URL}/api/ai/saved`);

		if (!res.ok) {
			throw new Error("Failed to fetch saved advice.");
		}

		const json = await res.json();
		return json.data;
	},

	async saveAdvice(advice: string, suggestedBudget: number): Promise<any> {
		const res = await fetch(`${BASED_URL}/api/ai/saved`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ advice, suggestedBudget }),
		});

		if (!res.ok) {
			throw new Error("Failed to save advice.");
		}
		return await res.json();
	},

	async deleteAdvice(id: string): Promise<void> {
		const res = await fetch(`${BASED_URL}/api/ai/saved/${id}`, {
			method: "DELETE",
		});

		if (!res.ok) {
			throw new Error("Failed to delete advice.");
		}
	},
};
