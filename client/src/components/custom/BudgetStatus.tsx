import React from "react";
import { type Budget } from "@/lib/types";
import { Check, Info, ShieldAlert, TriangleAlert, X } from "lucide-react";

interface BudgetStatusProps {
	budget: Budget | null;
	isLoading?: boolean;
}

export const BudgetStatus: React.FC<BudgetStatusProps> = ({
	budget,
	isLoading = false,
}) => {
	if (isLoading)
		return (
			<div className="bg-white p-6 rounded-lg shadow">
				<p className="text-gray-500">Loading budget...</p>
			</div>
		);
	if (!budget)
		return (
			<div className="bg-blue-50 p-6 rounded-lg shadow border border-blue-200">
				<p className="text-blue-800 font-semibold">
					No active budget. Create one to get started!
				</p>
			</div>
		);

	const { amount, spent = 0, percentage = 0, alertLevel = "ok" } = budget;
	const remaining = amount - spent;

	const alertColor = {
		ok: "bg-green-100 text-green-800 border-green-300",
		info: "bg-yellow-100 text-yellow-800 border-yellow-300",
		warning: "bg-orange-100 text-orange-800 border-orange-300",
		critical: "bg-red-100 text-red-800 border-red-300",
		error: "bg-red-100 text-red-800 border-red-300",
	};
	const progressColor = {
		ok: "bg-green-500",
		info: "bg-yellow-500",
		warning: "bg-orange-500",
		critical: "bg-red-500",
		error: "bg-red-600",
	};
	const alertLabel = {
		ok: { icon: <Check />, text: "On Track" },
		info: { icon: <Info />, text: "Caution" },
		warning: { icon: <ShieldAlert />, text: "Warning" },
		critical: { icon: <TriangleAlert />, text: "Critical" },
		error: { icon: <X />, text: "Over Budget" },
	};

	const startDate = new Date(budget.startDate).toLocaleDateString();
	const endDate = new Date(budget.endDate).toLocaleDateString();

	return (
		<div className="bg-white p-6 rounded-lg shadow space-y-6">
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
				<div>
					<h3 className="text-xl font-bold">Active Budget</h3>
					<p className="text-sm text-gray-600">
						{startDate} to {endDate}
					</p>
					{budget.note && (
						<p className="text-sm text-gray-700 italic mt-1">
							"<em>{budget.note}</em>"
						</p>
					)}
				</div>
				<div
					className={`flex items-center px-3 rounded border font-semibold ${alertColor[alertLevel]}`}
				>
					<span className="mr-2">{alertLabel[alertLevel].icon}</span>
					<span>{alertLabel[alertLevel].text}</span>
				</div>
			</div>
			<div>
				<div className="flex justify-between mb-2">
					<span className="text-sm font-medium">Progress</span>
					<span className="text-sm font-bold">{percentage}%</span>
				</div>
				<div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
					<div
						className={`h-full ${progressColor[alertLevel]} transition-all duration-300`}
						style={{ width: `${Math.min(percentage, 100)}%` }}
					/>
				</div>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
				<div className="bg-blue-50 p-4 rounded">
					<p className="text-xs text-gray-600 font-semibold">BUDGET</p>
					<p className="text-2xl font-bold text-blue-600">
						₱{amount.toFixed(2)}
					</p>
				</div>
				<div className="bg-purple-50 p-4 rounded">
					<p className="text-xs text-gray-600 font-semibold">SPENT</p>
					<p className="text-2xl font-bold text-purple-600">
						₱{spent.toFixed(2)}
					</p>
				</div>
				<div
					className={`p-4 rounded ${remaining >= 0 ? "bg-green-50" : "bg-red-50"}`}
				>
					<p className="text-xs text-gray-600 font-semibold">REMAINING</p>
					<p
						className={`text-2xl font-bold ${remaining >= 0 ? "text-green-600" : "text-red-600"}`}
					>
						₱{remaining.toFixed(2)}
					</p>
				</div>
			</div>
			{percentage > 100 && (
				<div className="bg-red-50 border border-red-300 rounded p-4">
					<p className="text-red-800 font-semibold">
						You've exceeded your budget by ${(spent - amount).toFixed(2)}!
					</p>
				</div>
			)}
		</div>
	);
};
