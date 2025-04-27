import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Nav from "./Nav";

function UpdateProduct() {
  const [inputs, setInputs] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: 0,
    imageUrl: "",
    createdAt: "",
    updatedAt: "",
    reorderQuantity: 0, // New state for re-order quantity
  });

  const navigate = useNavigate();
  const { id } = useParams(); // Get product id from URL params

  // Fetch the product data when the component mounts
  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const res = await axios.get(`http://localhost:4058/products/${id}`);
        console.log("API Response:", res.data); // Debugging the API response

        // Ensure the createdAt and updatedAt are in the correct format for datetime-local
        setInputs({
          name: res.data.product.name,
          description: res.data.product.description,
          price: res.data.product.price,
          category: res.data.product.category,
          stockQuantity: res.data.product.stockQuantity,
          imageUrl: res.data.product.imageUrl,
          createdAt: res.data.product.createdAt.slice(0, 16), // Convert to 'YYYY-MM-DDTHH:mm'
          updatedAt: res.data.product.updatedAt.slice(0, 16), // Convert to 'YYYY-MM-DDTHH:mm'
          reorderQuantity: 0, // Initially set reorder quantity to 0
        });
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
    fetchHandler();
  }, [id]); // Fetch data when the id changes

  // Calculate the new stock quantity (current stock + re-order quantity)
  const calculateNewStock = () => {
    return inputs.stockQuantity + Number(inputs.reorderQuantity);
  };

  // Send the updated request to the backend
  const sendRequest = async () => {
    const newStock = calculateNewStock(); // Calculate new stock

    await axios
      .put(`http://localhost:4058/products/${id}`, {
        name: inputs.name,
        description: inputs.description,
        price: Number(inputs.price),
        category: inputs.category,
        stockQuantity: newStock, // Send the new stock quantity
        imageUrl: inputs.imageUrl,
        createdAt: new Date(inputs.createdAt).toISOString(), // Ensure correct date format
        updatedAt: new Date(inputs.updatedAt).toISOString(), // Ensure correct date format
      })
      .then(() => {
        // Pass the message to ReStock page
        navigate("/restock", { state: { message: "Product order has been successfully updated!" } });
      })
      .catch((err) => {
        console.error("Error updating product:", err);
      });
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest(); // Call the function to send the update request
  };

  const formStyles = {
    formContainer: {
      width: "80%",
      maxWidth: "500px",
      margin: "0 auto",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "10px",
      backgroundColor: "#f8f9fa",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    },
    heading: {
      textAlign: "center",
      marginBottom: "20px",
      fontSize: "1.5rem",
      color: "#333",
    },
    inputField: {
      marginBottom: "15px",
    },
    label: {
      display: "block",
      fontWeight: "bold",
      marginBottom: "5px",
      color: "black",
    },
    input: {
      width: "100%",
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    },
    submitButton: {
      width: "100%",
      padding: "10px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      fontWeight: "bold",
      cursor: "pointer",
    },
    submitButtonHover: {
      backgroundColor: "#0056b3",
    },
  };

  return (
    <div>
      <Nav />
      <div style={formStyles.formContainer}>
        <h1 style={formStyles.heading}>Update Product</h1>
        <form onSubmit={handleSubmit}>
          <div style={formStyles.inputField}>
            <label style={formStyles.label}>Product Name</label>
            <p>{inputs.name}</p> {/* Show product name here */}
          </div>

          <div style={formStyles.inputField}>
            <label htmlFor="stockQuantity" style={formStyles.label}>
              Current Stock Quantity
            </label>
            <p>{inputs.stockQuantity}</p> {/* Display current stock quantity */}
          </div>

          <div style={formStyles.inputField}>
            <label htmlFor="reorderQuantity" style={formStyles.label}>
              Re-Order Quantity
            </label>
            <input
              type="number"
              name="reorderQuantity"
              id="reorderQuantity"
              onChange={handleChange}
              value={inputs.reorderQuantity}
              style={formStyles.input}
              min="0"
              required
            />
          </div>

          <button
            type="submit"
            style={{
              ...formStyles.submitButton,
              ":hover": formStyles.submitButtonHover,
            }}
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateProduct;
