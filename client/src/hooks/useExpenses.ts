import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import type { Expense } from "@/lib/types";

/**
 * React hook that encapsulates all expense-related data fetching and mutations.
 *
 * Handles loading/error state, exposes CRUD helpers, and computes
 * a derived total balance for convenient use in UI components.
 *
 * @returns {{
 *   expenses: Expense[];
 *   loading: boolean;
 *   error: string | null;
 *   addExpense: (description: string, amount: number, date?: string) => Promise<void>;
 *   deleteExpense: (id: string) => Promise<void>;
 *   totalBalance: number;
 *   refresh: () => Promise<void>;
 * }} Hook state and helper methods for working with expenses.
 */
export function useExpenses() {
	const [expenses, setExpenses] = useState<Expense[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// 1. Fetching logic: load all expenses from the backend API
	const fetchExpenses = useCallback(async () => {
		try {
			setLoading(true);
			const data = await api.getExpenses();
			setExpenses(data);
		} catch (err) {
			setError(`Failed to load expenses: ${err}`);
		} finally {
			setLoading(false);
		}
	}, []);

	// 2. Initial load: fetch data as soon as the component tree mounts
	useEffect(() => {
		fetchExpenses();
	}, [fetchExpenses]);

	// 3. Adding logic: send a new expense to the API and optimistically prepend it
	const addExpense = async (
		description: string,
		amount: number,
		date?: string,
	) => {
		try {
			const newExpense = await api.addExpense({ description, amount, date });
			setExpenses((prev) => [newExpense, ...prev]); // Add to the top of the list
		} catch (err) {
			setError(`Could not add expense: ${err}`);
		}
	};

	// 4. Deleting logic: remove an expense both on the server and locally
	const deleteExpense = async (id: string) => {
		try {
			await api.deleteExpense(id);
			setExpenses((prev) => prev.filter((exp) => exp._id !== id));
		} catch (err) {
			setError(`Could not delete expense: ${err}`);
		}
	};

	// Calculate Total for the Hero section (sum of all expense amounts)
	const totalBalance = expenses.reduce((acc, curr) => acc + curr.amount, 0);

	return {
		expenses,
		loading,
		error,
		addExpense,
		deleteExpense,
		totalBalance,
		refresh: fetchExpenses,
	};
}
