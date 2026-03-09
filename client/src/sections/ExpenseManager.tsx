import { ExpenseForm } from "@/components/custom/ExpenseForm";
import { ExpenseList } from "@/components/custom/ExpenseList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
//import { useState } from "react";
//import { useExpenses } from "@/hooks/useExpenses";
import type { Expense } from "@/lib/api";
import { Search } from "lucide-react";
import { useState } from "react";

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
	const [searchQuery, setSearchQuery] = useState("");

	const filteredExpenses = expenses
		.filter((expense) =>
			expense.description.toLowerCase().includes(searchQuery.toLowerCase()),
		)
		.sort(
			(a, b) =>
				new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime(),
		);

	return (
		<section
			id="expenses"
			className="scroll-mt-24 py-16 px-4 max-w-7xl mx-auto"
		>
			<div className="grid grid-cols-1 md:grid-cols-12 gap-12">
				<div className="md:col-span-5">
					<ExpenseForm onAdd={onAdd} />
				</div>

				{/* Right Side: List + Search */}

				<div className="md:col-span-7 space-y-6">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
						<h2 className="text-2xl font-bold text-slate-900">History</h2>

						{/* Search Input */}
						<div className="relative w-full md:w-64">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
							<Input
								placeholder="Search transaction"
								className="pl-10 bg-white border-slate-200 focus:ring-blue-500"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
					</div>

					{/* Logic: We now pass filteredExpenses instead of the raw expenses */}
					<div className="pr-2 max-h-[350px] overflow-y-auto custom-scrollbar">
						<ExpenseList expenses={filteredExpenses} onDelete={onDelete} />
					</div>
					{/* Empty Search Result Logic */}
					{filteredExpenses.length === 0 && searchQuery.trim() !== "" && (
						<p className="text-slate-500 text-center py-4">
							No transactions found for "{searchQuery}"
						</p>
					)}
				</div>
			</div>
		</section>
	);
};
