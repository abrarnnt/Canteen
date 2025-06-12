const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Initialize express
const app = express()


        
// Import all route modules
const routes = {
    auth: require("./routes/authRoutes"),
    company: require("./routes/companyRoutes"),
    dashboard: require("./routes/dashboardRoutes"),
    users: require("./routes/userRoutes"),
    devices: require("./routes/deviceRoutes"),
    locations: require("./routes/locationRoutes"),    packages: require("./routes/packageRoutes"),
    batches: require("./routes/batchRoutes"),
    places: require("./routes/placeRoutes"),
    adminUsers: require("./routes/adminUserRoutes")
};

// Register routes
try {
    app.use('/api/auth', routes.auth);
    app.use('/api/company', routes.company);
    app.use('/api/dashboard', routes.dashboard);
    app.use('/api/users', routes.users);
    app.use('/api/devices', routes.devices);
    app.use('/api/locations', routes.locations);
    app.use('/api/packages', routes.packages);
    app.use('/api/batches', routes.batches);
    app.use('/api/places', routes.places);
    app.use('/api/admin-users', routes.adminUsers);
    
    console.log(' All routes registered successfully');
} catch (err) {
    console.error(' Error registering routes:', err.message);
}

// Basic route for testing
app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});

// Add a friendly message for undefined routes
app.use('/dashboard', (req, res) => {
    res.status(404).json({ message: "Dashboard route is not defined." });
});

// Add a friendly root route for /api
app.get('/api', (req, res) => {
    res.json({ message: "Welcome to the API root." });
});

// Connect to MongoDB and start server
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();
        
        // Start server
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`
 Server is running on port ${PORT}
  API Documentation:
   - Test API: http://localhost:${PORT}
   - API Endpoints: http://localhost:${PORT}/api/*
            `);
        });
    } catch (err) {
        console.error(" Server startup error:", err);
        process.exit(1);
    }
};

startServer();