import { useState, useEffect, useCallback } from "react";
import type { Budget, CreateBudgetPayload } from "../lib/types";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface UseBudgetsReturn {
	budgets: Budget[];
	activeBudget: Budget | null;
	loading: boolean;
	error: string | null;
	fetchBudgets: () => Promise<void>;
	fetchActiveBudget: () => Promise<void>;
	createBudget: (payload: CreateBudgetPayload) => Promise<Budget | null>;
	updateBudget: (
		id: string,
		payload: Partial<Budget>,
	) => Promise<Budget | null>;
	deleteBudget: (id: string) => Promise<boolean>;
	resetBudget: (payload: CreateBudgetPayload) => Promise<Budget | null>;
}

export const useBudgets = (): UseBudgetsReturn => {
	const [budgets, setBudgets] = useState<Budget[]>([]);
	const [activeBudget, setActiveBudget] = useState<Budget | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchBudgets = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const resp = await fetch(`${API_BASE}/api/budgets`);
			const result = await resp.json();
			if (result.success) setBudgets(result.data);
			else setError(result.error || "Failed to fetch budgets");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to fetch budgets");
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchActiveBudget = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const resp = await fetch(`${API_BASE}/api/budgets/current`);
			const result = await resp.json();
			if (result.success) setActiveBudget(result.data);
			else setError(result.error || "Failed to fetch active budget");
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to fetch active budget",
			);
		} finally {
			setLoading(false);
		}
	}, []);

	const createBudget = async (
		payload: CreateBudgetPayload,
	): Promise<Budget | null> => {
		setError(null);
		try {
			const resp = await fetch(`${API_BASE}/api/budgets`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const result = await resp.json();
			if (result.success) {
				await fetchBudgets();
				return result.data;
			}
			setError(result.error || "Failed to create budget");
			return null;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to create budget");
			return null;
		}
	};

	const updateBudget = async (
		id: string,
		payload: Partial<Budget>,
	): Promise<Budget | null> => {
		setError(null);
		try {
			const resp = await fetch(`${API_BASE}/api/budgets/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const result = await resp.json();
			if (result.success) {
				await fetchBudgets();
				return result.data;
			}
			setError(result.error || "Failed to update budget");
			return null;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to update budget");
			return null;
		}
	};

	const deleteBudget = async (id: string): Promise<boolean> => {
		setError(null);
		try {
			const resp = await fetch(`${API_BASE}/api/budgets/${id}`, {
				method: "DELETE",
			});
			const result = await resp.json();
			if (result.success) {
				await fetchBudgets();
				return true;
			}
			setError(result.error || "Failed to delete budget");
			return false;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to delete budget");
			return false;
		}
	};

	const resetBudget = async (
		payload: CreateBudgetPayload,
	): Promise<Budget | null> => {
		setError(null);
		try {
			const resp = await fetch(`${API_BASE}/api/budgets/reset`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const result = await resp.json();
			if (result.success) {
				await fetchBudgets();
				return result.data.new;
			}
			setError(result.error || "Failed to reset budget");
			return null;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to reset budget");
			return null;
		}
	};

	useEffect(() => {
		fetchActiveBudget();
	}, [fetchActiveBudget]);

	return {
		budgets,
		activeBudget,
		loading,
		error,
		fetchBudgets,
		fetchActiveBudget,
		createBudget,
		updateBudget,
		deleteBudget,
		resetBudget,
	};
};
