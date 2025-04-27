import React from 'react';
import SummaryCards from './FinancialDashboard/SummaryCards';
import SalesChart from './FinancialDashboard/SalesChart';
import CategoryPieChart from './FinancialDashboard/CategoryPieChart';
import TopProducts from './FinancialDashboard/TopProducts';
import RecentTransactions from './FinancialDashboard/RecentTransactions';
import './FinancialDashboard/dashboard-modern.css';
import './global-modern.css';

const FinancialDashboard = () => {
  return (
    <div className="dashboard-modern">
      <h1>Financial Dashboard</h1>
      <SummaryCards />
      <div className="dashboard-charts-row">
        <SalesChart />
        <CategoryPieChart />
      </div>
      <TopProducts />
      <RecentTransactions />
    </div>
  );
};

export default FinancialDashboard;