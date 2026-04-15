import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";

/**
 * Sticky top navigation bar with route links.
 *
 * On the dashboard it appears after the hero section for the original landing-page
 * feel, and it stays visible on dedicated sub-pages.
 */
export const Navbar: React.FC = () => {
	const [isVisible, setIsVisible] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const location = useLocation();

	useEffect(() => {
		// Close the mobile menu on navigation.
		setIsMobileMenuOpen(false);

		if (location.pathname !== "/") {
			setIsVisible(true);
			return;
		}

		const handleScroll = () => {
			const heroSection = document.getElementById("hero");
			if (heroSection) {
				const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
				const scrollPosition = window.scrollY;
				setIsVisible(scrollPosition > heroBottom - 100);
			} else {
				setIsVisible(true);
			}
		};

		window.addEventListener("scroll", handleScroll);
		handleScroll();
		return () => window.removeEventListener("scroll", handleScroll);
	}, [location.pathname]);

	const navLinkClass = ({ isActive }: { isActive: boolean }) =>
		`text-sm font-medium transition-colors ${
			isActive ? "text-slate-900" : "text-slate-600 hover:text-slate-900"
		}`;

	return (
		<nav
			className={`fixed top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md transition-all duration-300 ${
				isVisible ? "translate-y-0 opacity-100 " : "-translate-y-full opacity-0"
			}`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<div className="flex-shrink-0 flex items-center">
						<Link
							to="/"
							className="text-xl font-bold tracking-tighter text-slate-900"
						>
							FINANCE.IO
						</Link>
					</div>

					<div className="hidden md:block">
						<div className="ml-10 flex items-center space-x-8">
							<NavLink to="/" end className={navLinkClass}>
								Home
							</NavLink>
							<NavLink to="/charts" className={navLinkClass}>
								Charts
							</NavLink>
							<NavLink to="/advice" className={navLinkClass}>
								AI Advisor
							</NavLink>
						</div>
					</div>

					{/* Mobile menu button */}
					<button
						type="button"
						className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
						aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
						aria-expanded={isMobileMenuOpen}
						onClick={() => setIsMobileMenuOpen((v) => !v)}
					>
						{isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
					</button>
				</div>

				{/* Mobile menu panel */}
				{isMobileMenuOpen && (
					<div className="md:hidden border-t border-slate-200 py-3">
						<div className="flex flex-col gap-2">
							<NavLink to="/" end className={navLinkClass}>
								Home
							</NavLink>
							<NavLink to="/charts" className={navLinkClass}>
								Charts
							</NavLink>
							<NavLink to="/advice" className={navLinkClass}>
								AI Advisor
							</NavLink>
						</div>
					</div>
				)}
			</div>
		</nav>
	);
};
