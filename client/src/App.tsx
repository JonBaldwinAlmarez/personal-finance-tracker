import { Navbar } from "@/layout/Navbar";

import { ExpenseManager } from "@/sections/ExpenseManager"; // Our main functionality

function App() {
	return (
		<div className="min-h-screen overflow-x-hidden bg-slate-50">
			<Navbar />
			<main>
				<ExpenseManager />
			</main>
		</div>
	);
}

export default App;
