const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

// Path: /api/ai/analyze
router.post("/analyze", aiController.getSpendingAnalysis);

module.exports = router;
