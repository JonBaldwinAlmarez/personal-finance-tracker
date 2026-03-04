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
import { type Expense } from "@/lib/api";

interface ChartProps {
	expenses: Expense[];
}

// Professional Blue Palette
const COLORS = ["#1e40af", "#2563eb", "#3b82f6", "#60a5fa", "#93c5fd"];

export const ExpenseChart: React.FC<ChartProps> = ({ expenses }) => {
	// Logic: Sort by highest amount and take the top 5
	const chartData = [...expenses]
		.sort((a, b) => b.amount - a.amount)
		.slice(0, 5)
		.map((item) => ({
			name:
				item.description.length > 12
					? item.description.substring(0, 12) + "..."
					: item.description,
			amount: item.amount,
		}));

	if (expenses.length === 0) return null;

	return (
		<div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mb-12">
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
							{chartData.map((entry, index) => (
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
