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
	// React Router hook that gives access to the current URL (path)
	const location = useLocation();

	// Boolean flag to check if the user is currently on the homepage "/"
	// Useful for conditional UI rendering (e.g., hiding navbar elements on home)
	const isHomePage = location.pathname === "/";

	// State to track the vertical scroll position (scrollY)
	// Initialized safely to avoid errors during SSR (server-side rendering)
	const [scrollY, setScrollY] = useState(() =>
		// If window is not available (SSR), default to 0
		typeof window === "undefined" ? 0 : window.scrollY,
	);

	const [mobileMenuPath, setMobileMenuPath] = useState<string | null>(null);
	const isMobileMenuOpen = mobileMenuPath === location.pathname;

	const heroSection =
		typeof document === "undefined" ? null : document.getElementById("hero");
	const heroBottom = heroSection
		? heroSection.offsetTop + heroSection.offsetHeight - 100
		: null;
	const isVisible = !isHomePage || heroBottom === null || scrollY > heroBottom;

	useEffect(() => {
		if (!isHomePage) {
			return;
		}

		const handleScroll = () => {
			setScrollY(window.scrollY);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [isHomePage]);

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
						onClick={() =>
							setMobileMenuPath((currentPath) =>
								currentPath === location.pathname ? null : location.pathname,
							)
						}
					>
						{isMobileMenuOpen ? (
							<X className="h-5 w-5" />
						) : (
							<Menu className="h-5 w-5" />
						)}
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
