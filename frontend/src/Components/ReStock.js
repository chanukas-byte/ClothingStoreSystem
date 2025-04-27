import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Nav from "./Nav";

// Helper to get and set localStorage for persistence
const RESTOCK_LIST_KEY = "restockList";

function getInitialRestockList() {
  const stored = localStorage.getItem(RESTOCK_LIST_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveRestockList(list) {
  localStorage.setItem(RESTOCK_LIST_KEY, JSON.stringify(list));
}

function ReStock() {
  const location = useLocation();
  const { message, orderDetails } = location.state || {};
  const [restockList, setRestockList] = useState(getInitialRestockList());
  const [stockUpdated, setStockUpdated] = useState(false);

  // Add new item from PlaceOrder if present and not already in the list
  useEffect(() => {
    if (orderDetails && orderDetails.id) {
      setRestockList((prevList) => {
        const exists = prevList.some(item => item.id === orderDetails.id);
        if (!exists) {
          const newItem = {
            ...orderDetails,
            restockQuantity: orderDetails.reorderQuantity || 0,
            totalStock: (orderDetails.currentStock || 0) + (orderDetails.reorderQuantity || 0),
          };
          const updatedList = [...prevList, newItem];
          saveRestockList(updatedList);
          return updatedList;
        }
        return prevList;
      });
    }
    // eslint-disable-next-line
  }, [orderDetails]);

  // Save to localStorage whenever restockList changes
  useEffect(() => {
    saveRestockList(restockList);
  }, [restockList]);

  // Handle restock quantity change for an item
  const handleRestockChange = (id, value) => {
    setRestockList((prevList) =>
      prevList.map(item =>
        item.id === id
          ? {
              ...item,
              restockQuantity: Math.max(0, Number(value)),
              totalStock: Number(item.currentStock) + Math.max(0, Number(value)),
            }
          : item
      )
    );
  };

  // Handle + and - buttons
  const handleRestockDelta = (id, delta) => {
    setRestockList((prevList) =>
      prevList.map(item =>
        item.id === id
          ? {
              ...item,
              restockQuantity: Math.max(0, Number(item.restockQuantity) + delta),
              totalStock: Number(item.currentStock) + Math.max(0, Number(item.restockQuantity) + delta),
            }
          : item
      )
    );
  };

  // Handle "Received" for an item
  const handleReceived = async (id) => {
    const item = restockList.find(i => i.id === id);
    if (!item) return;
    try {
      await axios.put(`http://localhost:4058/products/${id}`, {
        stockQuantity: item.totalStock,
      });
      setStockUpdated(true);
      // Remove item from list after update
      const updatedList = restockList.filter(i => i.id !== id);
      setRestockList(updatedList);
      saveRestockList(updatedList);
      alert(`Stock for ${item.name} updated successfully!`);
    } catch (error) {
      console.error("Error updating stock:", error);
      alert("Error updating stock!");
    }
  };

  return (
    <div>
      <Nav />
      <h1 className="text-center mb-4 display-5 fw-bold text-primary">
        Re-stock Status
      </h1>

      {restockList.length === 0 && <p>No items to restock.</p>}

      {restockList.map((item) => (
        <div
          key={item.id}
          style={{
            marginTop: "20px",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            background: "#f9f9f9",
          }}
        >
          <h3>Order Details:</h3>
          <p>Product Name: {item.name}</p>
          <p>Current Stock Quantity: {item.currentStock}</p>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <label style={{ marginRight: '10px' }}>Re-Stock Quantity:</label>
            <button onClick={() => handleRestockDelta(item.id, -1)} style={{ width: 30, height: 30, fontSize: 18 }}>-</button>
            <input
              type="number"
              min="0"
              value={item.restockQuantity}
              onChange={e => handleRestockChange(item.id, e.target.value)}
              style={{ width: 60, margin: '0 10px', textAlign: 'center' }}
            />
            <button onClick={() => handleRestockDelta(item.id, 1)} style={{ width: 30, height: 30, fontSize: 18 }}>+</button>
          </div>
          <p>Total Stock Quantity: {item.totalStock}</p>
          <button
            onClick={() => handleReceived(item.id)}
            style={{
              padding: "10px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Received
          </button>
        </div>
      ))}

      {stockUpdated && <p>Stock quantity has been updated!</p>}
    </div>
  );
}

export default ReStock;
