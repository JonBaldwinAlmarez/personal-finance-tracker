import type { Budget } from "@/lib/types";
import React from "react";

interface HeroProps {
	/** Sum of all recorded expenses (computed by the hook). */
	totalBalance: number;
	/** Total count of recorded transactions/expenses. */
	transactionCount: number;
	activeBudget: Budget | null;
}

/**
 * Hero "at-a-glance" summary section.
 *
 * Displays derived totals and a simple headline; does not fetch data itself.
 */
export const Hero: React.FC<HeroProps> = ({
	totalBalance,
	transactionCount,
	activeBudget,
}) => {
	// Format the number into a standard USD currency string
	const formattedBalance = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "PHP",
	}).format(totalBalance);

	return (
		<section
			id="hero"
			className="pt-10 pb-16 px-4 bg-linear-to-b from-white to-slate-50 border-b border-slate-100"
		>
			<div className="max-w-4xl mx-auto text-center">
				{/* Sub-headline */}
				<span className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-wider text-blue-600 uppercase bg-blue-50 rounded-full">
					Financial Overview
				</span>

				{/* Main Headline */}
				<h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
					Take control of your <br />
					<span className="text-blue-600 italic">financial future.</span>
				</h1>

				<p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto">
					Track your expenses, analyze your spending habits, and reach your
					savings goals with our all-in-one finance dashboard.
				</p>

				{/* The "At a Glance" Card */}
				<div className="relative max-w-md mx-auto">
					<div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-cyan-500 rounded-2xl blur-sm opacity-25"></div>
					<div className="relative bg-white border border-slate-200 p-8 rounded-2xl shadow-xl">
						<p className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">
							Total Expenses
						</p>
						<h2 className="text-5xl font-bold text-slate-900 mb-4">
							{formattedBalance}
						</h2>

						<p className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">
							Monthly Budget
						</p>
						<h2 className="text-5xl font-bold text-slate-900 mb-4">
							{activeBudget?.amount}
						</h2>
						<div className="flex justify-center items-center gap-2 text-sm text-slate-400">
							<span className="flex h-2 w-2 rounded-full bg-green-500"></span>
							Based on {transactionCount} recent transactions
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
