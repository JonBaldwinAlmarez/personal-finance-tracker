import { Footer } from "@/layout/Footer";
import { Navbar } from "@/layout/Navbar";
import { useBudgets } from "@/hooks/useBudget";
import { useExpenses } from "@/hooks/useExpenses";
import type { AppShellContext } from "@/lib/appShell";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";

/**
 * Shared application shell for all routed pages.
 *
 * Keeps expense and budget state in one place, then passes it to child routes.
 */
export function AppLayout() {
	const { expenses, loading, error, addExpense, deleteExpense, totalBalance } =
		useExpenses();
	const {
		budgets,
		activeBudget,
		loading: budgetLoading,
		error: budgetError,
		fetchBudgets,
		fetchActiveBudget,
		createBudget,
		updateBudget,
		deleteBudget,
		resetBudget,
	} = useBudgets();

	useEffect(() => {
		fetchBudgets();
		fetchActiveBudget();
	}, [fetchBudgets, fetchActiveBudget]);

	const handleAddExpense = async (
		description: string,
		amount: number,
		date?: string,
	) => {
		await addExpense(description, amount, date);
		await fetchActiveBudget();
	};

	const handleDeleteExpense = async (id: string) => {
		await deleteExpense(id);
		await fetchActiveBudget();
	};

	const context: AppShellContext = {
		expenses,
		loading,
		error,
		totalBalance,
		handleAddExpense,
		handleDeleteExpense,
		budgets,
		activeBudget,
		budgetLoading,
		budgetError,
		createBudget,
		updateBudget,
		deleteBudget,
		resetBudget,
	};

	return (
		<div className="min-h-screen flex flex-col bg-slate-100 selection:bg-blue-100">
			<Navbar />
			<main className="grow pt-16 md:pt-0">
				<Outlet context={context} />
			</main>
			<Footer />
		</div>
	);
}
