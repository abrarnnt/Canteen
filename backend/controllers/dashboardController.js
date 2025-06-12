const User = require("../models/userAuthModel");

// Helper function to calculate today's fees (mock implementation)
const calculateTodayFees = async () => {
  // TODO: Replace with actual fee calculation from your transactions/fees collection
  return Math.floor(Math.random() * 5000) + 1000;
};

const getMetrics = async (req, res) => {
  try {
    // Get today's start and end timestamps
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get actual metrics from database
    const todayUsers = await User.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });

    const totalUsers = await User.countDocuments();

    // For fees, you would typically aggregate from a fees/transactions collection
    // Using mock data for now
    const todayFees = await calculateTodayFees();

    res.json({
      todayUsers,
      todayFees,
      totalUsers
    });
  } catch (err) {
    console.error("Error fetching metrics:", err);
    res.status(500).json({ message: "Error fetching dashboard metrics" });
  }
};

const getSummary = async (req, res) => {
  try {
    // Get last 7 days data
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const summary = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay()];
      
      // You would typically aggregate this data from your meals/orders collection
      // Using mock data for now
      summary.push({
        day: dayName,
        breakfast: Math.floor(Math.random() * 50) + 100,
        lunch: Math.floor(Math.random() * 50) + 120,
        supper: Math.floor(Math.random() * 40) + 70,
        dinner: Math.floor(Math.random() * 50) + 90
      });
    }
    
    res.json(summary);
  } catch (err) {
    console.error("Error fetching summary:", err);
    res.status(500).json({ message: "Error fetching dashboard summary" });
  }
};

const getOverview = async (req, res) => {
  try {
    const { date, location } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    // You would typically aggregate this data from your meals/orders collection
    // Using mock data for now that changes based on input
    const mealCounts = {
      breakfast: Math.floor(Math.random() * 50) + 100,
      lunch: Math.floor(Math.random() * 50) + 120,
      supper: Math.floor(Math.random() * 40) + 70,
      dinner: Math.floor(Math.random() * 50) + 90
    };    res.json({
      date,
      location: location || 'All Locations',
      data: mealCounts
    });
  } catch (err) {
    console.error("Error fetching overview:", err);
    res.status(500).json({ message: "Error fetching overview data" });
  }
};

module.exports = {
  getMetrics,
  getSummary,
  getOverview
};
