import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from "jspdf"; // Import jsPDF
import NavB from './NavBar';

const Payment = () => {
  const [totalAmount, setTotalAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [slipUpload, setSlipUpload] = useState(null);
  const [isValid, setIsValid] = useState(true);

  const navigate = useNavigate();

  // Handle amount input
  const handleAmountChange = (e) => {
    setTotalAmount(e.target.value);
  };

  // Handle payment method change
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  // Handle file upload for online slip
  const handleSlipUpload = (e) => {
    setSlipUpload(e.target.files[0]);
  };

  // Handle Confirm button click
  const handleConfirm = () => {
    // Simple validation: Ensure total amount is a number
    if (!totalAmount || isNaN(totalAmount) || totalAmount <= 0) {
      setIsValid(false);
      return;
    }

    // Create PDF after validation
    const doc = new jsPDF();

    // Add Letterhead
    doc.setFontSize(20);
    doc.text("Live Art Clothing (Pvt) Limited", 20, 30);

    // Add Date and Time
    const date = new Date();
    const formattedDate = date.toLocaleString();
    doc.setFontSize(12);
    doc.text(`Date: ${formattedDate}`, 20, 50); // Corrected this line with backticks

    // Add Payment Details
    doc.text(`Total Amount: Rs. ${totalAmount}`, 20, 70); // Corrected this line with backticks
    doc.text(`Payment Method: ${paymentMethod}`, 20, 80); // Corrected this line with backticks
    if (paymentMethod === 'Online Slip') {
      doc.text(`Slip Uploaded: ${slipUpload ? slipUpload.name : 'No Slip Uploaded'}`, 20, 90); // Corrected this line with backticks
    }

    // Add Signature
    doc.text("Finance Manager: ____________________", 20, 110);

    // Save the PDF
    doc.save('payment_receipt.pdf');
  };

  // Handle Cancel button click
  const handleCancel = () => {
    navigate(-1); // Navigate back to the previous page (Checkout page)
  };

  return (
    <div>
      <NavB />
    <div>
      <h2>Payment</h2>

      <div>
        <label>Total Amount (Rs.): </label>
        <input
          type="number"
          value={totalAmount}
          onChange={handleAmountChange}
          placeholder="Enter Total Amount"
        />
      </div>

      <div>
        <label>Payment Method: </label>
        <div>
          <input
            type="radio"
            id="card"
            name="paymentMethod"
            value="Card"
            checked={paymentMethod === 'Card'}
            onChange={handlePaymentMethodChange}
          />
          <label htmlFor="card">Card</label>
        </div>
        <div>
          <input
            type="radio"
            id="onlineSlip"
            name="paymentMethod"
            value="Online Slip"
            checked={paymentMethod === 'Online Slip'}
            onChange={handlePaymentMethodChange}
          />
          <label htmlFor="onlineSlip">Online Slip Upload</label>
        </div>
      </div>

      {paymentMethod === 'Online Slip' && (
        <div>
          <label>Upload Payment Slip: </label>
          <input
            type="file"
            onChange={handleSlipUpload}
          />
        </div>
      )}

      {!isValid && <p style={{ color: 'red' }}>Please enter a valid amount.</p>}

      <button onClick={handleConfirm}>Confirm</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>

    </div>
  );
};

export default Payment;