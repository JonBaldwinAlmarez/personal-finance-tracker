import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Trash2, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import type { SavedAdviceItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

/**
 * SavedAdvice component for displaying and managing saved AI advice.
 *
 * Features:
 * - Collapsible section showing saved advice count
 * - Card-based display with advice text, budget, and date
 * - Delete functionality with confirmation
 * - Auto-refresh after operations
 */
export const SavedAdvice: React.FC = () => {
	const [savedAdvice, setSavedAdvice] = useState<SavedAdviceItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isExpanded, setIsExpanded] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	// Fetch saved advice on component mount
	useEffect(() => {
		fetchSavedAdvice();
	}, []);

	const fetchSavedAdvice = async () => {
		try {
			setLoading(true);
			const data = (await api.getSavedAdvice()) as SavedAdviceItem[];
			setSavedAdvice(data);
		} catch (err) {
			toast.error("Fail to load save Advice.", { duration: 5000 });
			setError("Failed to load saved advice.");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this saved advice?")) {
			toast.success("Remove Advice successful");
			return;
		}

		try {
			setDeletingId(id);
			await api.deleteAdvice(id);

			// Remove from local state
			setSavedAdvice((prev) => prev.filter((item) => item._id !== id));
		} catch (err) {
			setError("Failed to delete advice.");
			console.error(err);
		} finally {
			setDeletingId(null);
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	if (loading && savedAdvice.length === 0) {
		return (
			<div className="animate-pulse">
				<div className="h-12 bg-slate-200 rounded-lg"></div>
			</div>
		);
	}

	return (
		<section className="max-w-4xl mx-auto px-4 py-6">
			<div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
				{/* Header - Clickable to expand/collapse */}
				<Button
					onClick={() => setIsExpanded(!isExpanded)}
					className="w-full p-6 border-b border-slate-300 flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 transition-colors"
				>
					<div className="flex items-center gap-2">
						<Sparkles className="w-5 h-5 text-blue-600" />
						<h2 className="text-xl font-semibold text-slate-900">
							Saved Advice ({savedAdvice.length})
						</h2>
					</div>
					{isExpanded ? (
						<ChevronUp className="w-5 h-5 text-slate-500" />
					) : (
						<ChevronDown className="w-5 h-5 text-slate-500" />
					)}
				</Button>

				{/* Content - Only show when expanded */}
				<AnimatePresence>
					{isExpanded && (
						<motion.div
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: "auto", opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							transition={{ duration: 0.3, ease: "easeInOut" }}
							className="overflow-hidden"
						>
							<div className="p-6">
								{error && (
									<div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
										⚠️ {error}
									</div>
								)}

								{savedAdvice.length === 0 ? (
									<div className="text-center py-8 text-slate-500">
										<Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
										<p className="font-medium">No saved advice yet</p>
										<p className="text-sm">
											Get AI advice above to start saving helpful tips!
										</p>
									</div>
								) : (
									<div className="grid gap-4 md:grid-cols-2">
										{savedAdvice.map((item) => (
											<div
												key={item._id}
												className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow"
											>
												<div className="flex items-start justify-between mb-3">
													<div className="flex items-center gap-2 text-sm text-slate-600">
														<Sparkles className="w-4 h-4" />
														<span>
															Advice from {formatDate(item.dateSaved)}
														</span>
													</div>
													<Button
														variant="ghost"
														size="sm"
														onClick={() => handleDelete(item._id)}
														disabled={deletingId === item._id}
														className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
													>
														<Trash2 className="w-4 h-4" />
													</Button>
												</div>

												<p className="text-slate-800 mb-3 leading-relaxed">
													{item.advice}
												</p>

												<div className="text-sm font-medium text-green-600">
													Suggested Budget: ₱
													{item.suggestedBudget.toLocaleString()}
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</section>
	);
};
