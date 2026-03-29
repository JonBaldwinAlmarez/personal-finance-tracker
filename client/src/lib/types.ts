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
