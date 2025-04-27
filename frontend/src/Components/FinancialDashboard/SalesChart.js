import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { month: 'Jan', revenue: 40000 },
  { month: 'Feb', revenue: 30000 },
  { month: 'Mar', revenue: 50000 },
  { month: 'Apr', revenue: 60000 },
  { month: 'May', revenue: 70000 },
  { month: 'Jun', revenue: 80000 },
];

const SalesChart = () => (
  <div className="dashboard-chart-container">
    <h3>Sales Over Time</h3>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="revenue" stroke="#4caf50" strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default SalesChart; 