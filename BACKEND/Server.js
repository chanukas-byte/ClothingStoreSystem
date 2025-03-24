const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config(); // Load .env variables

const app = express();

// Server Port Configuration
const PORT = process.env.PORT || 7050; // Fixed port number

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

// Import Routers (Fixed path and naming)
const EmployeeRouter = require("./Routes/EmployeeRoutes");
const FinanceRouter = require("./Routes/financeRoutes");
const supplierRoutes = require("./Routes/SupplierRegiRoutes");
const productRoutes = require("./Routes/ProductRoutes");

// Use Routers (correct path and usage)
app.use("/api/employee", EmployeeRouter); // Employee routes
app.use("/api/finance", FinanceRouter);   // Finance routes
app.use("/suppliers", supplierRoutes); //suppliers Route
app.use("/products", productRoutes); //product Routes

// Test Route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to Employee and Finance Management API!");
});

// Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server is up and running on http://localhost:${PORT}`);
});