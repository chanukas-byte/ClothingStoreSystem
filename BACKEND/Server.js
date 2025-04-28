const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config(); // Load .env variables

const app = express();

// Server Port Configuration
const PORT = process.env.PORT || 4058; // Fixed port number

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the uploads directory with error handling
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, path) => {
        res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));

// MongoDB Connection URL
const URL = process.env.MONGODB_URL;

// MongoDB Connection with proper options
mongoose
    .connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    })
    .then(() => {
        console.log("✅ MongoDB Connection Successful!");
    })
    .catch((error) => {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1); // Exit if cannot connect to database
    });

// Import Routers (Ensure these are the correct paths)
const EmployeeRouter = require("./Routes/EmployeeRoutes");
const FinanceRouter = require("./Routes/financeRoutes");
const supplierRoutes = require("./Routes/SupplierRegiRoutes");
const productRoutes = require("./Routes/ProductRoutes");

const categoryRoutes = require("./Routes/CategoryRoutes"); // Ensure this file exists and is named correctly
const financialRoutes = require("./Routes/financialRoutes");
const feedbackRoutes = require("./Routes/FeedbackRoutes");

// Use Routers (Ensure you're using the correct paths and naming conventions)
app.use("/api/employee", EmployeeRouter); // Employee routes
app.use("/api/finance", FinanceRouter);   // Finance routes
app.use("/suppliers", supplierRoutes);    // Suppliers routes
app.use("/products", productRoutes);      // Product routes
app.use("/category", categoryRoutes);     // Category routes
app.use("/api", financialRoutes);         // Financial routes
app.use("/api/feedback", feedbackRoutes); // Feedback routes

// Test Route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to Employee and Finance Management API!");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Handle 404 routes
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

// Start the Server with error handling
const server = app.listen(PORT, () => {
    console.log(`🚀 Server is up and running on http://localhost:${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
    console.error('Server error:', error);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    server.close(() => {
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    server.close(() => {
        process.exit(1);
    });
});
