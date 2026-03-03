import { ExpenseForm } from "@/components/custom/ExpenseForm";
import { ExpenseList } from "@/components/custom/ExpenseList";
import { useState } from "react";
import { useExpenses } from "@/hooks/useExpenses";
import type { Expense } from "@/lib/api";

interface ExpenseManagerProps {
	expenses: Expense[];
	onAdd: (description: string, amount: number) => void;
	onDelete: (id: string) => void;
}

export const ExpenseManager: React.FC<ExpenseManagerProps> = ({
	expenses,
	onAdd,
	onDelete,
}) => {
	return (
		<section id="expenses" className="py-20 px-4 max-w-6xl mx-auto">
			<div className="text-center mb-12">
				<h2 className="text-3xl font-bold italic tracking-tight">
					Transactions
				</h2>
				<p className="text-muted-foreground">
					Keep track of your spending habits.
				</p>
			</div>

			<div className="grid gap-8 md:grid-cols-2">
				<ExpenseForm onAdd={onAdd} />
				<ExpenseList expenses={expenses} onDelete={onDelete} />
			</div>
		</section>
	);
};
