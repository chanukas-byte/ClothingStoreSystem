import React, { useState } from "react";
import Nav from "./Nav";
import { useNavigate } from "react-router";
import axios from "axios";

const AddProduct = () => {
  const history = useNavigate();

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (inputs.price < 0 || inputs.stockQuantity < 0) {
      alert("Price and Stock Quantity must be non-negative values");
      return;
    }

    console.log(inputs);
    sendRequest().then(() => history("success"));
  };

  const sendRequest = async () => {
    await axios
      .post("http://Localhost:8010/products", {
        name: String(inputs.name),
        description: String(inputs.description),
        price: Number(inputs.price),
        category: String(inputs.category),
        stockQuantity: Number(inputs.stockQuantity),
        imageUrl: String(inputs.imageUrl),
        createdAt: Date(inputs.createdAt),
        updatedAt: Date(inputs.updatedAt),
      })
      .then((res) => res.data);
  };

  return (
    <div>
      <Nav />
      <h1>Add New Product</h1>
      <div className="container mt-5">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Item Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleChange}
              value={inputs.name}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Item Description
            </label>
            <input
              type="text"
              name="description"
              id="description"
              onChange={handleChange}
              value={inputs.description}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="price" className="form-label">
              Item Price
            </label>
            <input
              type="number"
              name="price"
              id="price"
              onChange={handleChange}
              value={inputs.price}
              className="form-control"
              required
              min="0"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Item Category
            </label>
            <select
              name="category"
              id="category"
              onChange={handleChange}
              value={inputs.category}
              className="form-select"
              required
            >
              <option value="">Select Category</option>
              <option value="GENTS T-SHIRT">GENTS T-SHIRT</option>
              <option value="GENTS SHIRT">GENTS SHIRT</option>
              <option value="GENTS PANTS">GENTS PANTS</option>
              <option value="WOMEN SKIRTS">WOMEN SKIRTS</option>
              <option value="WOMEN PANTS">WOMEN PANTS</option>
              <option value="WOMEN TOPS">WOMEN TOPS</option>
              <option value="WOMEN FROKS">WOMEN FROKS</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="stockQuantity" className="form-label">
              Item Quantity
            </label>
            <input
              type="number"
              name="stockQuantity"
              id="stockQuantity"
              onChange={handleChange}
              value={inputs.stockQuantity}
              className="form-control"
              required
              min="0"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="imageUrl" className="form-label">
              Item Image URL
            </label>
            <input
              type="text"
              name="imageUrl"
              id="imageUrl"
              onChange={handleChange}
              value={inputs.imageUrl}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="createdAt" className="form-label">
              Item Created Date
            </label>
            <input
              type="datetime-local"
              name="createdAt"
              id="createdAt"
              onChange={handleChange}
              value={inputs.createdAt}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="updatedAt" className="form-label">
              Item Updated Date
            </label>
            <input
              type="datetime-local"
              name="updatedAt"
              id="updatedAt"
              onChange={handleChange}
              value={inputs.updatedAt}
              className="form-control"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
