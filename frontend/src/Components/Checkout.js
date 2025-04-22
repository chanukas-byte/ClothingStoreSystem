import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook

const Checkout = ({ checkoutProducts, handleRemoveFromCart }) => {
  const navigate = useNavigate();  // Initialize navigate hook

  const calculateTotal = () => {
    return checkoutProducts.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Handle "Process to Payment" button click
  const handleProcessPayment = () => {
    // Navigate to the payment page
    navigate('/payment');
  };

  return (
    <div>
      <h2>Checkout</h2>
      <h3>Products Added to Checkout:</h3>
      {checkoutProducts.length === 0 ? (
        <p>No items in your checkout.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {checkoutProducts.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>Rs. {item.price}</td>
                <td>{item.quantity}</td>
                <td>Rs. {item.price * item.quantity}</td>
                <td>
                  <button onClick={() => handleRemoveFromCart(item._id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h3>Total: Rs. {calculateTotal()}</h3>

      {/* Process to Payment Button */}
      <button onClick={handleProcessPayment}>
        Process to Payment
      </button>
    </div>
  );
};

export default Checkout;
