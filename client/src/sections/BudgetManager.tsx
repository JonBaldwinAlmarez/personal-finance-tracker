import React, { useEffect, useMemo, useState } from "react";
import { BudgetForm } from "@/components/custom/BudgetForm";
import { BudgetHistory } from "@/components/custom/BudgetHistory";
import { BudgetStatus } from "@/components/custom/BudgetStatus";
import { useBudgets } from "@/hooks/useBudget";
import type { CreateBudgetPayload } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Budget management section.
 *
 * Uses `useBudgets` as the data source and orchestrates:
 * - creating a new budget
 * - showing current active budget health
 * - listing historical (inactive) budgets
 */
export const BudgetManager: React.FC = () => {
	const {
		budgets,
		activeBudget,
		loading,
		error,
		fetchBudgets,
		fetchActiveBudget,
		createBudget,
		updateBudget,
		deleteBudget,
		resetBudget,
	} = useBudgets();

	/**
	 * Local UI state for editing the active budget.
	 *
	 * Kept intentionally simple: only edits fields that are already present in both
	 * client types and the server schema (amount/dates/note).
	 */
	const [isEditingActive, setIsEditingActive] = useState(false);
	const [editForm, setEditForm] = useState({
		amount: "",
		startDate: "",
		endDate: "",
		note: "",
	});
	const [editError, setEditError] = useState<string | null>(null);

	const activeBudgetDates = useMemo(() => {
		if (!activeBudget) return null;
		// Normalize to YYYY-MM-DD for `<input type="date">`.
		const toDateInputValue = (d: string) =>
			new Date(d).toISOString().slice(0, 10);
		return {
			start: toDateInputValue(activeBudget.startDate),
			end: toDateInputValue(activeBudget.endDate),
		};
	}, [activeBudget]);

	/**
	 * Load the historical budget list when this section mounts.
	 *
	 * Note: active budget is fetched by the hook itself; this call only ensures
	 * budget history is available for the UI.
	 */
	useEffect(() => {
		fetchBudgets();
	}, [fetchBudgets]);

	/**
	 * Create a new active budget and refresh active + history views.
	 */
	const handleCreateBudget = async (payload: CreateBudgetPayload) => {
		const created = await createBudget(payload);
		if (created) {
			await fetchActiveBudget();
		}
	};

	/**
	 * Reset budget period by deactivating any current active budget and creating
	 * a fresh one for the provided date range.
	 */
	const handleResetBudget = async (payload: CreateBudgetPayload) => {
		const result = await resetBudget(payload);
		if (result) {
			await fetchBudgets();
			await fetchActiveBudget();
		}
	};

	/**
	 * Update the currently active budget.
	 *
	 * Uses light client-side validation to avoid sending obviously bad data.
	 */
	const handleUpdateActiveBudget = async (e: React.FormEvent) => {
		e.preventDefault();
		setEditError(null);

		if (!activeBudget) return;

		const amount = Number(editForm.amount);
		if (!Number.isFinite(amount) || amount <= 0) {
			setEditError("Budget amount must be greater than 0");
			return;
		}
		if (!editForm.startDate || !editForm.endDate) {
			setEditError("Please select both start and end dates");
			return;
		}
		if (new Date(editForm.endDate) <= new Date(editForm.startDate)) {
			setEditError("End date must be after start date");
			return;
		}

		const updated = await updateBudget(activeBudget._id, {
			amount,
			startDate: editForm.startDate,
			endDate: editForm.endDate,
			note: editForm.note || undefined,
		});

		if (updated) {
			setIsEditingActive(false);
			await fetchBudgets();
			await fetchActiveBudget();
		}
	};

	/**
	 * Delete a historical budget entry and refresh the active snapshot.
	 */
	const handleDeleteBudget = async (id: string) => {
		const deleted = await deleteBudget(id);
		if (deleted) {
			await fetchActiveBudget();
		}
	};

	return (
		<section className="max-w-7xl mx-auto px-4 py-10">
			<div className="mb-6">
				<h2 className="text-2xl font-bold text-slate-900">Budget Planner</h2>
				<p className="text-sm text-slate-500 mt-1">
					Set a budget period, track spending progress, and review past cycles.
				</p>
			</div>

			{error && (
				<div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
					⚠️ {error}
				</div>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
				<div className="lg:col-span-5">
					<BudgetForm
						onSubmit={handleCreateBudget}
						isLoading={loading}
						error={error}
					/>

					{/* Reset Budget: only available when an active budget exists. */}
					{activeBudget && (
						<div className="mt-6">
							<h3 className="text-lg font-semibold text-slate-900 mb-2">
								Reset Budget Period
							</h3>
							<p className="text-sm text-slate-500 mb-4">
								End the current budget and immediately start a new active
								period.
							</p>
							<BudgetForm
								onSubmit={handleResetBudget}
								isLoading={loading}
								error={error}
							/>
						</div>
					)}
				</div>
				<div className="lg:col-span-7 space-y-6">
					<BudgetStatus budget={activeBudget} isLoading={loading} />

					{/* Active Budget Editor: simple update UX without introducing new abstractions. */}
					{activeBudget && (
						<div className="bg-white p-6 rounded-lg shadow border border-slate-200">
							<div className="flex items-center justify-between gap-4">
								<div>
									<h3 className="text-lg font-semibold text-slate-900">
										Update Active Budget
									</h3>
									<p className="text-sm text-slate-500">
										Adjust amount, dates, or note for the current period.
									</p>
								</div>
								<Button
									variant="outline"
									onClick={() => {
										// 1. Toggle the editing state
										const nextValue = !isEditingActive;
										setIsEditingActive(nextValue);

										// 2. If we are opening the editor, sync the form data here
										if (nextValue && activeBudget && activeBudgetDates) {
											setEditForm({
												amount: String(activeBudget.amount ?? ""),
												startDate: activeBudgetDates.start,
												endDate: activeBudgetDates.end,
												note: activeBudget.note ?? "",
											});
											setEditError(null);
										}
									}}
									disabled={loading}
								>
									{isEditingActive ? "Close" : "Edit"}
								</Button>
							</div>

							{isEditingActive && (
								<form
									onSubmit={handleUpdateActiveBudget}
									className="mt-4 space-y-4"
								>
									{editError && (
										<div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
											⚠️ {editError}
										</div>
									)}

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-medium mb-1">
												Budget Amount ($)
											</label>
											<Input
												type="number"
												step="0.01"
												min="0"
												value={editForm.amount}
												onChange={(e) =>
													setEditForm((p) => ({ ...p, amount: e.target.value }))
												}
												disabled={loading}
											/>
										</div>
										<div>
											<label className="block text-sm font-medium mb-1">
												Start Date
											</label>
											<Input
												type="date"
												value={editForm.startDate}
												onChange={(e) =>
													setEditForm((p) => ({
														...p,
														startDate: e.target.value,
													}))
												}
												disabled={loading}
											/>
										</div>
										<div>
											<label className="block text-sm font-medium mb-1">
												End Date
											</label>
											<Input
												type="date"
												value={editForm.endDate}
												onChange={(e) =>
													setEditForm((p) => ({
														...p,
														endDate: e.target.value,
													}))
												}
												disabled={loading}
											/>
										</div>
										<div>
											<label className="block text-sm font-medium mb-1">
												Note (Optional)
											</label>
											<Input
												value={editForm.note}
												onChange={(e) =>
													setEditForm((p) => ({ ...p, note: e.target.value }))
												}
												disabled={loading}
												placeholder="e.g., April plan"
											/>
										</div>
									</div>

									<div className="flex justify-end">
										<Button type="submit" disabled={loading}>
											{loading ? "Saving..." : "Save Changes"}
										</Button>
									</div>
								</form>
							)}
						</div>
					)}

					<BudgetHistory
						budgets={budgets}
						isLoading={loading}
						onDeleteBudget={handleDeleteBudget}
					/>
				</div>
			</div>
		</section>
	);
};
