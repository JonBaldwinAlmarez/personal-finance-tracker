import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	Cell,
	CartesianGrid,
} from "recharts";
import { type Expense } from "@/lib/types";

interface ChartProps {
	/** Raw expense list (component derives the aggregated chart series). */
	expenses: Expense[];
}

// Professional Blue Palette
const COLORS = ["#1e40af", "#2563eb", "#3b82f6", "#60a5fa", "#93c5fd"];

/**
 * Bar chart showing the top 5 largest expenses (grouped by description).
 *
 * This is a purely-presentational component that derives chart data from `expenses`.
 */
export const ExpenseChart: React.FC<ChartProps> = ({ expenses }) => {
	// Group and Sum values by name
	const groupedData = expenses.reduce(
		(acc: Record<string, { amount: number }>, current) => {
			const name = current.description.trim().toLocaleLowerCase();

			if (acc[name]) {
				acc[name].amount += current.amount;
			} else {
				acc[name] = { amount: current.amount };
			}
			return acc;
		},
		{} as Record<string, { amount: number }>,
	);

	// Convert the grouped map into a sorted array for Recharts.
	const chartData = Object.entries(groupedData)
		.map(([name, value]) => ({
			// Capitalize first letter for the UI
			name: name.charAt(0).toUpperCase() + name.slice(1),
			amount: value.amount,
		}))
		// 3. Sort by highest total amount
		.sort((a, b) => b.amount - a.amount)
		// 4. Take top 5 for a clean look on all devices
		.slice(0, 5);

	if (expenses.length === 0) return null;

	return (
		<div
			className="bg-white p-8 border border-slate-200 shadow-sm mb-12"
			id="spending-breakdown"
		>
			<div className="mb-6">
				<h3 className="text-xl font-bold text-slate-900 tracking-tight">
					Spending Breakdown
				</h3>
				<p className="text-sm text-slate-500">
					Your top 5 largest transactions
				</p>
			</div>

			<div className="h-[300px] w-full">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart
						data={chartData}
						margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
					>
						<CartesianGrid
							strokeDasharray="3 3"
							vertical={false}
							stroke="#f1f5f9"
						/>
						<XAxis
							dataKey="name"
							axisLine={false}
							tickLine={false}
							tick={{ fill: "#64748b", fontSize: 12 }}
							dy={10}
						/>
						<YAxis
							axisLine={false}
							tickLine={false}
							tick={{ fill: "#64748b", fontSize: 12 }}
						/>
						<Tooltip
							cursor={{ fill: "#f8fafc" }}
							contentStyle={{
								borderRadius: "12px",
								border: "none",
								boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
							}}
						/>
						<Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={40}>
							{chartData.map((_, index) => (
								<Cell
									key={`cell-${index}`}
									fill={COLORS[index % COLORS.length]}
								/>
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};
