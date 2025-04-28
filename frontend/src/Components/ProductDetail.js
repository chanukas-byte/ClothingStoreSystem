import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductDetail.css';
import NavBar from './NavBar';
import { FaShoppingCart } from 'react-icons/fa';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4058/products/${productId}`);
        setProduct(response.data.product);
        setLoading(false);
      } catch (err) {
        setError('Failed to load product details. Please try again later.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    // Load cart from localStorage
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, [showCart]);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleSizeSelect = (e) => {
    setSelectedSize(e.target.value);
  };

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      alert('Please select both color and size before adding to cart');
      return;
    }
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = existingCart.findIndex(item => item._id === product._id && item.selectedColor === selectedColor && item.selectedSize === selectedSize);
    if (existingProductIndex >= 0) {
      existingCart[existingProductIndex].quantity += 1;
    } else {
      existingCart.push({
        ...product,
        quantity: 1,
        selectedColor,
        selectedSize
      });
    }
    localStorage.setItem('cart', JSON.stringify(existingCart));
    setCartItems(existingCart);
    alert('Product added to cart!');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <NavBar />
        <div className="loading-message">Loading product details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <NavBar />
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="not-found-container">
        <NavBar />
        <div className="not-found-message">Product not found</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <NavBar />
      {/* Cart Icon at top right */}
      <div style={{ position: 'fixed', top: 20, right: 30, zIndex: 2000 }}>
        <FaShoppingCart size={32} style={{ cursor: 'pointer' }} onClick={() => setShowCart(true)} />
        {cartItems.length > 0 && (
          <span style={{ position: 'absolute', top: -8, right: -8, background: 'red', color: 'white', borderRadius: '50%', padding: '2px 7px', fontSize: 12 }}>{cartItems.length}</span>
        )}
      </div>
      {/* Cart Popup */}
      {showCart && (
        <div style={{ position: 'fixed', top: 60, right: 30, width: 350, background: '#fff', boxShadow: '0 2px 16px rgba(0,0,0,0.2)', borderRadius: 8, zIndex: 3000, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h3 style={{ margin: 0 }}>Cart</h3>
            <button onClick={() => setShowCart(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>&times;</button>
          </div>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, maxHeight: 300, overflowY: 'auto' }}>
              {cartItems.map((item, idx) => (
                <li key={item._id + item.selectedColor + item.selectedSize + idx} style={{ borderBottom: '1px solid #eee', marginBottom: 8, paddingBottom: 8 }}>
                  <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                  <div>Color: {item.selectedColor} | Size: {item.selectedSize}</div>
                  <div>Qty: {item.quantity}</div>
                  <div>Price: Rs. {item.price * item.quantity}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <div className="product-detail-container">
        <div className="product-image-section">
          <img 
            src={product.imageUrl ? `http://localhost:4058/${product.imageUrl}` : '/default-image.png'}
            alt={product.name}
            className="product-image"
          />
        </div>
        
        <div className="product-details-section">
          <h2>{product.name}</h2>
          <p className="product-price">Rs. {product.price}</p>
          <p className="product-description">{product.description}</p>
          <p className="product-category">Category: {product.category}</p>
          <p className="product-stock">In Stock: {product.stockQuantity}</p>
          <p className="product-sku">SKU: {product._id}</p>
          
          <div className="color-selection">
            <h3>Select Color</h3>
            <div className="color-options">
              {['Red', 'Blue', 'Black'].map((color) => (
                <div
                  key={color}
                  className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color.toLowerCase(), border: selectedColor === color ? '2px solid #000' : '2px solid transparent' }}
                  onClick={() => setSelectedColor(color)}
                  title={color}
                />
              ))}
            </div>
            {selectedColor && (
              <p className="selected-color">Selected: {selectedColor}</p>
            )}
          </div>
          
          <div className="size-selection">
            <h3>Select Size</h3>
            <select 
              className="size-select"
              value={selectedSize}
              onChange={e => setSelectedSize(e.target.value)}
            >
              <option value="">Choose a size</option>
              {['S', 'M', 'L'].map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          
          <button 
            className="add-to-cart-btn"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
          
          <div className="size-chart">
            <h3>Size Chart</h3>
            <table>
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Chest (inches)</th>
                  <th>Waist (inches)</th>
                  <th>Hip (inches)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>S</td>
                  <td>36-38</td>
                  <td>28-30</td>
                  <td>36-38</td>
                </tr>
                <tr>
                  <td>M</td>
                  <td>38-40</td>
                  <td>30-32</td>
                  <td>38-40</td>
                </tr>
                <tr>
                  <td>L</td>
                  <td>40-42</td>
                  <td>32-34</td>
                  <td>40-42</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
