import { ExpenseForm } from "@/components/custom/ExpenseForm";
import { ExpenseList } from "@/components/custom/ExpenseList";
import { useState } from "react";

export function ExpenseManager() {
	const [expenses, setExpenses] = useState([]);

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
				<ExpenseForm onAdd={(data) => console.log(data)} />
				<ExpenseList expenses={expenses} onDelete={(id) => console.log(id)} />
			</div>
		</section>
	);
}
