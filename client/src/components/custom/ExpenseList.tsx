import { Button } from "@/components/ui/button";

interface Expense {
	_id: string;
	description: string;
	amount: number;
}

interface ExpenseListProps {
	expenses: Expense[];
	onDelete: (id: string) => void;
}

export function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
	return (
		<div className="space-y-3">
			{expenses.length === 0 ? (
				<p className="text-slate-500 text-center py-4">
					No transactions found.
				</p>
			) : (
				expenses.map((expense) => (
					<div
						key={expense._id}
						className="flex justify-between items-center p-3 border rounded-lg bg-white"
					>
						<div>
							<p className="font-medium text-slate-900">
								{expense.description}
							</p>
							<p className="text-sm text-slate-500">-${expense.amount}</p>
						</div>
						<Button
							variant="ghost"
							className="text-red-500"
							onClick={() => onDelete(expense._id)}
						>
							Delete
						</Button>
					</div>
				))
			)}
		</div>
	);
}
