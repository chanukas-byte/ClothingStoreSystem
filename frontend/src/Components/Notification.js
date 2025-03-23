import React, { useState, useEffect } from 'react';
import Nav from "./Nav";
import axios from 'axios';

function Notification() {
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8010/products');
        const products = response.data.products;

        // Filter products with stock quantity < 3
        const lowStock = products.filter((product) => product.stockQuantity < 3);

        setLowStockProducts(lowStock);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProducts();
  }, []); 

  return (
    <div>
      <Nav />
      <h1 className="mb-4">Our Notification Slide</h1>
      <div className="container mt-4">

        {lowStockProducts.length > 0 ? (
          <div className="alert alert-warning">
            <h2 className="text-center">Low Stock Notifications:</h2>
            <ul className="list-group">
              {lowStockProducts.map((product) => (
                <li key={product._id} className="list-group-item">
                  <strong>{product.name}</strong> in <strong>{product.category}</strong> category running low on stock. <br/>Current 
                  stock is <strong>{product.stockQuantity}</strong>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-success">No products are running low on stock.</p>
        )}
      </div>
    </div>
  );
}

export default Notification;
