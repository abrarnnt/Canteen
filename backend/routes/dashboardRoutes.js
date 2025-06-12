const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getMetrics,
  getSummary,
  getOverview,
} = require("../controllers/dashboardController");

// // Route to fetch today's metrics
// router.get("/metrics", auth(['superadmin', 'admin']), getMetrics);

// // Route to fetch summary data for the graph
// router.get("/summary", auth(['superadmin', 'admin']), getSummary);

// // Route to fetch overview data by date and location
// router.get("/overview", auth(['superadmin', 'admin']), getOverview);

module.exports = router;
