import React, { useState } from "react";
import { Sparkles, RefreshCcw, TrendingDown } from "lucide-react";
import {
	BarChart,
	Bar,
	XAxis,
	Tooltip,
	ResponsiveContainer,
	Cell,
} from "recharts";
import { api } from "@/lib/api";
import type { AIAnalysis } from "@/lib/types";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

interface AIAdvisorProps {
	currentTotal: number;
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ currentTotal }) => {
	const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
	const [loading, setLoading] = useState(false);

	const fetchAnalysis = async () => {
		try {
			setLoading(true);
			const result = await api.getAIAnalysis();
			setAnalysis(result);

			// Auto-save the AI advice to database
			try {
				await api.saveAdvice(result.advice, result.suggestedBudget);
				console.log("Advice saved successfully.");
			} catch (error) {
				console.error("Failed to save advice:", error);
			}
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	// Prepare data for Recharts
	const chartData = analysis
		? [
				{ name: "Current", amount: currentTotal, fill: "#6366f1" }, // Indigo
				{ name: "Target", amount: analysis.suggestedBudget, fill: "#10b981" }, // Emerald
			]
		: [];

	return (
		<section className="max-w-4xl mx-auto px-4 py-8" id="AI-advisor">
			<div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
				{/* Header */}
				<div className="p-6 border-b border-slate-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/50">
					<div className="flex items-center gap-2">
						<div className="p-2 bg-blue-100 rounded-lg">
							<Sparkles className="w-5 h-5 text-blue-600" />
						</div>
						<div>
							<h3 className="font-bold text-slate-800">AI Financial Advisor</h3>
							<p className="text-xs text-slate-500 font-medium">
								Powered by gemini-3-flash-preview
							</p>
						</div>
					</div>

					<Button
						onClick={fetchAnalysis}
						disabled={loading || currentTotal === 0}
						className="flex items-center gap-2 px-4 py-2 disabled:bg-slate-300 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-100"
					>
						<RefreshCcw
							className={cn(
								"w-4 h-4 bg-grey-600",
								loading && "animate-spin text-red-500",
							)}
						/>
						{loading ? "Analysing..." : "Get Advice"}
					</Button>
				</div>

				{/* Content */}
				<div className="p-6">
					{!analysis && !loading && (
						<div className="text-center py-8">
							<p className="text-slate-400 text-sm">
								Click the button to get personalized AI spending advice.
							</p>
						</div>
					)}

					{loading && (
						<div className="space-y-4 animate-pulse">
							<div className="h-4 bg-slate-100 rounded w-3/4"></div>
							<div className="h-4 bg-slate-100 rounded w-1/2"></div>
							<div className="h-32 bg-slate-50 rounded-xl"></div>
						</div>
					)}

					{analysis && !loading && (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
							{/* Text Advice */}
							<div className="space-y-4">
								<div className="bg-blue-50 p-4 rounded-xl border border-cyan-200">
									<p className="text-slate-700 leading-relaxed text-sm italic">
										"{analysis.advice}"
									</p>
								</div>
								<div className="flex items-center gap-3 text-emerald-600 font-bold">
									<TrendingDown className="w-5 h-5" />
									<span>
										Target Budget: ${analysis.suggestedBudget.toLocaleString()}
									</span>
								</div>
							</div>

							{/* Responsive Chart */}
							<div className="h-62.5 w-full min-w-0">
								<ResponsiveContainer width="100%" height={250} minWidth={0}>
									<BarChart data={chartData}>
										<XAxis dataKey="name" axisLine={false} tickLine={false} />
										<Tooltip
											cursor={{ fill: "transparent" }}
											contentStyle={{
												borderRadius: "12px",
												border: "none",
												boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
											}}
										/>
										<Bar dataKey="amount" radius={[8, 8, 0, 0]} barSize={40}>
											{chartData.map((entry, index) => (
												<Cell key={`cell-${index}`} fill={entry.fill} />
											))}
										</Bar>
									</BarChart>
								</ResponsiveContainer>
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	);
};
