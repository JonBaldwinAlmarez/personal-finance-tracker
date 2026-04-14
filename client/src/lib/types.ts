// Shared types for the entire application

/**
 * Expense interface representing a single financial transaction.
 */
export interface Expense {
	_id: string;
	description: string;
	amount: number;
	category?: string;
	date?: string;
}

/**
 * AIAnalysis interface for AI-generated financial advice.
 */
export interface AIAnalysis {
	advice: string;
	suggestedBudget: number;
}

/**
 * SavedAdviceItem interface extending AIAnalysis with database fields.
 */
export interface SavedAdviceItem extends AIAnalysis {
	_id: string;
	dateSaved: string;
}

/**
 * Budget interface representing a user's budget with various properties and optional fields for tracking spending and alert levels.
 */

export interface Budget {
	_id: string;
	amount: number;
	startDate: string;
	endDate: string;
	isActive: boolean;
	alertThresholds: number[];
	note?: string;
	createdAt: string;
	spent?: number;
	percentage?: number;
	alertLevel?: "ok" | "info" | "warning" | "critical" | "error";
	isExpired?: boolean;
}

/**
 * CreateBudgetPayload interface for creating a new budget, with required fields for amount and date range, and optional fields for notes and alert thresholds.
 *
 */

export interface CreateBudgetPayload {
	amount: number;
	startDate: string;
	endDate: string;
	note?: string;
	alertThresholds?: number[];
}
