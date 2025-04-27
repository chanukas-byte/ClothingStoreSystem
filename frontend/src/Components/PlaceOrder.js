import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Nav from "./Nav";
import "bootstrap/dist/css/bootstrap.min.css";

function PlaceOrder() {
  const [inputs, setInputs] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: 0,
    imageUrl: "",
    createdAt: "",
    updatedAt: "",
    reorderQuantity: 0,
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const res = await axios.get(`http://localhost:4058/products/${id}`);
        console.log("API Response:", res.data);

        setInputs({
          name: res.data.product.name,
          description: res.data.product.description,
          price: res.data.product.price,
          category: res.data.product.category,
          stockQuantity: res.data.product.stockQuantity,
          imageUrl: res.data.product.imageUrl,
          createdAt: res.data.product.createdAt.slice(0, 16),
          updatedAt: res.data.product.updatedAt.slice(0, 16),
          reorderQuantity: 0,
        });
      } catch (error) {
        console.error("Error fetching product data:", error);
        alert("Failed to load product details");
      }
    };
    fetchHandler();
  }, [id]);

  const sendRequest = async () => {
    try {
      await axios.put(`http://localhost:4058/products/${id}`, {
        name: inputs.name,
        description: inputs.description,
        price: Number(inputs.price),
        category: inputs.category,
        stockQuantity: inputs.stockQuantity,
        imageUrl: inputs.imageUrl,
        createdAt: new Date(inputs.createdAt).toISOString(),
        updatedAt: new Date(inputs.updatedAt).toISOString(),
      });

      navigate("/restock", {
        state: {
          message: "Product order has been successfully updated!",
          orderDetails: {
            name: inputs.name,
            reorderQuantity: inputs.reorderQuantity,
            currentStock: inputs.stockQuantity,
            id: id,
          },
        },
      });
    } catch (err) {
      console.error("Error updating product:", err);
      alert("Failed to place order. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputs.reorderQuantity <= 0) {
      alert("Please enter a valid reorder quantity");
      return;
    }
    sendRequest();
  };

  return (
    <div className="container-fluid px-5 py-4" style={{ backgroundColor: "#f4f7fa", minHeight: "100vh" }}>
      <Nav />
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Place Order</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <h5>Product Details</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Product Name</label>
                        <p className="form-control-plaintext">{inputs.name}</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Current Stock</label>
                        <p className="form-control-plaintext">{inputs.stockQuantity} units</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="form-group">
                    <label className="form-label">Re-Order Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      name="reorderQuantity"
                      onChange={handleChange}
                      value={inputs.reorderQuantity}
                      min="1"
                      required
                      placeholder="Enter quantity to order"
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-center gap-3">
                  <button type="submit" className="btn btn-primary">
                    Place Order
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrder;
