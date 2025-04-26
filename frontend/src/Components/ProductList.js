import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import './ProductList.css';
import NavB from './NavBar';
import Checkout from './Checkout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faShoppingCart, faSearch } from '@fortawesome/free-solid-svg-icons';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [checkoutProducts, setCheckoutProducts] = useState([]); 
    const [filters, setFilters] = useState({
        name: '',
        category: '',
        minPrice: '',
        maxPrice: '',
        isActive: true
    });

    const [activeTab, setActiveTab] = useState('home');
    const [activeCategory, setActiveCategory] = useState('all');
    const [noProductsMessage, setNoProductsMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, [filters, activeCategory]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const filterParams = {};
            
            if (filters.name) {
                filterParams.name = filters.name;
            }
            
            if (filters.category) {
                filterParams.category = filters.category;
            }

            if (filters.minPrice) {
                filterParams.minPrice = parseFloat(filters.minPrice);
            }
            if (filters.maxPrice) {
                filterParams.maxPrice = parseFloat(filters.maxPrice);
            }

            filterParams.isActive = filters.isActive;

            const response = await axios.get('http://localhost:4058/products', { 
                params: filterParams
            });
            
            let fetchedProducts = response.data.products || [];

            setProducts(fetchedProducts);

            if (fetchedProducts.length === 0) {
                let message = 'No products available';
                
                const activeFilters = [];
                if (filters.name) activeFilters.push(`matching "${filters.name}"`);
                if (filters.category) {
                    const categoryName = filters.category
                        .replace('GENTS-', '')
                        .replace('WOMENS-', '')
                        .toLowerCase();
                    activeFilters.push(`in ${categoryName}`);
                }
                if (filters.minPrice) activeFilters.push(`above Rs. ${filters.minPrice}`);
                if (filters.maxPrice) activeFilters.push(`below Rs. ${filters.maxPrice}`);
                
                if (activeFilters.length > 0) {
                    message = `No products found ${activeFilters.join(' and ')}`;
                }
                
                setNoProductsMessage(message);
            } else {
                setNoProductsMessage('');
            }

        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Error loading products. Please try again later.');
            setNoProductsMessage('Error loading products. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        setFilters(prev => ({ ...prev, category: '' }));
    };

    const handlePriceFilterChange = (e) => {
        const { name, value } = e.target;
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setFilters(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAddToCart = (product) => {
        const updatedCart = [...cart];
        const existingProduct = updatedCart.find(item => item._id === product._id);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            updatedCart.push({ ...product, quantity: 1 });
        }
        setCart(updatedCart);
    };

    const handleAddToCheckout = (product) => {
        const updatedCheckoutProducts = [...checkoutProducts];
        const existingProduct = updatedCheckoutProducts.find(item => item._id === product._id);
        if (!existingProduct) {
            updatedCheckoutProducts.push(product);
        }
        setCheckoutProducts(updatedCheckoutProducts);
    };

    const handleRemoveFromCart = (productId) => {
        const updatedCart = cart.filter(item => item._id !== productId);
        setCart(updatedCart);
    };

    const handleSendAllToCheckout = () => {
        setCheckoutProducts((prevCheckout) => [...prevCheckout, ...cart]);
        setCart([]);
    };

    const handleViewDetails = (productId) => {
        navigate(`/product/${productId}`);
    };

    return (
        <div className="app-container">
            <NavB />
            
            <div className="main-layout">
                <div className="filters-section animate-fade-in">
                    <div className="nav-menu">
                        <button 
                            className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`}
                            onClick={() => setActiveTab('home')}
                        >
                            <FontAwesomeIcon icon={faSearch} /> Home
                        </button>
                        <button 
                            className={`nav-btn ${activeTab === 'cart' ? 'active' : ''}`}
                            onClick={() => setActiveTab('cart')}
                        >
                            <FontAwesomeIcon icon={faShoppingCart} /> Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)})
                        </button>
                        <button 
                            className="nav-btn"
                            onClick={() => navigate("/Home")}
                        >
                            Admin
                        </button>
                    </div>
                    <input
                        type="text"
                        name="name"
                        value={filters.name}
                        onChange={handleFilterChange}
                        placeholder="Search products..."
                        className="search-input"
                    />
                    <select 
                        name="category" 
                        value={filters.category} 
                        onChange={handleFilterChange}
                        className="category-select"
                    >
                        <option value="">All Categories</option>
                        <option value="GENTS-SHIRTS">Men's Shirts</option>
                        <option value="GENTS-T-SHIRTS">Men's T-Shirts</option>
                        <option value="GENTS-PANTS">Men's Pants</option>
                        <option value="WOMENS-FROCKS">Women's Frocks</option>
                        <option value="WOMENS-TOPS">Women's Tops</option>
                        <option value="WOMENS-PANTS">Women's Pants</option>
                        <option value="WOMENS-SKIRTS">Women's Skirts</option>
                    </select>
                    <div className="price-filters">
                        <input 
                            type="text"
                            name="minPrice" 
                            value={filters.minPrice} 
                            onChange={handlePriceFilterChange} 
                            placeholder="Min Price" 
                            className="price-input"
                        />
                        <input 
                            type="text"
                            name="maxPrice" 
                            value={filters.maxPrice} 
                            onChange={handlePriceFilterChange} 
                            placeholder="Max Price" 
                            className="price-input"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="loading-spinner">
                        <div className="animate-pulse">Loading...</div>
                    </div>
                ) : error ? (
                    <div className="error-message animate-fade-in">
                        {error}
                    </div>
                ) : activeTab === 'cart' ? (
                    <div className="cart-section">
                        <h2 className="section-title">Your Cart</h2>
                        {cart.length === 0 ? (
                            <p className="empty-cart-message animate-fade-in">No items in cart.</p>
                        ) : (
                            <div className="cart-table-container">
                                <table className="cart-table">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Category</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                            <th>Total</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cart.map((item) => (
                                            <tr key={item._id} className="animate-fade-in">
                                                <td>{item.name}</td>
                                                <td>{item.category}</td>
                                                <td>Rs. {item.price}</td>
                                                <td>{item.quantity}</td>
                                                <td>Rs. {item.price * item.quantity}</td>
                                                <td>
                                                    <button
                                                        className="action-btn btn-danger"
                                                        onClick={() => handleRemoveFromCart(item._id)}
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button
                                    className="action-btn btn-primary"
                                    onClick={handleSendAllToCheckout}
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="products-grid">
                        {products.map((product, index) => (
                            <div 
                                key={product._id} 
                                className="product-card"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className="product-image"
                                />
                                <div className="product-info">
                                    <h3 className="product-title">{product.name}</h3>
                                    <p className="product-category">{product.category}</p>
                                    <p className="product-price">Rs. {product.price}</p>
                                    <button
                                        className="action-btn btn-primary"
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                        {noProductsMessage && (
                            <p className="no-products-message animate-fade-in">
                                {noProductsMessage}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductList;
