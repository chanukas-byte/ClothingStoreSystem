import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer"; 
import "./AddReport.css";

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
      const response = await axios.post("http://localhost:4058/api/finance/add", reportData, {
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
    <div className="report-container">
      <Header/>
      <Container maxWidth="sm" sx={{ py: 10 }}>
        <Card className="report-card">
          <div className="report-card-header">
            <Typography variant="h4" className="report-card-title">
              Finance Report
            </Typography>
            <Typography variant="subtitle1" className="report-card-subtitle">
              Live Art Clothing Pvt Ltd
            </Typography>
          </div>
          <CardContent className="report-card-content">
            {error && <div className="report-alert report-alert-error">{error}</div>}
            {success && <div className="report-alert report-alert-success">{success}</div>}

            <Box component="form" onSubmit={handleSubmit} className="form-section">
              <Typography variant="h6" className="form-section-title">
                Report Details
              </Typography>
              
              <div className="report-form-group">
                <label className="report-label">
                  <span className="report-icon">📅</span> Month
                </label>
                <div className="month-input-container">
                  <input
                    className="report-input"
                    placeholder="Enter month (e.g., January 2025)"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="report-form-group">
                <label className="report-label">
                  <span className="report-icon revenue-icon"><FaMoneyBillWave /></span> Revenue (in LKR)
                </label>
                <div className="currency-input-container">
                  <input
                    className="report-input currency-input"
                    type="number"
                    value={revenue}
                    onChange={(e) => setRevenue(e.target.value)}
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="report-form-group">
                <label className="report-label">
                  <span className="report-icon expense-icon"><FaCoins /></span> Expenses (in LKR)
                </label>
                <div className="currency-input-container">
                  <input
                    className="report-input currency-input"
                    type="number"
                    value={expenses}
                    onChange={(e) => setExpenses(e.target.value)}
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="profit-loss-display">
                <div className="profit-loss-label">Profit or Loss (Auto-Calculated)</div>
                <div className={`profit-loss-value ${profitOrLoss >= 0 ? 'profit' : 'loss'}`}>
                  LKR {profitOrLoss.toFixed(2)}
                </div>
              </div>

              <Button
                type="submit"
                className="report-button submit-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="report-spinner"></div>
                    Processing...
                  </>
                ) : (
                  "Submit and Download PDF"
                )}
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