import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ExpenseFormProps {
	/** Callback invoked when a new expense is submitted. */
	onAdd: (description: string, amount: number, date?: string) => void;
}

/**
 * Form component for creating a new expense entry.
 *
 * Handles basic client-side validation and delegates persistence to the parent
 * via the `onAdd` callback.
 */
export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAdd }) => {
	const [description, setDescription] = useState("");
	const [amount, setAmount] = useState("");
	const [date, setDate] = useState("");
	const [isSubmitting] = useState(false);

	/**
	 * Handle submission of the expense form.
	 *
	 * @param {React.FormEvent} e - Native form submit event.
	 */
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!description || !amount) return;

		onAdd(description, parseFloat(amount), date || undefined);

		// Clear the form
		setDescription("");
		setAmount("");
		setDate("");
	};

	return (
		<div className="lg:m-10">
			<h2 className="text-2xl font-bold text-slate-900 mb-5">
				Add New Expense
			</h2>
			<form
				onSubmit={handleSubmit}
				className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4"
			>
				<div className="space-y-2">
					<label className="text-sm font-medium text-slate-700">
						Description
					</label>
					<Input
						placeholder="e.g. Netflix Subscription"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
					/>
				</div>
				<div className="space-y-2">
					<label className="text-sm font-medium text-slate-700">Date</label>
					<Input
						type="date"
						value={date}
						onChange={(e) => setDate(e.target.value)}
					/>
				</div>
				<div className="space-y-2">
					<label className="text-sm font-medium text-slate-700">
						Amount (₱)
					</label>
					<Input
						type="number"
						step="1.00"
						placeholder="0.00"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						required
					/>
				</div>

				<Button
					disabled={isSubmitting}
					type="submit"
					className="w-full bg-blue-600 hover:bg-blue-700 text-white"
				>
					{isSubmitting ? "Adding...." : "Add Expense"}
				</Button>
			</form>
		</div>
	);
};
