import React from "react";

export const Navbar: React.FC = () => {
	return (
		<nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<div className="flex-shrink-0 flex items-center">
						<span className="text-xl font-bold tracking-tighter text-slate-900">
							FINANCE.IO
						</span>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden md:block">
						<div className="ml-10 flex items-baseline space-x-8">
							<a
								href="#hero"
								className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
							>
								Home
							</a>
							<a
								href="#expenses"
								className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
							>
								Transactions
							</a>
							<a
								href="#about"
								className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
							>
								About
							</a>
						</div>
					</div>

					{/* Call to Action Button */}
					<div className="flex items-center">
						<button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all">
							Get Started
						</button>
					</div>
				</div>
			</div>
		</nav>
	);
};
