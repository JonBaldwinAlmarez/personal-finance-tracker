import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ExpenseFormProps {
	/** Callback invoked when a new expense is submitted. */
	onAdd: (description: string, amount: number, date?: string) => Promise<void>;
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
	const [isSubmitting, setIsSubmitting] = useState(false);

	/**
	 * Handle submission of the expense form.
	 *
	 * @param {React.FormEvent} e - Native form submit event.
	 */
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!description || !amount) return;

		// 1. Await parent mutation so dependent UI can refresh first.
		setIsSubmitting(true);
		try {
			await onAdd(description, parseFloat(amount), date || undefined);

			// 2. Clear the form after successful submission.
			setDescription("");
			setAmount("");
			setDate("");
		} finally {
			setIsSubmitting(false);
		}
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
					<label
						htmlFor="description"
						className="text-sm font-medium text-slate-700"
					>
						Description
					</label>
					<Input
						placeholder="e.g. Netflix Subscription"
						id="description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
					/>
				</div>
				<div className="space-y-2">
					<label htmlFor="date" className="text-sm font-medium text-slate-700">
						Date
					</label>
					<Input
						type="date"
						id="date"
						value={date}
						onChange={(e) => setDate(e.target.value)}
					/>
				</div>
				<div className="space-y-2">
					<label
						htmlFor="amount"
						className="text-sm font-medium text-slate-700"
					>
						Amount (₱)
					</label>
					<Input
						type="number"
						id="amount"
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
					className="w-full text-white"
				>
					{isSubmitting ? "Adding...." : "Add Expense"}
				</Button>
			</form>
		</div>
	);
};
