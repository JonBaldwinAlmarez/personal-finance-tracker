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
}

export interface CreateBudgetPayload {
	amount: number;
	startDate: string;
	endDate: string;
	note?: string;
	alertThresholds?: number[];
}
