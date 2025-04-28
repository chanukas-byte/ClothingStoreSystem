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
    stockQuantity: "",
    imageUrl: "",
    createdAt: "",
    updatedAt: "",
  });
  
  const [imagePreview, setImagePreview] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const history = useNavigate();
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
        });
        setImagePreview(res.data.product.imageUrl ? `http://localhost:4058/${res.data.product.imageUrl}` : "");
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
    fetchHandler();
  }, [id]); // Fetch data when the id changes

  // Handle image file selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Send the updated request to the backend
  const sendRequest = async () => {
    try {
      const formData = new FormData();
      formData.append('name', inputs.name);
      formData.append('description', inputs.description);
      formData.append('price', inputs.price);
      formData.append('category', inputs.category);
      formData.append('stockQuantity', inputs.stockQuantity);
      formData.append('createdAt', new Date(inputs.createdAt).toISOString());
      formData.append('updatedAt', new Date(inputs.updatedAt).toISOString());
      if (selectedImage) {
        formData.append('image', selectedImage);
      }
      await axios.put(`http://localhost:4058/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      history("/stock");
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "imageUrl") {
      setImagePreview(value);
    }
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
      fontWeight: "bold",
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
      fontWeight: "bold",
    },
    submitButton: {
      width: "100%",
      padding: "10px",
      backgroundColor: "#000000",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    submitButtonHover: {
      backgroundColor: "#333333",
      boxShadow: "0 0 15px rgba(255, 255, 255, 0.7)",
      transform: "scale(1.02)",
    },
    imagePreview: {
      width: "100%",
      height: "200px",
      objectFit: "cover",
      borderRadius: "5px",
      marginBottom: "10px",
      border: "1px solid #ccc",
    },
    imagePreviewContainer: {
      marginBottom: "15px",
    },
  };

  return (
    <div>
      <Nav />
      <div style={formStyles.formContainer}>
        <h1 style={formStyles.heading}>Update Product</h1>
        <form onSubmit={handleSubmit}>
          <div style={formStyles.imagePreviewContainer}>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Product Preview"
                style={formStyles.imagePreview}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-image.jpg';
                }}
              />
            )}
          </div>

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
              onKeyPress={(e) => {
                if (!/[A-Za-z\s]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              onPaste={(e) => {
                const paste = (e.clipboardData || window.clipboardData).getData('text');
                if (/[^A-Za-z\s]/.test(paste)) {
                  e.preventDefault();
                }
              }}
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
              Price Rs.
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
            <label htmlFor="image" style={formStyles.label}>
              Product Image
            </label>
            <input
              type="file"
              name="image"
              id="image"
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>

          <button
            type="submit"
            style={{
              ...formStyles.submitButton,
              ":hover": formStyles.submitButtonHover,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#333333";
              e.currentTarget.style.boxShadow = "0 0 15px rgba(255, 255, 255, 0.7)";
              e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#000000";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateProduct;
