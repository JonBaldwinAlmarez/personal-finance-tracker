import React from "react";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

interface Expense {
	/** Numeric amount for the expense entry. */
	amount: number;
	/** Optional ISO date string (or any parseable date string) from the backend. */
	date?: string;
}

interface TimelineProps {
	/** Raw expenses to visualize as a time series. */
	expenses: Expense[];
}

/**
 * Area chart showing total spend aggregated per day.
 *
 * The component groups expenses by a human-readable date label and then sorts
 * them to produce a left-to-right timeline for Recharts.
 */
const SpendingTimeline: React.FC<TimelineProps> = ({ expenses }) => {
	// 1. Group by Date
	const timelineData = expenses.reduce(
		(acc: Record<string, number>, current) => {
			const date = new Date(current.date ?? Date.now()).toLocaleDateString(
				"en-US",
				{
					month: "short",
					day: "numeric",
				},
			);

			acc[date] = (acc[date] || 0) + Number(current.amount);
			return acc;
		},
		{},
	);

	// 2. Format for Recharts and Sort
	const chartTimeline = Object.entries(timelineData)
		.map(([date, amount]) => ({ date, amount }))
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

	if (expenses.length === 0) return null;

	return (
		<div className="w-full bg-card p-4 border shadow-sm" id="spending-trend">
			<h3 className="text-lg font-semibold mb-4 text-card-foreground">
				Spending Trend
			</h3>
			<div className="h-[250px] w-full">
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart data={chartTimeline}>
						<defs>
							<linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
								<stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
							</linearGradient>
						</defs>
						<CartesianGrid
							strokeDasharray="3 3"
							vertical={false}
							stroke="#e2e8f0"
						/>
						<XAxis
							dataKey="date"
							tick={{ fontSize: 11 }}
							axisLine={false}
							tickLine={false}
							minTickGap={20}
						/>
						<YAxis
							tick={{ fontSize: 11 }}
							axisLine={false}
							tickLine={false}
							tickFormatter={(value) => `$${value}`}
						/>
						<Tooltip
							contentStyle={{
								borderRadius: "8px",
								border: "none",
								boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
							}}
						/>
						<Area
							type="monotone"
							dataKey="amount"
							stroke="#3b82f6"
							strokeWidth={2}
							fillOpacity={1}
							fill="url(#colorAmount)"
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default SpendingTimeline;
