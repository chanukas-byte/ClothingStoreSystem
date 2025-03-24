import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import axios from "axios";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const URL = "http://localhost:8090/products";

// Updated fetchHandler with error handling
const fetchHandler = async () => {
  try {
    const response = await axios.get(URL);
    if (response.data && response.data.products) {
      return response.data.products;  // Return only the products
    }
    return [];  // Return an empty array if no products
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];  // Return an empty array in case of error
  }
};

// Updated deleteHandler
const deleteHandler = async (id) => {
  try {
    await axios.delete(`${URL}/${id}`); // Send DELETE request to the backend
    alert("Product deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    alert("Failed to delete product");
    return false;
  }
};

function Stock() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Fetch products from backend and update the state
  useEffect(() => {
    fetchHandler().then((data) => setProducts(data)); // Fetch products initially
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedProducts = filteredProducts.sort((a, b) => {
    if (sortField === "price" || sortField === "stockQuantity") {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (sortOrder === "asc") {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    } else {
      const aValue = a[sortField].toLowerCase();
      const bValue = b[sortField].toLowerCase();
      if (sortOrder === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    }
  });

  const handleSortChange = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleDelete = async (id) => {
    const success = await deleteHandler(id);
    if (success) {
      // After deleting, re-fetch the updated list of products from the server
      fetchHandler().then((data) => setProducts(data));
    }
  };

  return (
    <div>
      <Nav />
      <h1 className="text-center mt-4 mb-3">Product Stock</h1>
      <div className="d-flex justify-content-center mb-4">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <div className="container-fluid">
        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover" style={{ width: "100%" }}>
            <thead className="bg-dark text-white">
              <tr>
                <th onClick={() => handleSortChange("name")} className="cursor-pointer text-center">
                  Item Name {sortField === "name" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
                <th className="text-center">Description</th>
                <th onClick={() => handleSortChange("price")} className="cursor-pointer text-center">
                  Price {sortField === "price" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
                <th className="text-center">Category</th>
                <th onClick={() => handleSortChange("stockQuantity")} className="cursor-pointer text-center">
                  Stock Quantity {sortField === "stockQuantity" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
                <th className="text-center">Image</th>
                <th className="text-center">Created At</th>
                <th className="text-center">Updated At</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.length > 0 ? (
                sortedProducts.map((product) => (
                  <tr key={product._id}>
                    <td className="text-center">{product.name}</td>
                    <td className="text-center">{product.description}</td>
                    <td className="text-center">${product.price}</td>
                    <td className="text-center">{product.category}</td>
                    <td className="text-center">{product.stockQuantity}</td>
                    <td className="text-center">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} width="50" />
                      ) : (
                        <p>No image</p>
                      )}
                    </td>
                    <td className="text-center">{new Date(product.createdAt).toLocaleString()}</td>
                    <td className="text-center">{new Date(product.updatedAt).toLocaleString()}</td>
                    <td className="text-center">
                      <Link to={`/stock/update/${product._id}`} className="btn btn-secondary btn-sm mx-2">
                        Update
                      </Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(product._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">
                    No products available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Stock;
