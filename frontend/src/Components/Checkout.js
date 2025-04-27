import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook
import './global-modern.css';

const Checkout = ({ checkoutProducts, handleRemoveFromCart, setCheckoutProducts, setFilters }) => {
  const navigate = useNavigate();  // Initialize navigate hook

  const calculateTotal = () => {
    return checkoutProducts.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Handle "Process to Payment" button click
  const handleProcessPayment = () => {
    // Navigate to the payment page with the total amount
    navigate('/payment', { state: { totalAmount: calculateTotal() } });
  };

  // Clear checkout and reset filters
  const handleClearCheckout = () => {
    setCheckoutProducts([]);  // Clear checkout products
    setFilters({ name: '', category: '', minPrice: '', maxPrice: '' });  // Reset filters
  };

  return (
    <div className="card-modern checkout-container">
      <h2 className="title-modern">CHECKOUT</h2>
      <h3>Products:</h3>
      {checkoutProducts.length === 0 ? (
        <p className="text-muted-modern">No items in your checkout.</p>
      ) : (
        <div className="checkout-products-list">
          {checkoutProducts.map((item, index) => (
            <div key={index} className="card-modern checkout-product-item">
              <h4>{item.name}</h4>
              <p className="text-muted-modern">Category: {item.category}</p>
              <p className="text-muted-modern">Price: Rs. {item.price}</p>
              <p className="text-muted-modern">Quantity: {item.quantity}</p>
              <p className="text-muted-modern">Total: Rs. {item.price * item.quantity}</p>
              <button className="btn-modern" onClick={() => handleRemoveFromCart(item._id)}>Remove</button>
            </div>
          ))}
        </div>
      )}
      <h3>Total: Rs. {calculateTotal()}</h3>

      <button className="btn-modern" onClick={handleProcessPayment}>
        Process to Payment
      </button>

      <button className="btn-modern" style={{background: 'var(--gray-dark)', color: 'var(--accent)', marginTop: '10px'}} onClick={handleClearCheckout}>
        Clear Checkout
      </button>
    </div>
  );
};

export default Checkout;
