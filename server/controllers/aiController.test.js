const { getSavedAdvice, saveAdvice } = require("../controllers/aiController"); // Path to your file
const SavedAdvice = require("../models/SavedAdvice");

const { GoogleGenerativeAI } = require("@google/generative-ai");
const Expense = require("../models/Expense");
const { describe } = require("node:test");

// 1. MOCK THE MODEL: This tells Jest to "hijack" any calls to the SavedAdvice model
jest.mock("../models/SavedAdvice");
jest.mock("@google/generative-ai");
jest.mock("../models/Expense");

describe("AI response", () => {
	it("Should return a response from the Gemini API", async () => {
		// Arrange: Set up the mock response from the Gemini API
		const mockResponse = {
			response: {
				text: () =>
					JSON.stringify({
						advice: "Try to save more by cutting down on dining out.",
						suggestedBudget: 300,
					}),
			},
		};
		// 2. MOCK THE CHAIN:
		// We mock generateContent to return our fake response
		const mockGenerateContent = jest.fn().mockResolvedValue(mockResponse);

		// We mock getGenerativeModel to return an object containing our mock function
		GoogleGenerativeAI.prototype.getGenerativeModel.mockResolvedValue(
			mockGenerateContent,
		);
	});
});

describe("Advice Controller Unit Tests", () => {
	let req, res;

	// This runs before every single test to reset our "fake" request and response
	beforeEach(() => {
		req = {
			body: {},
			params: {},
		};
		res = {
			status: jest.fn().mockReturnThis(), // Allows us to chain .status().json()
			json: jest.fn().mockReturnThis(),
		};
	});

	describe("getSavedAdvice", () => {
		test("should return all advice items with a 200 status", async () => {
			// ARRANGE: Fake data that the database would normally return
			const mockData = [{ advice: "Save more!", suggestedBudget: 500 }];

			// Tell the fake model to return our fake data
			SavedAdvice.find.mockReturnValue({
				sort: jest.fn().mockResolvedValue(mockData),
			});

			// ACT
			await getSavedAdvice(req, res);

			// ASSERT
			expect(res.json).toHaveBeenCalledWith({ data: mockData });
		});

		test("should return 500 error if database fails", async () => {
			// ARRANGE: Simulate a database crash
			SavedAdvice.find.mockReturnValue({
				sort: jest.fn().mockRejectedValue(new Error("DB Fail")),
			});

			// ACT
			await getSavedAdvice(req, res);

			// ASSERT
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				error: "Failed to fetch saved advice.",
			});
		});
	});

	describe("saveAdvice", () => {
		test("should return 400 if advice or budget is missing", async () => {
			// ARRANGE: Request body is missing 'advice'
			req.body = { suggestedBudget: 100 };

			// ACT
			await saveAdvice(req, res);

			// ASSERT
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				error: "Advice and suggested budget are required.",
			});
		});

		test("should save advice successfully and return 201", async () => {
			// ARRANGE
			req.body = { advice: "Spend less on coffee", suggestedBudget: 50 };
			SavedAdvice.create.mockResolvedValue(req.body);

			// ACT
			await saveAdvice(req, res);

			// ASSERT
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith(req.body);
		});
	});
});
