// Base endpoint for expense-related network requests
const API_URL = "/api/expenses";

// Define the structure of an Expense object for type safety
export interface Expense {
	_id: string;
	description: string;
	amount: number;
	category?: string;
	date?: string;
}

export const api = {
	// Fetch the list of all expenses from the server
	async getExpenses(): Promise<Expense[]> {
		const res = await fetch(API_URL);
		const json = await res.json();
		// Return the data array from the response object
		return json.data;
	},

	// Send a new expense object to the server to be saved
	async addExpense(expense: {
		description: string;
		amount: number;
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

	// Remove a specific expense from the database using its unique ID
	async deleteExpense(id: string): Promise<void> {
		await fetch(`${API_URL}/${id}`, {
			method: "DELETE",
		});
	},
};
