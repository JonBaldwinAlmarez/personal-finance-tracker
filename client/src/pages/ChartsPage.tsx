import { ExpenseChart } from "@/components/custom/ExpenseChart";
import SpendingTimeline from "@/components/custom/SpendingTimeline";
import { useAppShell } from "@/lib/appShell";

/**
 * Charts page for visual spending summaries.
 */
export function ChartsPage() {
	const { expenses } = useAppShell();

	return (
		<section className="py-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
				<h1 className="text-3xl font-bold text-slate-900">Charts</h1>
				<p className="mt-2 text-slate-500">
					Review your spending patterns with visual summaries and trends.
				</p>
			</div>

			<div className="flex flex-col w-full md:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-2">
				<ExpenseChart expenses={expenses} />
				<SpendingTimeline expenses={expenses} />
			</div>
		</section>
	);
}
