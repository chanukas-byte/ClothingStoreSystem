import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductDetail.css';

const ProductDetail = ({ handleAddToCart }) => {
  const { productId } = useParams(); // Extract productId from the URL
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    // Fetch product details from the backend
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:7050/product/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetail();
  }, [productId]);

  // If product data is not available yet, show loading
  if (!product) {
    return <div>Loading...</div>;
  }

  // Ensure product.colors and product.sizes exist before mapping
  const colors = product.colors || [];
  const sizes = product.sizes || [];

  return (
    <div style={{ padding: '20px' }}>
      <h2>{product.name}</h2>
      <img src={`http://localhost:7050/${product.imageUrl}`} alt={product.name} style={{ width: '200px' }} />
      <p><strong>Price:</strong> Rs. {product.price}</p>
      <p><strong>Description:</strong> {product.description}</p>

      {/* Color Selection */}
      <div>
        <h3>Select Color:</h3>
        <div style={{ display: 'flex' }}>
          {colors.map((color, index) => (
            <div
              key={index}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: color,
                margin: '0 5px',
                cursor: 'pointer',
              }}
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
  );
};

export default ProductDetail;