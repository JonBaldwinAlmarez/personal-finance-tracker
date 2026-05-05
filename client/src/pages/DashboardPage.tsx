import { Hero } from "@/layout/Hero";
import { BudgetManager } from "@/sections/BudgetManager";
import { ExpenseManager } from "@/sections/ExpenseManager";
import { useAppShell } from "@/lib/appShell";

/**
 * Dashboard page showing the main budget and expense tools.
 */
export function DashboardPage() {
	const {
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
	} = useAppShell();

	return (
		<>
			<Hero
				totalBalance={totalBalance}
				transactionCount={expenses.length}
				activeBudget={activeBudget}
			/>

			<BudgetManager
				budgets={budgets}
				activeBudget={activeBudget}
				loading={budgetLoading}
				error={budgetError}
				onCreateBudget={createBudget}
				onUpdateBudget={updateBudget}
				onDeleteBudget={deleteBudget}
				onResetBudget={resetBudget}
			/>

			{error && (
				<div className="max-w-4xl mx-auto mt-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-center text-sm font-medium">
					{error}. Please check if your backend server is running on port 5000.
				</div>
			)}

			{loading ? (
				<div className="py-20 text-center">
					<div className="animate-spin radial-progress text-blue-600 mb-4 mx-auto"></div>
					<p className="text-slate-500 font-medium animate-caret-blink">
						Fetching your records...
					</p>
				</div>
			) : (
				<ExpenseManager
					expenses={expenses}
					onAdd={handleAddExpense}
					onDelete={handleDeleteExpense}
				/>
			)}
		</>
	);
}
