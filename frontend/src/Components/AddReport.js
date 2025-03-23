import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer"; 

import {
  Box,
  Button,
  TextField,
  Tooltip,
  Typography,
  Alert,
  Container,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { FaMoneyBillWave, FaCoins } from "react-icons/fa";
import jsPDF from "jspdf";
import axios from "axios";

function AddReport() {
  const [month, setMonth] = useState("");
  const [revenue, setRevenue] = useState("");
  const [expenses, setExpenses] = useState("");
  const [profitOrLoss, setProfitOrLoss] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-calculate profit/loss on revenue/expenses change
  useEffect(() => {
    setProfitOrLoss((parseFloat(revenue) || 0) - (parseFloat(expenses) || 0));
  }, [revenue, expenses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Form validation
    if (!month.trim() || !/^[a-zA-Z]+\s\d{4}$/.test(month)) {
      setError("Please enter a valid month (e.g., January 2025).");
      return;
    }

    if (isNaN(revenue) || isNaN(expenses) || revenue === "" || expenses === "") {
      setError("Please enter valid numeric values for revenue and expenses.");
      return;
    }

    if (parseFloat(revenue) < 0 || parseFloat(expenses) < 0) {
      setError("Revenue and expenses must be non-negative.");
      return;
    }

    const reportData = {
      month,
      revenue: parseFloat(revenue),
      expenses: parseFloat(expenses),
      profitOrLoss,
    };

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8090/api/finance/add", reportData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status >= 200 && response.status < 300) {
        setSuccess("Finance report successfully added and saved!");
        generatePDF();
        setTimeout(resetForm, 2000); // Reset form after success
      } else {
        setError("Unexpected server response. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting the report:", error);
      setError(
        error.response?.data?.message || "Failed to submit the report. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Header and branding
    doc.setFontSize(22);
    doc.setTextColor(0, 102, 204);
    doc.text("Finance Report", 105, 15, { align: "center" });

    doc.setFontSize(16);
    doc.setTextColor(100);
    doc.text("Live Art Clothing Pvt Ltd", 105, 25, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(50);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, 35);

    // Separator
    doc.setLineWidth(0.5);
    doc.line(10, 40, 200, 40);

    // Finance details
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Finance Report Details:", 10, 50);

    doc.setFontSize(12);
    doc.setTextColor(33, 37, 41);
    doc.text(`Month:`, 20, 60);
    doc.text(`${month}`, 80, 60);

    doc.text(`Revenue:`, 20, 70);
    doc.text(`LKR ${parseFloat(revenue).toFixed(2)}`, 80, 70);

    doc.text(`Expenses:`, 20, 80);
    doc.text(`LKR ${parseFloat(expenses).toFixed(2)}`, 80, 80);

    doc.text(`Profit/Loss:`, 20, 90);
    doc.setTextColor(profitOrLoss >= 0 ? 0 : 255, profitOrLoss >= 0 ? 128 : 0, 0); // Profit = green, Loss = red
    doc.text(`LKR ${profitOrLoss.toFixed(2)}`, 80, 90);

    // Footer signature
    doc.setLineWidth(0.5);
    doc.line(10, 100, 200, 100);

    doc.setFontSize(12);
    doc.setTextColor(33, 37, 41);
    doc.text("Finance Manager Signature:", 20, 120);
    doc.text("____________________________", 20, 130);
    doc.setFontSize(10);
    doc.text("(Finance Manager)", 20, 140);

    // Confidentiality note
    doc.setFontSize(10);
    doc.setTextColor(128);
    doc.text("This report is confidential and intended for Live Art Clothing Pvt Ltd only.", 10, 160);

    // Save the PDF
    doc.save(`Finance_Report_${month.replace(/\s/g, "_")}.pdf`);
  };

  const resetForm = () => {
    setMonth("");
    setRevenue("");
    setExpenses("");
    setProfitOrLoss(0);
    setSuccess("");
    setError("");
  };

  return (
    <div>
      <Header/>
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Card sx={{ background: "linear-gradient(135deg, #e3f2fd, #bbdefb)", boxShadow: 8, borderRadius: 3, padding: 4 }}>
        <CardContent>
          <Typography variant="h4" sx={{ textAlign: "center", mb: 4, fontWeight: "bold", color: "#0d47a1" }}>
            Finance Report - Live Art Clothing Pvt Ltd
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ padding: 3, borderRadius: 2 }}>
            <TextField
              fullWidth
              label="Month"
              placeholder="Enter month (e.g., January 2025)"
              variant="outlined"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
              sx={{ mb: 3, backgroundColor: "#f3f6f9" }}
            />

            <Tooltip title="Enter total revenue for the selected month">
              <TextField
                fullWidth
                type="number"
                label={<Typography><FaMoneyBillWave color="green" /> Revenue (in LKR)</Typography>}
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                required
                inputProps={{ min: "0" }}
                sx={{ mb: 3, backgroundColor: "#f3f6f9" }}
              />
            </Tooltip>

            <Tooltip title="Enter total expenses for the selected month">
              <TextField
                fullWidth
                type="number"
                label={<Typography><FaCoins color="red" /> Expenses (in LKR)</Typography>}
                value={expenses}
                onChange={(e) => setExpenses(e.target.value)}
                required
                inputProps={{ min: "0" }}
                sx={{ mb: 3, backgroundColor: "#f3f6f9" }}
              />
            </Tooltip>

            <TextField
              fullWidth
              label="Profit or Loss (Auto-Calculated)"
              value={`LKR ${profitOrLoss}`}
              InputProps={{ readOnly: true }}
              sx={{ mb: 4, color: profitOrLoss >= 0 ? "success.main" : "error.main", fontWeight: "bold" }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.8,
                background: "linear-gradient(to right, #1976d2, #42a5f5)",
                color: "#fff",
                fontWeight: "bold",
                borderRadius: 2,
                boxShadow: "0 6px 12px rgba(0,0,0,0.3)",
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Submit and Download PDF"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
    <Footer/>
    </div>
  );
}

export default AddReport;
