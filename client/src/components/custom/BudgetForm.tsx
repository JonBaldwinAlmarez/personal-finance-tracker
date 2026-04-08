import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useBudgets } from "@/hooks/useBudget";

export const BudgetForm = () => {
	const {
		activeBudget,
		loading,
		error,
		updateBudget,
		createBudget,
		resetBudget,
	} = useBudgets();

	const [formData, setFormData] = useState<{
		amount: string;
		startDate: string;
		endDate: string;
		note: string;
	}>({
		amount: activeBudget?.amount.toString() || "",
		startDate: activeBudget?.startDate
			? activeBudget.startDate.split("T")[0]
			: "",
		endDate: activeBudget?.endDate ? activeBudget.endDate.split("T")[0] : "",
		note: activeBudget?.note || "",
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

		// Basic Validation
		if (!formData.amount || parseFloat(formData.amount) <= 10000) {
			setValidationError("Amount must be greater than ₱10,000");
			return;
		}

		const payload = {
			amount: parseFloat(formData.amount),
			startDate: formData.startDate,
			endDate: formData.endDate,
			note: formData.note || undefined,
		};

		if (activeBudget?._id) {
			await updateBudget(activeBudget._id, payload);
		} else {
			await createBudget(payload);
		}
	};

	const handleReset = async () => {
		if (
			window.confirm(
				"Are you sure you want to reset your budget? This will archive the current one.",
			)
		) {
			// You can pass the current formData as the 'starting point' for the reset if your API requires it
			await resetBudget({
				amount: 0,
				startDate: new Date().toISOString().split("T")[0],
				endDate: "",
				note: "",
			});
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
		>
			<div className="flex justify-between items-center">
				<h3 className="text-xl font-bold text-gray-800">
					{activeBudget ? "Manage Active Budget" : "Set Up Budget"}
				</h3>
				{activeBudget && (
					<Button
						type="button"
						variant="outline"
						onClick={handleReset}
						className="text-red-500 border-red-200 hover:bg-red-50"
					>
						Reset Planner
					</Button>
				)}
			</div>

			{(error || validationError) && (
				<div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
					{error || validationError}
				</div>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="md:col-span-2">
					<label
						className="text-sm font-semibold text-gray-600"
						htmlFor="amount"
					>
						Budget Amount ($)
					</label>
					<Input
						type="number"
						name="amount"
						id="amount"
						value={formData.amount}
						onChange={handleChange}
						placeholder="0.00"
						className="mt-1 text-lg font-medium"
					/>
				</div>

				<div>
					<label
						className="text-sm font-semibold text-gray-600"
						htmlFor="startDate"
					>
						Start Date
					</label>
					<Input
						type="date"
						name="startDate"
						id="startDate"
						value={formData.startDate}
						onChange={handleChange}
						className="mt-1"
					/>
				</div>

				<div>
					<label
						className="text-sm font-semibold text-gray-600"
						htmlFor="endDate"
					>
						End Date
					</label>
					<Input
						type="date"
						name="endDate"
						id="endDate"
						value={formData.endDate}
						onChange={handleChange}
						className="mt-1"
					/>
				</div>

				<div className="md:col-span-2">
					<label className="text-sm font-semibold text-gray-600" htmlFor="note">
						Notes
					</label>
					<Textarea
						name="note"
						id="note"
						value={formData.note}
						onChange={handleChange}
						rows={3}
						className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
					/>
				</div>
			</div>

			<Button
				type="submit"
				disabled={loading}
				className="w-full py-6 text-lg shadow-lg shadow-blue-100"
			>
				{loading
					? "Saving..."
					: activeBudget
						? "Update Budget Plan"
						: "Initialize Budget"}
			</Button>
		</form>
	);
};
