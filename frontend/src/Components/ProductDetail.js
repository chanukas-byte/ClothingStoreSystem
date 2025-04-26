import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faSpinner } from '@fortawesome/free-solid-svg-icons';
import './ProductDetail.css';
import NavBar from './NavBar';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load product details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleSizeSelect = (e) => {
    setSelectedSize(e.target.value);
  };

  const handleAddToCart = async () => {
    if (!selectedColor || !selectedSize) {
      setError('Please select both color and size');
      return;
    }

    try {
      setIsAddingToCart(true);
      // Add to cart logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      // Show success message or redirect
    } catch (err) {
      setError('Failed to add item to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container animate-fade-in">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin" size="2x" />
        <p className="loading-message">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container animate-fade-in">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="not-found-container animate-fade-in">
        <p className="not-found-message">Product not found</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <NavBar />
      <div className="product-detail-container">
        <div className="product-image-section animate-slide-left">
          <img
            src={product.image}
            alt={product.name}
            className="product-image hover-scale"
          />
        </div>
        
        <div className="product-details-section animate-slide-right">
          <h2 className="animate-fade-in">{product.name}</h2>
          <p className="product-price animate-fade-in">${product.price}</p>
          <p className="product-description animate-fade-in">{product.description}</p>
          
          <div className="product-meta animate-fade-in">
            <p className="product-category">Category: {product.category}</p>
            <p className="product-stock">In Stock: {product.stock}</p>
            <p className="product-sku">SKU: {product.sku}</p>
          </div>

          <div className="color-selection animate-fade-in">
            <h3>Select Color</h3>
            <div className="color-options">
              {product.colors.map((color) => (
                <div
                  key={color}
                  className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color)}
                />
              ))}
            </div>
            {selectedColor && (
              <p className="selected-color">Selected: {selectedColor}</p>
            )}
          </div>

          <div className="size-selection animate-fade-in">
            <h3>Select Size</h3>
            <select
              className="size-select"
              value={selectedSize}
              onChange={handleSizeSelect}
            >
              <option value="">Choose a size</option>
              {product.sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <button
            className="add-to-cart-btn hover-lift"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                <span>Adding to Cart...</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faShoppingCart} />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          <div className="size-chart animate-fade-in">
            <h3>Size Chart</h3>
            <table>
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Chest (in)</th>
                  <th>Waist (in)</th>
                  <th>Hip (in)</th>
                </tr>
              </thead>
              <tbody>
                {product.sizeChart.map((row) => (
                  <tr key={row.size}>
                    <td>{row.size}</td>
                    <td>{row.chest}</td>
                    <td>{row.waist}</td>
                    <td>{row.hip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
