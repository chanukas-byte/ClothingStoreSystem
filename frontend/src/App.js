import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';

// Import Components for Product and Admin Management

import ProductDetail from './Components/ProductDetail';
import ProductList from './Components/ProductList';
import Checkout from './Components/Checkout';
import Payment from './Components/Payment';

// Admin Components
import AddEmployee from "./Components/AddEmployee";
import AllEmployees from "./Components/AllEmployee";
import UpdateEmployee from "./Components/UpdateEmployee";
import ViewEmployee from "./Components/ViewEmployee";
import AddReport from "./Components/AddReport";
import AllReport from "./Components/AllReport";
import ReportDetails from "./Components/Reportdetails";
import AssignSalary from "./Components/AssignSalary";
import ViewSalary from "./Components/ViewSalary";
import HomeS from "./Components/HomeS";
import Stock from "./Components/Stock";
import Supplier from "./Components/Suppliers";
import Notify from "./Components/Notification";
import SupplierRegi from "./Components/SupplierRegi";
import Success from "./Components/Success";
import UpdateProduct from "./Components/UpdateProduct";
import addProduct from  "./Components/AddProduct";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import AddProduct from './Components/AddProduct';
import { FaHome } from 'react-icons/fa';
import Home from './Components/Home';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [checkoutProducts, setCheckoutProducts] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:7050/product/search', { params: filters });
      setProducts(response.data);
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

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Main Navbar */}
        <header style={{ padding: '1rem', background: '#000', color: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Live Art</div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <nav>
                <ul style={{ display: 'flex', listStyle: 'none', gap: '30px' }}>
                  <li><Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link></li>
                  
                  <li><Link to="/checkout" style={{ color: '#fff', textDecoration: 'none' }}>Checkout</Link></li>
                  {/* Admin Navbar Links */}
                  <li><Link to="/admin" style={{ color: '#fff', textDecoration: 'none' }}>Admin</Link></li>
                </ul>
              </nav>
              {/* Search Bar */}
              <input
                type="text"
                placeholder="Search products..."
                value={filters.name}
                onChange={handleFilterChange}
                name="name"
                style={{
                  padding: '12px',
                  marginLeft: '30px',
                  borderRadius: '5px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  width: '250px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ padding: '2rem' }}>
          <Routes>
            {/* Product Routes */}
            <Route path="/" element={<ProductList products={products} handleAddToCart={handleAddToCart} handleAddToCheckout={handleAddToCheckout} />} />
            <Route path="/product/:productId" element={<ProductDetail handleAddToCart={handleAddToCart} />} />
            <Route path="/checkout" element={<Checkout checkoutProducts={checkoutProducts} handleRemoveFromCart={handleRemoveFromCart} />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/AddProduct" element={<AddProduct/>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<Home />} />
              {/* Employee Management Routes */}
          <Route path="/add-employee" element={<AddEmployee />} />
          <Route path="/all-employees" element={<AllEmployees />} />
          <Route path="/update-employee/:id" element={<UpdateEmployee />} />
          <Route path="/view-employee/:id" element={<ViewEmployee />} />

          {/* Report Management Routes */}
          <Route path="/add-report" element={<AddReport />} />
          <Route path="/all-reports" element={<AllReport />} />
          <Route path="/view-report/:id" element={<ReportDetails />} />

          {/* Salary Management Routes */}
          <Route path="/assign-salary" element={<AssignSalary />} />
          <Route path="/view-salary" element={<ViewSalary />} />

          {/*Inventory Manager Routes*/}
          <Route path="/inventory-management-Home" element={<HomeS />} />
          <Route path="/stock" element={<Stock />}/>
          <Route path="/supplier" element={<Supplier />}/>
          <Route path="/notify" element={<Notify />}/>
          <Route path="/supplier-register" element={<SupplierRegi />} />
          <Route path="/addproduct" element={<AddProduct />}/>
          <Route path="/success" element={<Success />}/>
          <Route path="/stock/update/:id" element={<UpdateProduct />}/>

          {/* 404 Page Route */}
         
          </Routes>
        </main>

        {/* Footer */}
        <footer style={{ background: '#000', color: '#fff', textAlign: 'center', padding: '1rem' }}>
          <p>&copy; {new Date().getFullYear()} Live Art. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
