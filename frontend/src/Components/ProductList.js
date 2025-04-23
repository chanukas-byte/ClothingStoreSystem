import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // Import Link and useNavigate to handle navigation
import axios from 'axios';
import './ProductList.css';
import NavB from './NavBar';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [checkoutProducts, setCheckoutProducts] = useState([]); // Track products added to checkout
    const [filters, setFilters] = useState({
        name: '',
        category: '',
        minPrice: '',
        maxPrice: '',
    });

    const [activeTab, setActiveTab] = useState('home');
    const [menuOpen, setMenuOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:4058/products', { params: filters });

            // Debug print to understand the structure
            console.log("Fetched response:", response.data);

            // Ensure we're accessing the correct array
            const fetchedProducts = Array.isArray(response.data)
                ? response.data
                : response.data.products || [];

            setProducts(fetchedProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
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

    // Add product to checkout list
    const handleAddToCheckout = (product) => {
        const updatedCheckoutProducts = [...checkoutProducts];
        const existingProduct = updatedCheckoutProducts.find(item => item._id === product._id);

        if (!existingProduct) {
            updatedCheckoutProducts.push(product);  // Add the product to the checkout list
        }

        setCheckoutProducts(updatedCheckoutProducts); // Update the state with the new checkout list
    };

    // Handle removing an item from the cart
    const handleRemoveFromCart = (productId) => {
        const updatedCart = cart.filter(item => item._id !== productId);
        setCart(updatedCart);
    };

    // Send all products from cart to checkout
    const handleSendAllToCheckout = () => {
        setCheckoutProducts((prevCheckout) => [...prevCheckout, ...cart]); // Add all items in the cart to checkout
        setCart([]); // Clear the cart after moving items to checkout
    };

    return (
        <div>
            <NavB />



        <div className="main-container">

        
            
            <aside className={`sidebar ${menuOpen ? 'expanded' : ''}`} onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)}>
                <div className="menu-icon">☰</div>
                {menuOpen && (
                    <div className="menu-content">
                        <button className={`tab-btn ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>Home</button>
                        <button className={`tab-btn ${activeTab === 'cart' ? 'active' : ''}`} onClick={() => setActiveTab('cart')}>
                            Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)})
                        </button>
                        <button onClick={() => navigate("/Home")}> Admin</button>

                        <div className="filters">

                                    <input
                                type="text"
                                name="name"
                                value={filters.name}
                                onChange={handleFilterChange}
                                placeholder="Search products..."
                                style={{ padding: '10px', border: '1px solid #888', borderRadius: '8px' }}
                            />
                            <select name="category" value={filters.category} onChange={handleFilterChange}>
                                <option value="">All Categories</option>
                                <option value="GENTS-SHIRTS">GENTS-SHIRTS</option>
                                <option value="GENTS-T-SHIRTS">GENTS-T-SHIRTS</option>
                                <option value="GENTS-PANTS">GENTS-PANTS</option>
                                <option value="WOMENS-FROCKS">WOMENS-FROCKS</option>
                                <option value="WOMENS-TOPS">WOMENS-TOPS</option>
                                <option value="WOMENS-PANTS">WOMENS-PANTS</option>
                                <option value="WOMENS-SKIRTS">WOMENS-SKIRTS</option>
                            </select>
                            <input type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} placeholder="Min Price" />
                            <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} placeholder="Max Price" />
                        </div>
                    </div>
                )}
            </aside>

            <div className="content-container">
                {activeTab === 'home' && (
                    <>
                        <h2>OUR PRODUCTS</h2>
                        <div className="product-grid">
                            {products.map((product) => (
                                <div className="product-card" key={product._id}>
                                    <img src={`http://localhost:4058/${product.imageUrl}`} alt={product.name} className="product-image" />
                                    <div className="product-info">
                                        <h3>{product.name}</h3>
                                        <p>Rs. {product.price}</p>
                                        <button className="add-to-cart" onClick={() => handleAddToCart(product)}>Add to Cart</button>
                                        <Link to={`/product/${product._id}`}>
                                            <button>View Product</button>
                                        </Link>
                                        {/* "Add to Checkout" Button */}
                                        <button onClick={() => handleAddToCheckout(product)}>
                                            Add to Checkout
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === 'cart' && (
                    <>
                        <h2>Your Cart</h2>
                        {cart.length === 0 ? (
                            <p>No items in cart.</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.name}</td>
                                            <td>{item.category}</td>
                                            <td>Rs. {item.price}</td>
                                            <td>{item.quantity}</td>
                                            <td>Rs. {item.price * item.quantity}</td>
                                            <td>
                                                <button onClick={() => handleRemoveFromCart(item._id)}>Remove</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {/* Send All to Checkout Button */}
                        <button onClick={handleSendAllToCheckout} style={{ marginTop: '10px' }}>
                            Send All to Checkout
                        </button>
                       
                    </>
                )}
            </div>
        </div>
        </div>
    );
};

export default ProductList;