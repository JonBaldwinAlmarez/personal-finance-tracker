import { BudgetForm } from "@/components/custom/BudgetForm";
import { BudgetHistory } from "@/components/custom/BudgetHistory";
import { BudgetStatus } from "@/components/custom/BudgetStatus";
import { type Budget, type CreateBudgetPayload } from "@/lib/types";
import { TriangleAlert } from "lucide-react";

interface BudgetManagerProps {
	budgets: Budget[];
	activeBudget: Budget | null;
	loading: boolean;
	error: string | null;
	onCreateBudget: (payload: CreateBudgetPayload) => Promise<Budget | null>;
	onUpdateBudget: (
		id: string,
		payload: Partial<Budget>,
	) => Promise<Budget | null>;
	onDeleteBudget: (id: string) => Promise<boolean>;
	onResetBudget: (payload: CreateBudgetPayload) => Promise<Budget | null>;
}

export function BudgetManager({
	budgets,
	activeBudget,
	loading,
	error,
	onCreateBudget,
	onUpdateBudget,
	onDeleteBudget,
	onResetBudget,
}: BudgetManagerProps) {
	// 1. Local adapter to match BudgetHistory delete callback signature
	const handleDeleteBudget = async (id: string) => {
		await onDeleteBudget(id);
	};

	return (
		<section className="max-w-7xl mx-auto px-4 py-10">
			{/* 1. NEW: Expiration Alert Banner */}
			{activeBudget?.isExpired && (
				<div className="mb-8 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
					<div className="flex items-center gap-3">
						<TriangleAlert className="h-10 w-10 text-amber-500" />
						<div>
							<h4 className="font-bold text-amber-900">Budget Period Ended</h4>
							<p className="text-amber-700 text-sm">
								Your budget reached its end date on{" "}
								<b>{new Date(activeBudget.endDate).toLocaleDateString()}</b>.
								Please review your spending and set a new budget.
							</p>
						</div>
					</div>
				</div>
			)}

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
					{/* We pass a key to the form to force a re-render if the budget changes */}
					<BudgetForm
						key={activeBudget?._id || "new-budget"}
						activeBudget={activeBudget}
						loading={loading}
						error={error}
						onCreateBudget={onCreateBudget}
						onUpdateBudget={onUpdateBudget}
						onResetBudget={onResetBudget}
					/>
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
}
