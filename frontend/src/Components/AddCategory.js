import React, { useState } from "react";
import Nav from "./Nav";
import { useNavigate } from "react-router";
import axios from "axios";

const AddCategory = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
  });

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:4058/category", {
        name: String(inputs.name),
      });
      console.log(response);  // Check the server response here
      alert("New category added successfully!");
      navigate("/Category");
    } catch (error) {
      console.error("Error adding new category:", error.response || error);  // Log the exact error response
      alert("Failed to add new Category. Please try again.");
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
        <h1 style={formStyles.heading}>Add New Product Category</h1>
        <form onSubmit={handleSubmit}>
          <div style={formStyles.inputField}>
            <label htmlFor="name" style={formStyles.label}>
              New Category Name
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
          <button type="submit" style={formStyles.submitButton}>
            Add Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
