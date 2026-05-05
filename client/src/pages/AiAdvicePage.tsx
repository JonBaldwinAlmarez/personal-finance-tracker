import { AIAdvisor } from "@/components/custom/AIAdvisor";
import { SavedAdvice } from "@/components/custom/SavedAdvice";
import { useAppShell } from "@/lib/appShell";

/**
 * AI advice page for generated tips and saved recommendations.
 */
export function AiAdvicePage() {
	const { totalBalance } = useAppShell();

	return (
		<section className="py-12 space-y-6">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h1 className="text-3xl font-bold text-slate-900">AI Advice</h1>
				<p className="mt-2 text-slate-500">
					Get personalized suggestions based on your current spending total.
				</p>
			</div>

			<AIAdvisor currentTotal={totalBalance} />
			<SavedAdvice />
		</section>
	);
}
