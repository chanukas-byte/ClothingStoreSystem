import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Receipt,
  Refresh,
} from '@mui/icons-material';
import './FinanceDashboard.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const FinanceDashboard = () => {
  const [financialData, setFinancialData] = useState({
    monthlyData: [],
    recentTransactions: [],
    totalRevenue: 0,
    totalExpenses: 0,
    categoryData: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:4058/api/financial-data');
      setFinancialData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching financial data:', error);
      setError('Failed to load financial data. Please try again later.');
      setLoading(false);
    }
  };

  const monthlyTrendOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Monthly Revenue vs Expenses',
        font: { size: 16, weight: 'bold' },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (value) => `$${value.toLocaleString()}` },
      },
    },
  };

  const categoryDistributionOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'right' },
      title: {
        display: true,
        text: 'Expense Distribution by Category',
        font: { size: 16, weight: 'bold' },
      },
    },
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderMetricCard = (title, value, iconElement, color) => (
    <Card className="metric-card" sx={{ bgcolor: color }}>
      <CardContent>
        <Box display="flex" alignItems="center">
          <Box component="span" sx={{ mr: 1 }}>
            {React.cloneElement(iconElement)}
          </Box>
          <Typography variant="h6">{title}</Typography>
        </Box>
        <Typography variant="h4" sx={{ mt: 2 }}>{value}</Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const monthlyChartData = {
    labels: financialData.monthlyData.map((item) => item.month),
    datasets: [
      {
        label: 'Revenue',
        data: financialData.monthlyData.map((item) => item.revenue),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
        fill: true,
      },
      {
        label: 'Expenses',
        data: financialData.monthlyData.map((item) => item.expenses),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const categoryChartData = {
    labels: financialData.categoryData.map((item) => item.category),
    datasets: [
      {
        data: financialData.categoryData.map((item) => item.amount),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" className="dashboard-title">Financial Dashboard</Typography>
        <Box 
          sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', backgroundColor: '#f0f0f0', p: '8px 16px', borderRadius: '4px', '&:hover': { backgroundColor: '#e0e0e0' } }}
          onClick={fetchFinancialData}
        >
          <Refresh sx={{ mr: 1 }} />
          <Typography>Refresh Data</Typography>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          {renderMetricCard(
            "Total Revenue",
            `$${financialData.totalRevenue.toLocaleString()}`,
            <AccountBalance sx={{ fontSize: 28 }} />,
            '#e3f2fd'
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderMetricCard(
            "Total Expenses",
            `$${financialData.totalExpenses.toLocaleString()}`,
            <Receipt sx={{ fontSize: 28 }} />,
            '#fbe9e7'
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderMetricCard(
            "Net Profit",
            `$${(financialData.totalRevenue - financialData.totalExpenses).toLocaleString()}`,
            <TrendingUp sx={{ fontSize: 28 }} />,
            '#e8f5e9'
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderMetricCard(
            "Profit Margin",
            `${((financialData.totalRevenue - financialData.totalExpenses) / (financialData.totalRevenue || 1) * 100).toFixed(1)}%`,
            <TrendingDown sx={{ fontSize: 28 }} />,
            '#fff3e0'
          )}
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper className="chart-container">
            <Typography variant="h6" className="chart-title">Monthly Revenue vs Expenses</Typography>
            {financialData.monthlyData.length > 0 ? (
              <Line data={monthlyChartData} options={monthlyTrendOptions} />
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <Typography>No monthly data available</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper className="chart-container">
            <Typography variant="h6" className="chart-title">Expense Distribution by Category</Typography>
            {financialData.categoryData.length > 0 ? (
              <Doughnut data={categoryChartData} options={categoryDistributionOptions} />
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <Typography>No category data available</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Paper className="transactions-table" sx={{ mt: 3, p: 2 }}>
        <Typography variant="h6" gutterBottom>Recent Transactions</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {financialData.recentTransactions.length > 0 ? (
                financialData.recentTransactions.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell>
                      {typeof transaction.description === 'object' ? JSON.stringify(transaction.description) : transaction.description}
                    </TableCell>
                    <TableCell>
                      {typeof transaction.category === 'object' ? JSON.stringify(transaction.category) : transaction.category}
                    </TableCell>
                    <TableCell align="right" className={transaction.type === 'expense' ? 'negative-amount' : 'positive-amount'}>
                      {transaction.type === 'expense' ? '-' : '+'}${Math.abs(transaction.amount).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No transactions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

export default FinanceDashboard;
