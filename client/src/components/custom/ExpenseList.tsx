import React from "react";
import { Button } from "@/components/ui/button";
import { type Expense } from "@/lib/api";

interface ExpenseListProps {
	expenses: Expense[];
	onDelete: (id: string) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
	expenses,
	onDelete,
}) => {
	if (expenses.length === 0) {
		return (
			<div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
				<p className="text-slate-400">No transactions found.</p>
			</div>
		);
	}

	return (
		<div className="space-y-3">
			{expenses.map((expense) => (
				<div
					key={expense._id}
					className="flex justify-between items-center p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow"
				>
					<div>
						<h4 className="font-semibold text-slate-900">
							{expense.description}
						</h4>
						<p className="text-xs text-slate-400">
							{expense.date
								? new Date(expense.date).toLocaleDateString()
								: "Recent"}
						</p>
					</div>
					<div className="flex items-center gap-4">
						<span className="font-bold text-slate-900">
							-${expense.amount.toFixed(2)}
						</span>
						<Button
							variant="ghost"
							size="sm"
							className="text-red-500 hover:text-red-700 hover:bg-red-50"
							onClick={() => onDelete(expense._id)}
						>
							Delete
						</Button>
					</div>
				</div>
			))}
		</div>
	);
};
