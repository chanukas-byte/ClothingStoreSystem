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
  
  const history = useNavigate();
  const { id } = useParams(); // Get product id from URL params

  // Fetch the product data when the component mounts
  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const res = await axios.get(`http://localhost:8090/products/${id}`);
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
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
    fetchHandler();
  }, [id]); // Fetch data when the id changes

  // Send the updated request to the backend
  const sendRequest = async () => {
    await axios
      .put(`http://localhost:8090/products/${id}`, {
        name: inputs.name,
        description: inputs.description,
        price: Number(inputs.price),
        category: inputs.category,
        stockQuantity: Number(inputs.stockQuantity),
        imageUrl: inputs.imageUrl,
        createdAt: new Date(inputs.createdAt).toISOString(), // Ensure correct date format
        updatedAt: new Date(inputs.updatedAt).toISOString(), // Ensure correct date format
      })
      .then(() => {
        history("/stock"); // Navigate back to the stock page after successful update
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

  return (
    <div>
      <Nav/>
      <h1>Update Product</h1>
      <form onSubmit={handleSubmit}>
        <label>Item Name</label>
        <br />
        <input
          type="text"
          name="name"
          value={inputs.name}
          onChange={handleChange}
          required
        />
        <br />
        <br />
        <label>Item Description</label>
        <br />
        <input
          type="text"
          name="description"
          value={inputs.description}
          onChange={handleChange}
          required
        />
        <br />
        <br />
        <label>Item Price</label>
        <br />
        <input
          type="number"
          name="price"
          value={inputs.price}
          onChange={handleChange}
          required
          min="0"
        />
        <br />
        <br />
        <label>Item Category</label>
        <br />
        <input
          type="text"
          name="category"
          value={inputs.category}
          onChange={handleChange}
          required
        />
        <br />
        <br />
        <label>Item Quantity</label>
        <br />
        <input
          type="number"
          name="stockQuantity"
          value={inputs.stockQuantity}
          onChange={handleChange}
          required
          min="0"
        />
        <br />
        <br />
        <label>Item Image URL</label>
        <br />
        <input
          type="text"
          name="imageUrl"
          value={inputs.imageUrl}
          onChange={handleChange}
        />
        <br />
        <br />
        <label>Item Created Date</label>
        <br />
        <input
          type="datetime-local"
          name="createdAt"
          value={inputs.createdAt}
          onChange={handleChange}
          required
        />
        <br />
        <br />
        <label>Item Updated Date</label>
        <br />
        <input
          type="datetime-local"
          name="updatedAt"
          value={inputs.updatedAt}
          onChange={handleChange}
          required
        />
        <br />
        <br />
        <button type="submit">Update Product</button>
      </form>
    </div>
  );
}

export default UpdateProduct;
