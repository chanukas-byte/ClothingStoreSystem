import React from 'react';

const cards = [
  { label: 'Revenue', value: 'Rs. 120,000', color: '#4caf50' },
  { label: 'Expenses', value: 'Rs. 45,000', color: '#f44336' },
  { label: 'Profit', value: 'Rs. 75,000', color: '#2196f3' },
  { label: 'Avg Order Value', value: 'Rs. 2,400', color: '#ff9800' },
];

const SummaryCards = () => (
  <div className="dashboard-cards-row">
    {cards.map((card, idx) => (
      <div className="dashboard-card" style={{ borderColor: card.color }} key={idx}>
        <div className="dashboard-card-label">{card.label}</div>
        <div className="dashboard-card-value">{card.value}</div>
      </div>
    ))}
  </div>
);

export default SummaryCards; 