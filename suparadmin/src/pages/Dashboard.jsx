// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const Dashboard = () => {
  const [metrics, setMetrics] = useState({ todayUsers: 0, todayFees: 0, totalUsers: 0 });
  const [summary, setSummary] = useState([]);
  const [overview, setOverview] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Select Location");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [metricsRes, summaryRes] = await Promise.all([
          axios.get("/dashboard/metrics"),
          axios.get("/dashboard/summary")
        ]);

        setMetrics(metricsRes.data);
        setSummary(summaryRes.data);
      } catch {
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedDate, selectedLocation]); // Add dependencies to useEffect to prevent infinite re-render

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    if (selectedLocation !== "Select Location") {
      fetchOverview(newDate, selectedLocation);
    }
  };

  const handleLocationChange = (e) => {
    const newLocation = e.target.value;
    setSelectedLocation(newLocation);
    if (selectedDate) {
      fetchOverview(selectedDate, newLocation);
    }
  };
  const fetchOverview = async (date, location) => {
    try {
      const res = await axios.get("/dashboard/overview", { 
        params: { date, location } 
      });
      console.log("Overview Data:", res.data);
      setOverview(res.data);
    } catch (err) {
      console.error("Failed to fetch overview:", err);
      setError("Failed to load overview data");
    }
  };
  // Handle loading and error states
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Add conditional rendering to handle empty or invalid data
  if (!metrics || !summary) {
    return (
      <div className="p-6">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Ensure metrics data is valid
  const { todayUsers = 0, todayFees = 0, totalUsers = 0 } = metrics;

  // Ensure summary data is valid
  const chartData = {
    labels: summary.map((item) => item.day || "Unknown"),
    datasets: [
      {
        label: "Breakfast",
        data: summary.map((item) => item.breakfast || 0),
        borderColor: "#FF6384",
        fill: false,
      },
      {
        label: "Lunch",
        data: summary.map((item) => item.lunch || 0),
        borderColor: "#36A2EB",
        fill: false,
      },
      {
        label: "Supper",
        data: summary.map((item) => item.supper || 0),
        borderColor: "#FFCE56",
        fill: false,
      },
      {
        label: "Dinner",
        data: summary.map((item) => item.dinner || 0),
        borderColor: "#4BC0C0",
        fill: false,
      },
    ],
  };

  // Ensure overview data is valid
  const overviewData = overview?.data || {};

  console.log("Metrics State:", metrics);
  console.log("Summary State:", summary);
  console.log("Overview State:", overview);

  // Use the extracted variables in the JSX rendering
  return (
    <div className="p-6">
      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded shadow">
          <h3 className="text-lg font-bold">Today's Users</h3>
          <p className="text-2xl">{todayUsers}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h3 className="text-lg font-bold">Today's Fees</h3>
          <p className="text-2xl">{todayFees}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h3 className="text-lg font-bold">Total Users</h3>
          <p className="text-2xl">{totalUsers}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="border p-2 rounded"
        />
        <select
          value={selectedLocation}
          onChange={handleLocationChange}
          className="border p-2 rounded"
        >
          
        </select>
      </div>

      {/* Summary Graph */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h3 className="text-lg font-bold mb-4">Summary</h3>
        <Line data={chartData} />
      </div>

      {/* Overview */}
      {overview && (
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-bold mb-4">Overview</h3>
          <p>Date: {overview.date}</p>
          <p>Location: {overview.location}</p>
          <p>Breakfast: {overviewData.breakfast}</p>
          <p>Lunch: {overviewData.lunch}</p>
          <p>Supper: {overviewData.supper}</p>
          <p>Dinner: {overviewData.dinner}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

