import React from 'react';

const products = [
  { name: 'Classic Shirt', sales: 1200 },
  { name: 'Denim Jeans', sales: 950 },
  { name: 'Summer Dress', sales: 800 },
  { name: 'Leather Belt', sales: 600 },
];

const TopProducts = () => (
  <div className="dashboard-top-products">
    <h3>Top Products</h3>
    <ul>
      {products.map((product, idx) => (
        <li key={idx}>
          <span>{product.name}</span>
          <span>{product.sales} sold</span>
        </li>
      ))}
    </ul>
  </div>
);

export default TopProducts; 