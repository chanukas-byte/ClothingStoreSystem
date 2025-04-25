import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook

const Checkout = ({ checkoutProducts, handleRemoveFromCart, setCheckoutProducts, setFilters }) => {
  const navigate = useNavigate();  // Initialize navigate hook

  const calculateTotal = () => {
    return checkoutProducts.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Handle "Process to Payment" button click
  const handleProcessPayment = () => {
    // Navigate to the payment page
    navigate('/payment');
  };

  // Clear checkout and reset filters
  const handleClearCheckout = () => {
    setCheckoutProducts([]);  // Clear checkout products
    setFilters({ name: '', category: '', minPrice: '', maxPrice: '' });  // Reset filters
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <h3>Products Added to Checkout:</h3>
      {checkoutProducts.length === 0 ? (
        <p>No items in your checkout.</p>
      ) : (
        <div className="checkout-products-list">
          {checkoutProducts.map((item, index) => (
            <div key={index} className="checkout-product-item">
              <h4>{item.name}</h4>
              <p>Category: {item.category}</p>
              <p>Price: Rs. {item.price}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Total: Rs. {item.price * item.quantity}</p>
              <button className="remove-button" onClick={() => handleRemoveFromCart(item._id)}>Remove</button>
            </div>
          ))}
        </div>
      )}
      <h3>Total: Rs. {calculateTotal()}</h3>

      <button className="process-payment-button" onClick={handleProcessPayment}>
        Process to Payment
      </button>

      <button className="clear-checkout-button" onClick={handleClearCheckout}>
        Clear Checkout
      </button>

      <style jsx>{`
        .checkout-container {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          padding: 20px;
          color: #333;
          width: 80%;
          margin: 0 auto;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h2 {
          text-align: center;
          color: #000;
        }

        h3 {
          color: #333;
          margin-bottom: 10px;
        }

        .checkout-products-list {
          margin-top: 20px;
        }

        .checkout-product-item {
          background-color: #fff;
          padding: 15px;
          margin-bottom: 15px;
          border-radius: 8px;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        }

        .checkout-product-item h4 {
          color: #000;
          font-size: 18px;
        }

        .checkout-product-item p {
          color: #666;
          margin: 5px 0;
        }

        .remove-button {
          background-color: #ff4d4d;
          color: #fff;
          border: none;
          padding: 8px 15px;
          cursor: pointer;
          border-radius: 5px;
          transition: background-color 0.3s;
        }

        .remove-button:hover {
          background-color: #ff1a1a;
        }

        .process-payment-button, .clear-checkout-button {
          background-color: #4CAF50;
          color: #fff;
          border: none;
          padding: 10px 20px;
          cursor: pointer;
          border-radius: 5px;
          font-size: 16px;
          margin-top: 20px;
          display: block;
          width: 100%;
          text-align: center;
        }

        .process-payment-button:hover {
          background-color: #45a049;
        }

        .clear-checkout-button {
          background-color: #f44336;
          margin-top: 10px;
        }

        .clear-checkout-button:hover {
          background-color: #e02f1c;
        }

        .checkout-container p {
          color: #999;
          font-size: 14px;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default Checkout;
