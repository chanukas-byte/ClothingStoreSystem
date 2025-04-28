const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config(); // Load .env variables

const app = express();

// Server Port Configuration
const PORT = process.env.PORT || 4058; // Fixed port number

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection URL
const URL = process.env.MONGODB_URL;

mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB Connection Successful!");
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection Error:", error);
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

// Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server is up and running on http://localhost:${PORT}`);
});
