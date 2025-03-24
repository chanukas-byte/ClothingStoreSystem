import React, { useState } from "react";
import Nav from "./Nav";
import { useNavigate } from "react-router";
import axios from "axios";

const AddProduct = () => {
  const navigate = useNavigate(); // Corrected 'history' to 'navigate'
  const [inputs, setInputs] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
    imageUrl: "",
    createdAt: "",
    updatedAt: "",
  });

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inputs.price < 0 || inputs.stockQuantity < 0) {
      alert("Price and Stock Quantity must be non-negative values");
      return;
    }

    try {
      await axios.post("http://localhost:8090/products", {
        name: String(inputs.name),
        description: String(inputs.description),
        price: Number(inputs.price),
        category: String(inputs.category),
        stockQuantity: Number(inputs.stockQuantity),
        imageUrl: String(inputs.imageUrl),
        createdAt: new Date(inputs.createdAt),
        updatedAt: new Date(inputs.updatedAt),
      });
      alert("Product added successfully!");
      navigate("/products");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    }
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
        <h1 style={formStyles.heading}>Add New Product</h1>
        <form onSubmit={handleSubmit}>
          <div style={formStyles.inputField}>
            <label htmlFor="name" style={formStyles.label}>
              Product Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleChange}
              value={inputs.name}
              style={formStyles.input}
              required
            />
          </div>

          <div style={formStyles.inputField}>
            <label htmlFor="description" style={formStyles.label}>
              Description
            </label>
            <textarea
              name="description"
              id="description"
              onChange={handleChange}
              value={inputs.description}
              style={formStyles.input}
              rows="3"
              required
            ></textarea>
          </div>

          <div style={formStyles.inputField}>
            <label htmlFor="price" style={formStyles.label}>
              Price
            </label>
            <input
              type="number"
              name="price"
              id="price"
              onChange={handleChange}
              value={inputs.price}
              style={formStyles.input}
              min="0"
              required
            />
          </div>

          <div style={formStyles.inputField}>
            <label htmlFor="category" style={formStyles.label}>
              Category
            </label>
            <select
              name="category"
              id="category"
              onChange={handleChange}
              value={inputs.category}
              style={formStyles.input}
              required
            >
              <option value="">Select Category</option>
              <option value="GENTS T-SHIRT">GENTS T-SHIRT</option>
              <option value="GENTS SHIRT">GENTS SHIRT</option>
              <option value="GENTS PANTS">GENTS PANTS</option>
              <option value="WOMEN SKIRTS">WOMEN SKIRTS</option>
              <option value="WOMEN PANTS">WOMEN PANTS</option>
              <option value="WOMEN TOPS">WOMEN TOPS</option>
              <option value="WOMEN FROCKS">WOMEN FROCKS</option>
            </select>
          </div>

          <div style={formStyles.inputField}>
            <label htmlFor="stockQuantity" style={formStyles.label}>
              Stock Quantity
            </label>
            <input
              type="number"
              name="stockQuantity"
              id="stockQuantity"
              onChange={handleChange}
              value={inputs.stockQuantity}
              style={formStyles.input}
              min="0"
              required
            />
          </div>

          <div style={formStyles.inputField}>
            <label htmlFor="imageUrl" style={formStyles.label}>
              Image URL
            </label>
            <input
              type="text"
              name="imageUrl"
              id="imageUrl"
              onChange={handleChange}
              value={inputs.imageUrl}
              style={formStyles.input}
            />
          </div>

          <div style={formStyles.inputField}>
            <label htmlFor="createdAt" style={formStyles.label}>
              Created Date
            </label>
            <input
              type="datetime-local"
              name="createdAt"
              id="createdAt"
              onChange={handleChange}
              value={inputs.createdAt}
              style={formStyles.input}
              required
            />
          </div>

          <div style={formStyles.inputField}>
            <label htmlFor="updatedAt" style={formStyles.label}>
              Updated Date
            </label>
            <input
              type="datetime-local"
              name="updatedAt"
              id="updatedAt"
              onChange={handleChange}
              value={inputs.updatedAt}
              style={formStyles.input}
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
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
