import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ExpenseFormProps {
	onAdd: (expense: { description: string; amount: number }) => void;
}

export function ExpenseForm({ onAdd }: ExpenseFormProps) {
	const [description, setDescription] = useState("");
	const [amount, setAmount] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!description || !amount) return;

		onAdd({
			description,
			amount: parseFloat(amount),
		});

		setDescription("");
		setAmount("");
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<Input
				placeholder="Description (e.g. Groceries)"
				value={description}
				onChange={(e) => setDescription(e.target.value)}
			/>
			<Input
				type="number"
				placeholder="Amount"
				value={amount}
				onChange={(e) => setAmount(e.target.value)}
			/>
			<Button type="submit" className="w-full">
				Add Transaction
			</Button>
		</form>
	);
}
