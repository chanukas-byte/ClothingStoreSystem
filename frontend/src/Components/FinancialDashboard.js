import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import './FinancialDashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faChartLine, faMoneyBillWave, faShoppingCart, faPercentage } from '@fortawesome/free-solid-svg-icons';

const FinancialDashboard = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [profitLossData, setProfitLossData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [summaryData, setSummaryData] = useState({
    totalRevenue: 0,
    totalProfit: 0,
    totalLoss: 0,
    profitMargin: 0,
    averageOrderValue: 0,
    yearOverYearGrowth: 12.5,
    totalOrders: 1250
  });

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Generate different data based on the selected year
      let sampleData = [];
      
      if (selectedYear === 2024) {
        sampleData = [
          { month: 'Jan', revenue: 1500000, profit: 450000, loss: 150000, orders: 95 },
          { month: 'Feb', revenue: 1800000, profit: 540000, loss: 120000, orders: 110 },
          { month: 'Mar', revenue: 1650000, profit: 480000, loss: 180000, orders: 100 },
          { month: 'Apr', revenue: 2100000, profit: 630000, loss: 210000, orders: 125 },
          { month: 'May', revenue: 1950000, profit: 570000, loss: 150000, orders: 115 },
          { month: 'Jun', revenue: 2250000, profit: 660000, loss: 240000, orders: 135 },
          { month: 'Jul', revenue: 2400000, profit: 720000, loss: 270000, orders: 145 },
          { month: 'Aug', revenue: 2550000, profit: 750000, loss: 300000, orders: 150 },
          { month: 'Sep', revenue: 2700000, profit: 810000, loss: 330000, orders: 160 },
          { month: 'Oct', revenue: 2850000, profit: 840000, loss: 360000, orders: 170 },
          { month: 'Nov', revenue: 3000000, profit: 900000, loss: 390000, orders: 180 },
          { month: 'Dec', revenue: 3300000, profit: 990000, loss: 420000, orders: 190 }
        ];
      } else if (selectedYear === 2023) {
        sampleData = [
          { month: 'Jan', revenue: 1300000, profit: 390000, loss: 130000, orders: 85 },
          { month: 'Feb', revenue: 1500000, profit: 450000, loss: 100000, orders: 95 },
          { month: 'Mar', revenue: 1400000, profit: 400000, loss: 160000, orders: 90 },
          { month: 'Apr', revenue: 1800000, profit: 540000, loss: 180000, orders: 110 },
          { month: 'May', revenue: 1700000, profit: 490000, loss: 130000, orders: 100 },
          { month: 'Jun', revenue: 2000000, profit: 580000, loss: 220000, orders: 120 },
          { month: 'Jul', revenue: 2200000, profit: 650000, loss: 250000, orders: 130 },
          { month: 'Aug', revenue: 2300000, profit: 680000, loss: 270000, orders: 140 },
          { month: 'Sep', revenue: 2500000, profit: 750000, loss: 300000, orders: 150 },
          { month: 'Oct', revenue: 2600000, profit: 780000, loss: 320000, orders: 160 },
          { month: 'Nov', revenue: 2800000, profit: 840000, loss: 350000, orders: 170 },
          { month: 'Dec', revenue: 3100000, profit: 930000, loss: 380000, orders: 180 }
        ];
      } else if (selectedYear === 2022) {
        sampleData = [
          { month: 'Jan', revenue: 1100000, profit: 330000, loss: 110000, orders: 75 },
          { month: 'Feb', revenue: 1300000, profit: 380000, loss: 90000, orders: 85 },
          { month: 'Mar', revenue: 1200000, profit: 350000, loss: 140000, orders: 80 },
          { month: 'Apr', revenue: 1600000, profit: 480000, loss: 160000, orders: 100 },
          { month: 'May', revenue: 1500000, profit: 430000, loss: 120000, orders: 90 },
          { month: 'Jun', revenue: 1800000, profit: 520000, loss: 200000, orders: 110 },
          { month: 'Jul', revenue: 2000000, profit: 590000, loss: 230000, orders: 120 },
          { month: 'Aug', revenue: 2100000, profit: 620000, loss: 250000, orders: 130 },
          { month: 'Sep', revenue: 2300000, profit: 690000, loss: 280000, orders: 140 },
          { month: 'Oct', revenue: 2400000, profit: 720000, loss: 300000, orders: 150 },
          { month: 'Nov', revenue: 2600000, profit: 780000, loss: 330000, orders: 160 },
          { month: 'Dec', revenue: 2900000, profit: 870000, loss: 360000, orders: 170 }
        ];
      }

      // Calculate summary statistics
      const totalRevenue = sampleData.reduce((sum, item) => sum + item.revenue, 0);
      const totalProfit = sampleData.reduce((sum, item) => sum + item.profit, 0);
      const totalLoss = sampleData.reduce((sum, item) => sum + item.loss, 0);
      const profitMargin = ((totalProfit - totalLoss) / totalRevenue) * 100;
      const totalOrders = sampleData.reduce((sum, item) => sum + item.orders, 0);
      const averageOrderValue = totalRevenue / totalOrders;

      // Calculate year-over-year growth based on selected year
      let yearOverYearGrowth = 0;
      if (selectedYear === 2024) {
        yearOverYearGrowth = 12.5; // 12.5% growth from 2023
      } else if (selectedYear === 2023) {
        yearOverYearGrowth = 10.2; // 10.2% growth from 2022
      } else if (selectedYear === 2022) {
        yearOverYearGrowth = 8.7; // 8.7% growth from 2021
      }

      setSummaryData({
        totalRevenue,
        totalProfit,
        totalLoss,
        profitMargin,
        averageOrderValue,
        yearOverYearGrowth,
        totalOrders
      });

      setMonthlyData(sampleData);
      setProfitLossData(sampleData.map(item => ({
        name: item.month,
        profit: item.profit,
        loss: item.loss,
        netProfit: item.profit - item.loss,
        revenue: item.revenue,
        orders: item.orders
      })));

      setLoading(false);
    } catch (err) {
      setError('Failed to fetch financial data. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, [selectedYear]);

  const formatCurrency = (value) => {
    // Format with Rs. prefix and thousands separator
    return `Rs. ${value.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const formatLargeNumber = (value) => {
    // Format with commas for thousands, lakhs, etc. (Indian style)
    return value.toLocaleString('en-IN');
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };

  const COLORS = ['#4CAF50', '#F44336', '#2196F3', '#FFC107'];
  const CHART_COLORS = {
    profit: '#4CAF50',
    loss: '#F44336',
    revenue: '#2196F3',
    orders: '#FFC107'
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading financial data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>{error}</p>
        <button onClick={fetchFinancialData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="financial-dashboard">
      <div className="dashboard-header">
        <h1>Financial Dashboard</h1>
        <div className="year-selector">
          <label htmlFor="year-select">Select Year:</label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            <option value={2024}>2024</option>
            <option value={2023}>2023</option>
            <option value={2022}>2022</option>
          </select>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon">
            <FontAwesomeIcon icon={faMoneyBillWave} />
          </div>
          <div className="card-content">
            <h3>Total Revenue</h3>
            <p className="summary-value">{formatCurrency(summaryData.totalRevenue)}</p>
            <p className="trend positive">
              <FontAwesomeIcon icon={faArrowUp} /> {formatPercentage(summaryData.yearOverYearGrowth)} vs last year
            </p>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon profit">
            <FontAwesomeIcon icon={faChartLine} />
          </div>
          <div className="card-content">
            <h3>Net Profit</h3>
            <p className="summary-value profit">{formatCurrency(summaryData.totalProfit - summaryData.totalLoss)}</p>
            <p className="trend positive">
              <FontAwesomeIcon icon={faArrowUp} /> {formatPercentage(8.3)} vs last month
            </p>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon">
            <FontAwesomeIcon icon={faShoppingCart} />
          </div>
          <div className="card-content">
            <h3>Total Orders</h3>
            <p className="summary-value">{summaryData.totalOrders}</p>
            <p className="trend positive">
              <FontAwesomeIcon icon={faArrowUp} /> {formatPercentage(5.2)} vs last month
            </p>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon">
            <FontAwesomeIcon icon={faPercentage} />
          </div>
          <div className="card-content">
            <h3>Profit Margin</h3>
            <p className="summary-value">{formatPercentage(summaryData.profitMargin)}</p>
            <p className="trend negative">
              <FontAwesomeIcon icon={faArrowDown} /> {formatPercentage(2.1)} vs last month
            </p>
          </div>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h2>Revenue & Profit Trends</h2>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={profitLossData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => formatLargeNumber(value)} />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), '']}
                  labelStyle={{ color: '#333' }}
                />
                <Legend />
                <Area type="monotone" dataKey="revenue" fill="#2196F3" stroke="#2196F3" fillOpacity={0.2} name="Revenue" />
                <Area type="monotone" dataKey="profit" fill="#4CAF50" stroke="#4CAF50" fillOpacity={0.2} name="Profit" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h2>Monthly Profit vs Loss</h2>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitLossData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => formatLargeNumber(value)} />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), '']}
                  labelStyle={{ color: '#333' }}
                />
                <Legend />
                <Bar dataKey="profit" fill={CHART_COLORS.profit} name="Profit" />
                <Bar dataKey="loss" fill={CHART_COLORS.loss} name="Loss" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h2>Monthly Net Profit Distribution</h2>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={profitLossData}
                  dataKey="netProfit"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                >
                  {profitLossData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.netProfit >= 0 ? COLORS[0] : COLORS[1]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), '']}
                  labelStyle={{ color: '#333' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h2>Monthly Orders Distribution</h2>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={profitLossData}
                  dataKey="orders"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {profitLossData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="data-table-container">
        <h2>Monthly Financial Details</h2>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Revenue</th>
                <th>Profit</th>
                <th>Loss</th>
                <th>Net Profit</th>
                <th>Orders</th>
                <th>Profit Margin</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((item) => {
                const netProfit = item.profit - item.loss;
                const monthlyProfitMargin = ((netProfit) / item.revenue) * 100;
                return (
                  <tr key={item.month}>
                    <td>{item.month}</td>
                    <td>{formatCurrency(item.revenue)}</td>
                    <td className="profit">{formatCurrency(item.profit)}</td>
                    <td className="loss">{formatCurrency(item.loss)}</td>
                    <td className={netProfit >= 0 ? 'profit' : 'loss'}>
                      {formatCurrency(netProfit)}
                    </td>
                    <td>{item.orders}</td>
                    <td className={monthlyProfitMargin >= 0 ? 'profit' : 'loss'}>
                      {formatPercentage(monthlyProfitMargin)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;