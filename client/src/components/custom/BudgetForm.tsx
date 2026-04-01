import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { type CreateBudgetPayload } from "@/lib/types";

interface BudgetFormProps {
	onSubmit: (payload: CreateBudgetPayload) => Promise<void>;
	isLoading?: boolean;
	error?: string | null;
}

export const BudgetForm: React.FC<BudgetFormProps> = ({
	onSubmit,
	isLoading = false,
	error = null,
}) => {
	const [formData, setFormData] = useState({
		amount: "",
		startDate: "",
		endDate: "",
		note: "",
	});
	const [validationError, setValidationError] = useState<string | null>(null);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		setValidationError(null);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setValidationError(null);

		if (!formData.amount || parseFloat(formData.amount) <= 0) {
			setValidationError("Budget amount must be greater than 0");
			return;
		}
		if (!formData.startDate || !formData.endDate) {
			setValidationError("Please select both start and end dates");
			return;
		}
		if (new Date(formData.endDate) <= new Date(formData.startDate)) {
			setValidationError("End date must be after start date");
			return;
		}

		const payload: CreateBudgetPayload = {
			amount: parseFloat(formData.amount),
			startDate: formData.startDate,
			endDate: formData.endDate,
			note: formData.note || undefined,
		};

		await onSubmit(payload);
		setFormData({ amount: "", startDate: "", endDate: "", note: "" });
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-4 bg-white p-6 rounded-lg shadow"
		>
			<h3 className="text-lg font-semibold">Create New Budget</h3>
			{(error || validationError) && (
				<div className="p-3 bg-red-100 text-red-800 rounded border border-red-300">
					{error || validationError}
				</div>
			)}
			<div>
				<label className="block text-sm font-medium mb-1">
					Budget Amount ($)
				</label>
				<Input
					type="number"
					name="amount"
					value={formData.amount}
					onChange={handleChange}
					placeholder="e.g., 3000"
					step="0.01"
					min="0"
					disabled={isLoading}
					className="w-full"
				/>
			</div>
			<div>
				<label className="block text-sm font-medium mb-1">Start Date</label>
				<Input
					type="date"
					name="startDate"
					value={formData.startDate}
					onChange={handleChange}
					disabled={isLoading}
					className="w-full"
				/>
			</div>
			<div>
				<label className="block text-sm font-medium mb-1">End Date</label>
				<Input
					type="date"
					name="endDate"
					value={formData.endDate}
					onChange={handleChange}
					disabled={isLoading}
					className="w-full"
				/>
			</div>
			<div>
				<label className="block text-sm font-medium mb-1">
					Note (Optional)
				</label>
				<textarea
					name="note"
					value={formData.note}
					onChange={handleChange}
					placeholder="e.g., March spending plan"
					maxLength={500}
					disabled={isLoading}
					className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
					rows={3}
				/>
				<p className="text-xs text-gray-500 mt-1">
					{formData.note.length}/500 characters
				</p>
			</div>
			<Button
				type="submit"
				disabled={isLoading}
				className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
			>
				{isLoading ? "Creating..." : "Create Budget"}
			</Button>
		</form>
	);
};
