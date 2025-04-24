import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductDetail.css';
import NavB from './NavBar';


const ProductDetail = ({ handleAddToCart }) => {
  const { productId } = useParams(); // Extract productId from the URL
  const [product, setProduct] = useState(null); // To store the product data
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  // Static colors and sizes
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#008000', '#808080', '#FFD700']; // Static colors (black, white, blue, green, gray, gold)
  const sizes = ['S', 'M', 'L', 'XL']; // Static sizes

  useEffect(() => {
    // Fetch product details from the backend
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:4058/products/${productId}`); // Backend call to get product details
        setProduct(response.data.products); // Update state with the fetched product details
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetail(); // Fetch product details when the component mounts or productId changes
  }, [productId]); // Re-run this effect whenever the productId changes

  // If product data is not available yet, show loading
  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavB />

      <div className="product-detail-container">
        {/* Product Image Section */}
        <div className="product-image-section">
          <img 
            src={`http://localhost:4058/${product.imageUrl}`} 
            alt={product.name} 
            className="product-image" 
          />
        </div>

        {/* Product Details Section */}
        <div className="product-details-section">
          <h2>{product.name}</h2>
          <p><strong>Price:</strong> Rs. {product.price}</p>
          <p><strong>Description:</strong> {product.description}</p>

          {/* Color Selection */}
          <div>
            <h3>Select Color:</h3>
            <div className="color-options">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className="color-option"
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
            {selectedColor && <p>Selected Color: {selectedColor}</p>}
          </div>

          {/* Size Selection */}
          <div>
            <h3>Select Size:</h3>
            <select onChange={(e) => setSelectedSize(e.target.value)} value={selectedSize}>
              <option value="">Select Size</option>
              {sizes.map((size, index) => (
                <option key={index} value={size}>{size}</option>
              ))}
            </select>
          </div>

          {/* Add to Cart Button */}
          <div>
            <button
              onClick={() => {
                if (!selectedColor || !selectedSize) {
                  alert('Please select a color and size.');
                } else {
                  handleAddToCart({ ...product, color: selectedColor, size: selectedSize });
                  alert('Product added to cart!');
                }
              }}
            >
              Add to Cart
            </button>
          </div>

          {/* Size Chart */}
          <div>
            <h4>Size Chart</h4>
            <table>
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Chest (inches)</th>
                  <th>Waist (inches)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>S</td>
                  <td>34-36</td>
                  <td>28-30</td>
                </tr>
                <tr>
                  <td>M</td>
                  <td>38-40</td>
                  <td>32-34</td>
                </tr>
                <tr>
                  <td>L</td>
                  <td>42-44</td>
                  <td>36-38</td>
                </tr>
                <tr>
                  <td>XL</td>
                  <td>46-48</td>
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
