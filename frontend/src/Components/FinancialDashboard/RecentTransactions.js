import React from 'react';

const transactions = [
  { id: 'ORD001', customer: 'Alice', amount: 2400, date: '2024-06-01' },
  { id: 'ORD002', customer: 'Bob', amount: 1800, date: '2024-06-02' },
  { id: 'ORD003', customer: 'Charlie', amount: 3200, date: '2024-06-03' },
];

const RecentTransactions = () => (
  <div className="dashboard-recent-transactions">
    <h3>Recent Transactions</h3>
    <table>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Customer</th>
          <th>Amount</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((tx, idx) => (
          <tr key={idx}>
            <td>{tx.id}</td>
            <td>{tx.customer}</td>
            <td>Rs. {tx.amount}</td>
            <td>{tx.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default RecentTransactions; 