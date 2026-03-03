import { Navbar } from "@/layout/Navbar";

import { ExpenseManager } from "@/sections/ExpenseManager"; // Our main functionality
import { Footer } from "./layout/Footer";

function App() {
	return (
		<div className="min-h-screen overflow-x-hidden bg-slate-50 flex flex-col">
			<Navbar />
			<main className="grow">
				<ExpenseManager />
			</main>
			<Footer />
		</div>
	);
}

export default App;
