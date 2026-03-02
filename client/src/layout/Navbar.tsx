export function Navbar() {
	return (
		<nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md px-8 py-4 flex justify-between items-center">
			<div className="font-bold text-xl tracking-tighter">FINANCE.IO</div>
			<div className="space-x-6 text-sm font-medium">
				<a href="#hero">Home</a>
				<a href="#expenses">Expenses</a>
				<a href="#about">About</a>
			</div>
		</nav>
	);
}
