import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from './Nav';
import 'bootstrap/dist/css/bootstrap.min.css';

const URL = "http://localhost:4058/products";

function Item() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('Fetching product with ID:', id);
        const response = await axios.get(`${URL}/${id}`);
        console.log('API Response:', response.data);
        
        if (response.data) {
          setProduct(response.data);
        } else {
          setError('No product data received');
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError(error.response?.data?.message || 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    } else {
      setError('No product ID provided');
      setLoading(false);
    }
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setDeleting(true);
      try {
        await axios.delete(`${URL}/${id}`);
        navigate('/stock');
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete the product");
      } finally {
        setDeleting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="container-fluid px-5 py-4">
        <Nav />
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid px-5 py-4">
        <Nav />
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p>{error}</p>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => navigate('/stock')}
          >
            Return to Stock
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-fluid px-5 py-4">
        <Nav />
        <div className="alert alert-warning" role="alert">
          <h4 className="alert-heading">Product Not Found</h4>
          <p>The requested product could not be found.</p>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => navigate('/stock')}
          >
            Return to Stock
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-5 py-4" style={{ backgroundColor: "#f4f7fa", minHeight: "100vh" }}>
      <Nav />
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">{product.name}</h2>
              
              <div className="row mb-4">
                <div className="col-md-6">
                  <img
                    src={product.imageUrl || "https://via.placeholder.com/400x400.png?text=No+Image"}
                    alt={product.name}
                    className="img-fluid rounded"
                    style={{ maxHeight: "400px", objectFit: "contain" }}
                  />
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <h5>Price</h5>
                    <p className="fs-4">LKR. {(product.price || 0).toFixed(2)}</p>
                  </div>
                  <div className="mb-3">
                    <h5>Category</h5>
                    <p>{product.category}</p>
                  </div>
                  <div className="mb-3">
                    <h5>Stock Quantity</h5>
                    <p className={product.stockQuantity <= 2 ? "text-danger" : ""}>
                      {product.stockQuantity} units
                    </p>
                  </div>
                  <div className="mb-3">
                    <h5>Description</h5>
                    <p>{product.description}</p>
                  </div>
                  <div className="mb-3">
                    <h5>Created At</h5>
                    <p>{new Date(product.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="mb-3">
                    <h5>Updated At</h5>
                    <p>{new Date(product.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-center gap-3">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/stock/update/${id}`)}
                >
                  Update
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => navigate(`/place-order/${id}`)}
                >
                  Order Stock
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Item;
