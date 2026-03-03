import React from "react";

export const Footer: React.FC = () => {
	return (
		<footer className="bg-white border-t border-slate-200 py-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<div className="mb-6">
					<span className="text-lg font-bold tracking-tighter text-slate-900">
						FINANCE.IO
					</span>
					<p className="mt-2 text-sm text-slate-500">
						Taking control of your wealth, one transaction at a time.
					</p>
				</div>

				<div className="flex justify-center space-x-6 mb-8 text-sm text-slate-400">
					<a href="#" className="hover:text-slate-600">
						Privacy Policy
					</a>
					<a href="#" className="hover:text-slate-600">
						Terms of Service
					</a>
					<a href="#" className="hover:text-slate-600">
						Github
					</a>
				</div>

				<p className="text-xs text-slate-400">
					© {new Date().getFullYear()} Finance.io. All rights reserved.
				</p>
			</div>
		</footer>
	);
};
