import React from "react";
import { Button } from "@/components/ui/button";
import { type Expense } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
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
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200"
			>
				<p className="text-slate-400">No transactions found</p>
			</motion.div>
		);
	}

	return (
		<div className="space-y-3">
			<AnimatePresence>
				{expenses.map((expense) => (
					<motion.div
						key={expense._id}
						initial={{ opacity: 0, y: 20 }} // Start invisible and lower
						animate={{ opacity: 1, y: 0 }} // Slide up and fade in
						exit={{ opacity: 0, x: -50 }} // Slide left and fade out on delete
						transition={{ duration: 0.2 }} // Snappy 0.2s speed
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
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);
};
