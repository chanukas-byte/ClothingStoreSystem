import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import axios from "axios";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const URL = "http://localhost:8090/products";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function Stock() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchHandler().then((data) => setProducts(data.products));
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
        {/* Added table-responsive class for responsiveness */}
        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover">
            <thead className="bg-dark text-white">
              <tr>
                <th onClick={() => handleSortChange("name")} className="cursor-pointer">
                  Item Name {sortField === "name" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
                <th>Description</th>
                <th onClick={() => handleSortChange("price")} className="cursor-pointer">
                  Price {sortField === "price" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
                <th>Category</th>
                <th onClick={() => handleSortChange("stockQuantity")} className="cursor-pointer">
                  Stock Quantity {sortField === "stockQuantity" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
                <th>Image</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.length > 0 ? (
                sortedProducts.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>${product.price}</td>
                    <td>{product.category}</td>
                    <td>{product.stockQuantity}</td>
                    <td>
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} width="50" />
                      ) : (
                        <p>No image</p>
                      )}
                    </td>
                    <td>{new Date(product.createdAt).toLocaleString()}</td>
                    <td>{new Date(product.updatedAt).toLocaleString()}</td>
                    <td>
                      <Link to={`/stock/update/${product._id}`} className="btn btn-secondary btn-sm mx-2">
                        Update
                      </Link>
                      <button className="btn btn-danger btn-sm" onClick={() => {/* Add delete functionality */}}>
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
