import React, { useEffect } from "react";
import { BudgetForm } from "@/components/custom/BudgetForm";
import { BudgetHistory } from "@/components/custom/BudgetHistory";
import { BudgetStatus } from "@/components/custom/BudgetStatus";
import { useBudgets } from "@/hooks/useBudget";

export const BudgetManager: React.FC = () => {
	const { budgets, activeBudget, loading, error, fetchBudgets, deleteBudget } =
		useBudgets();

	// Load history on mount
	useEffect(() => {
		fetchBudgets();
	}, [fetchBudgets]);

	const handleDeleteBudget = async (id: string) => {
		await deleteBudget(id);
	};

	return (
		<section className="max-w-7xl mx-auto px-4 py-10">
			<div className="mb-8">
				<h2 className="text-3xl font-bold text-slate-900 tracking-tight">
					Budget Planner
				</h2>
				<p className="text-slate-500 mt-2">
					Manage your active period and review your financial history.
				</p>
			</div>

			{error && (
				<div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-2">
					<span>⚠️</span> {error}
				</div>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
				{/* Left Side: The Single "Smart" Form */}
				<div className="lg:col-span-5">
					<BudgetForm key={activeBudget?._id || "new-budget"} />
				</div>

				{/* Right Side: Status and History */}
				<div className="lg:col-span-7 space-y-8">
					<BudgetStatus budget={activeBudget} isLoading={loading} />

					<BudgetHistory
						budgets={budgets}
						isLoading={loading}
						onDeleteBudget={handleDeleteBudget}
					/>
				</div>
			</div>
		</section>
	);
};
