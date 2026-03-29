const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

// Path: /api/ai/analyze
router.post("/analyze", aiController.getSpendingAnalysis);

// Saved AI advice endpoints
router.get("/saved", aiController.getSavedAdvice);
router.post("/saved", aiController.saveAdvice);
router.delete("/saved/:id", aiController.deleteAdvice);

module.exports = router;
