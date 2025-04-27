import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ReportChart = ({ report }) => {
  const barChartData = {
    labels: ["Revenue", "Expenses", "Profit/Loss"],
    datasets: [
      {
        label: "Amount (LKR)",
        data: [report.revenue, report.expenses, report.profitOrLoss],
        backgroundColor: ["#4caf50", "#f44336", "#2196f3"], // Green for revenue, Red for expenses, Blue for profit/loss
        borderColor: ["#388e3c", "#d32f2f", "#1976d2"],
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ["Profit", "Loss"],
    datasets: [
      {
        data: [report.profitOrLoss >= 0 ? report.profitOrLoss : 0, report.profitOrLoss < 0 ? Math.abs(report.profitOrLoss) : 0],
        backgroundColor: ["#4caf50", "#f44336"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div>
      <h3 className="text-center mb-4">Financial Overview</h3>
      
      <div className="mb-4">
        <h5>Bar Chart (Revenue, Expenses, Profit/Loss)</h5>
        <Bar data={barChartData} options={{ responsive: true, plugins: { title: { display: true, text: 'Financial Data' } } }} />
      </div>

      <div>
        <h5>Pie Chart (Profit/Loss Breakdown)</h5>
        <Pie data={pieChartData} options={{ responsive: true, plugins: { title: { display: true, text: 'Profit/Loss Distribution' } } }} />
      </div>
    </div>
  );
};

export default ReportChart;
