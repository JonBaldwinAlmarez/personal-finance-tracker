import { ExpenseForm } from "@/components/custom/ExpenseForm";
import { ExpenseList } from "@/components/custom/ExpenseList";
import { Input } from "@/components/ui/input";
import { type Expense } from "@/lib/api";
import { Search } from "lucide-react";
import { useState } from "react";

interface ExpenseManagerProps {
	/** Expense list provided by the parent hook/component. */
	expenses: Expense[];
	/** Callback invoked when a new expense is submitted. */
	onAdd: (description: string, amount: number, date?: string) => void;
	/** Callback invoked when a specific expense is deleted. */
	onDelete: (id: string) => void;
}

type SortMode = "latest" | "largest";

/**
 * Main CRUD section for adding, searching, sorting, and listing expenses.
 *
 * This component is intentionally "dumb" about persistence: it delegates add/delete
 * to the callbacks passed in by the parent (usually powered by `useExpenses`).
 */
export const ExpenseManager: React.FC<ExpenseManagerProps> = ({
	expenses,
	onAdd,
	onDelete,
}) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [sortMode, setSortMode] = useState<SortMode>("latest");

	// Apply search + sort in-memory for instant UI feedback.
	const filteredExpenses = expenses
		.filter((expense) =>
			expense.description.toLowerCase().includes(searchQuery.toLowerCase()),
		)
		.sort((a, b) => {
			if (sortMode === "latest") {
				// Newest date first
				return (
					new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()
				);
			} else {
				// Highest amount first
				return b.amount - a.amount;
			}
		});

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
						<div className="flex bg-slate-100 p-1 rounded-lg gap-1">
							<button
								onClick={() => setSortMode("latest")}
								className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
									sortMode === "latest"
										? "bg-white shadow-sm text-blue-600"
										: "text-slate-500 hover:text-slate-700"
								}`}
							>
								Latest
							</button>
							<button
								onClick={() => setSortMode("largest")}
								className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
									sortMode === "largest"
										? "bg-white shadow-sm text-blue-600"
										: "text-slate-500 hover:text-slate-700"
								}`}
							>
								Largest
							</button>
						</div>

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
