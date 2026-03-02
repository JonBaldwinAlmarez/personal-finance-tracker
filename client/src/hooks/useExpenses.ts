import { useState, useEffect, useCallback } from "react";
import { api, type Expense } from "@/lib/api";

export function useExpenses() {
	const [expenses, setExpenses] = useState<Expense[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// 1. Fetching logic
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

	// 2. Initial load
	useEffect(() => {
		fetchExpenses();
	}, [fetchExpenses]);

	// 3. Adding logic
	const addExpense = async (description: string, amount: number) => {
		try {
			const newExpense = await api.addExpense({ description, amount });
			setExpenses((prev) => [newExpense, ...prev]); // Add to the top of the list
		} catch (err) {
			setError(`Could not add expense: ${err}`);
		}
	};

	// 4. Deleting logic
	const deleteExpense = async (id: string) => {
		try {
			await api.deleteExpense(id);
			setExpenses((prev) => prev.filter((exp) => exp._id !== id));
		} catch (err) {
			setError(`Could not delete expense: ${err}`);
		}
	};

	// Calculate Total for the Hero section
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
