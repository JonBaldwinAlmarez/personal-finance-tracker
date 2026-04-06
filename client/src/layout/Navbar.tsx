import React, { useState, useEffect } from "react";
//import { Button } from "../components/ui/button";

/**
 * Sticky top navigation bar with in-page anchor links.
 *
 * Only visible when scrolled past the hero section for cleaner landing experience.
 * Uses scroll detection to show/hide based on user position.
 */
export const Navbar: React.FC = () => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			// Get the hero section element
			const heroSection = document.getElementById("hero");
			if (heroSection) {
				// Calculate when hero section is no longer visible
				const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
				const scrollPosition = window.scrollY;

				// Show navbar when scrolled past hero section
				setIsVisible(scrollPosition > heroBottom - 100); // Small offset for smoother transition
			}
		};

		// Add scroll listener
		window.addEventListener("scroll", handleScroll);

		// Check initial position
		handleScroll();

		// Cleanup
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<nav
			className={`fixed top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md transition-all duration-300 ${
				isVisible ? "translate-y-0 opacity-100 " : "-translate-y-full opacity-0"
			}`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-center md:justify-between items-center h-16">
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
								href="#AI-advisor"
								className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
							>
								AI Advisor
							</a>
							<a
								href="#spending-breakdown"
								className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
							>
								Spending Breakdown
							</a>

		
						</div>
					</div>

					{/* Call to Action Button 
					<div className="flex items-center">
						<Button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all">
							Get Started
						</Button>
					</div>
					*/}
				</div>
			</div>
		</nav>
	);
};
