import { useState } from "react";
import { Button } from "@/components/ui/button";

// 1. Define what an Expense looks like (The Interface)
interface Expense {
	_id: string;
	description: string;
	amount: number;
	category: string;
	date: string;
}

function App() {
	// 2. Tell React this state is an Array of Expenses
	const [expenses, setExpenses] = useState<Expense[]>([]);

	return (
		<div className="min-h-screen bg-slate-50 p-4 md:p-8">
			<div className="max-w-4xl mx-auto space-y-8">
				{/* Header Section */}
				<header className="flex justify-between items-center border-b pb-6">
					<div>
						<h1 className="text-3xl font-bold tracking-tight text-slate-900">
							Finance Tracker
						</h1>
						<p className="text-slate-500">Manage your budget with ease.</p>
					</div>
					<Button variant="outline">Refresh Data</Button>
				</header>

				{/* Main Content Grid */}
				<main className="grid gap-8 md:grid-cols-2">
					{/* Left Column: Form will go here */}
					<section className="bg-white p-6 rounded-xl shadow-sm border">
						<h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
						<div className="text-sm text-slate-400 italic">
							Form Component coming soon...
						</div>
					</section>

					{/* Right Column: List will go here */}
					<section className="bg-white p-6 rounded-xl shadow-sm border">
						<h2 className="text-xl font-semibold mb-4">History</h2>
						{expenses.length === 0 ? (
							<p className="text-slate-500">No transactions yet.</p>
						) : (
							<p>List items will appear here.</p>
						)}
					</section>
				</main>
			</div>
		</div>
	);
}

export default App;
