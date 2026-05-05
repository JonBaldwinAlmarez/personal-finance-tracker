import { useOutletContext } from "react-router-dom";
import type { Budget, CreateBudgetPayload, Expense } from "@/lib/types";

/**
 * Shared route context for pages rendered inside `AppLayout`.
 */
export interface AppShellContext {
	expenses: Expense[];
	loading: boolean;
	error: string | null;
	totalBalance: number;
	budgets: Budget[];
	activeBudget: Budget | null;
	budgetLoading: boolean;
	budgetError: string | null;

	handleAddExpense: (
		description: string,
		amount: number,
		date?: string,
	) => Promise<void>;

	handleDeleteExpense: (id: string) => Promise<void>;

	createBudget: (payload: CreateBudgetPayload) => Promise<Budget | null>;

	updateBudget: (
		id: string,
		payload: Partial<Budget>,
	) => Promise<Budget | null>;

	deleteBudget: (id: string) => Promise<boolean>;

	resetBudget: (payload: CreateBudgetPayload) => Promise<Budget | null>;
}

/**
 * Small helper hook for reading shared layout state.
 */
export function useAppShell() {
	return useOutletContext<AppShellContext>();
}
