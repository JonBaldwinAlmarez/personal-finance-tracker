import { useState } from "react";
import { type Budget } from "@/lib/types";

interface BudgetHistoryProps {
	budgets: Budget[];
	isLoading?: boolean;
	onDeleteBudget?: (id: string) => Promise<void>;
}

export const BudgetHistory: React.FC<BudgetHistoryProps> = ({
	budgets,
	isLoading = false,
	onDeleteBudget,
}) => {
	const [expandedId, setExpandedId] = useState<string | null>(null);
	const inactiveBudgets = budgets.filter((b) => !b.isActive);

	if (inactiveBudgets.length === 0 && !isLoading) return null;

	return (
		<div className="bg-white p-6 rounded-lg shadow">
			<h3 className="text-lg font-semibold mb-4">Budget History</h3>
			{isLoading ? (
				<p className="text-gray-500">Loading...</p>
			) : (
				<div className="space-y-2">
					{inactiveBudgets.map((budget) => (
						<div key={budget._id} className="border rounded-lg overflow-hidden">
							<button
								onClick={() =>
									setExpandedId(expandedId === budget._id ? null : budget._id)
								}
								className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 flex justify-between items-center transition"
							>
								<div>
									<p className="font-semibold">
										{new Date(budget.startDate).toLocaleDateString()} to{" "}
										{new Date(budget.endDate).toLocaleDateString()}
									</p>
									<p className="text-sm text-gray-600">
										Spent ${(budget.spent || 0).toFixed(2)} of $
										{budget.amount.toFixed(2)} (
										{(budget.percentage || 0).toFixed(1)}%)
									</p>
								</div>
								<span className="text-xl">
									{expandedId === budget._id ? "▼" : "▶"}
								</span>
							</button>
							{expandedId === budget._id && (
								<div className="p-4 bg-white border-t space-y-3">
									{budget.note && (
										<div>
											<p className="text-xs font-semibold text-gray-600 uppercase">
												Note
											</p>
											<p className="text-sm text-gray-700">{budget.note}</p>
										</div>
									)}
									<div className="grid grid-cols-2 gap-4">
										<div>
											<p className="text-xs font-semibold text-gray-600 uppercase">
												Budget
											</p>
											<p className="text-lg font-bold text-blue-600">
												${budget.amount.toFixed(2)}
											</p>
										</div>
										<div>
											<p className="text-xs font-semibold text-gray-600 uppercase">
												Spent
											</p>
											<p className="text-lg font-bold text-purple-600">
												${(budget.spent || 0).toFixed(2)}
											</p>
										</div>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
										<div
											className="h-full bg-blue-500"
											style={{
												width: `${Math.min(budget.percentage || 0, 100)}%`,
											}}
										/>
									</div>
									{onDeleteBudget && (
										<button
											onClick={async () => {
												if (
													confirm(
														"Are you sure you want to delete this budget record?",
													)
												) {
													await onDeleteBudget(budget._id);
													setExpandedId(null);
												}
											}}
											className="w-full text-sm px-3 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded transition"
										>
											Delete Record
										</button>
									)}
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
};
