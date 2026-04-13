import { Navbar } from "@/layout/Navbar";
import { Footer } from "@/layout/Footer";
import { Hero } from "@/layout/Hero";
import { ExpenseManager } from "@/sections/ExpenseManager";
import { useExpenses } from "@/hooks/useExpenses";
import { ExpenseChart } from "./components/custom/ExpenseChart";
import SpendingTimeline from "./components/custom/SpendingTimeline";
import { AIAdvisor } from "./components/custom/AIAdvisor";
import { SavedAdvice } from "./components/custom/SavedAdvice";
import { BudgetManager } from "@/sections/BudgetManager";
import { useBudgets } from "@/hooks/useBudget";
import { useEffect } from "react";

/**
 * Root application component.
 *
 * Wires together layout and feature sections, using `useExpenses` as the single
 * source of truth for expense data + mutations.
 */
function App() {
	// 1. Initialize our logic hook
	const { expenses, loading, error, addExpense, deleteExpense, totalBalance } =
		useExpenses();

	// 2. Budget state lives here so all sections share one source of truth
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

	// 3. Initial budget load
	useEffect(() => {
		fetchBudgets();
		fetchActiveBudget();
	}, [fetchBudgets, fetchActiveBudget]);

	// 4. Keep budget status in sync after expense mutations
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

	return (
		<div className="min-h-screen flex flex-col bg-slate-100 selection:bg-blue-100">
			<Navbar />

			<main className="grow">
				{/* 2. Hero Section: Displays the "At a Glance" Summary */}
				<Hero
					totalBalance={totalBalance}
					transactionCount={expenses.length}
					activeBudget={activeBudget}
				/>
				<div>
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
				</div>

				{/* 3. Global Error Handling: Shows up if the API fails */}
				{error && (
					<div className="max-w-4xl mx-auto mt-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-center text-sm font-medium">
						⚠️ {error}. Please check if your backend server is running on port
						5000.
					</div>
				)}

				{/* 4. Expense Manager: The CRUD Core */}
				{loading ? (
					<div className="py-20 text-center">
						<div className="animate-spin radial-progress text-blue-600 mb-4 mx-auto"></div>
						<p className="text-slate-500 font-medium animate-caret-blink">
							Fetching your records...
						</p>
					</div>
				) : (
					<div className="flex flex-col gap-8 pb-12">
						{/* 1. Management Section */}
						<ExpenseManager
							expenses={expenses}
							onAdd={handleAddExpense}
							onDelete={handleDeleteExpense}
						/>
						{/* 2. AI Insights Section */}
						<AIAdvisor currentTotal={totalBalance} />

						{/* 3. Saved Advice Section - Shows saved AI advice with delete functionality */}
						<SavedAdvice />

						{/* 4. Visual Analytics Section (Responsive Grid) */}
						<div className="flex flex-col w-full md:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-2">
							<ExpenseChart expenses={expenses} />
							<SpendingTimeline expenses={expenses} />
						</div>
					</div>
				)}

				{/* Placeholder for future sections 
				<section
					id="about"
					className="py-20 bg-white border-y border-slate-100"
				>
					<div className="max-w-4xl mx-auto px-4 text-center">
						<h2 className="text-3xl font-bold mb-4">About Finance.io</h2>
						<p className="text-slate-500">
							A modern solution for personal wealth management.
						</p>
					</div>
				</section>*/}
			</main>

			<Footer />
		</div>
	);
}

export default App;
