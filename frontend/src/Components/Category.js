import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const URL = "http://localhost:4058/category";

// Fetch categories
const fetchHandler = async () => {
  try {
    const response = await axios.get(URL);
    if (response.data && response.data.categories) {
      return response.data.categories;
    }
    return [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// Delete category
const deleteHandler = async (id) => {
  try {
    const res = await axios.delete(`${URL}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

function Category() {
  const [categories, setCategories] = useState([]);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchHandler().then((data) => setCategories(data));
  }, []);

  const handleDelete = (id) => {
    deleteHandler(id)
      .then(() => {
        setCategories((prev) => prev.filter((cat) => cat._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting category:", error);
      });
  };

  const handleSortChange = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Sort and filter categories
  const sortedCategories = [...categories].sort((a, b) => {
    const valA = a[sortField]?.toLowerCase?.() || "";
    const valB = b[sortField]?.toLowerCase?.() || "";
    return sortOrder === "asc"
      ? valA.localeCompare(valB)
      : valB.localeCompare(valA);
  });

  const filteredCategories = sortedCategories.filter((cat) =>
    cat.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Nav />
      <h1 className="text-center mb-4 display-5 fw-bold text-primary">
        Categories
      </h1>

      <div className="mb-4 d-flex justify-content-center">
        <input
          type="text"
          className="form-control w-50 shadow-sm border-primary"
          placeholder="🔍 Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div style={{
        maxWidth: '900px',
        margin: '40px auto',
        background: '#fff',
        borderRadius: '18px',
        boxShadow: '0 8px 32px rgba(60,60,60,0.12)',
        padding: '32px 24px',
      }}>
        <div className="table-responsive">
          <table className="table table-bordered table-hover" style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: 0 }}>
            <thead style={{ background: 'linear-gradient(90deg, #212529 60%, #343a40 100%)', color: '#fff', fontSize: '1.15rem', fontWeight: 700 }}>
              <tr>
                <th
                  onClick={() => handleSortChange("name")}
                  style={{ cursor: "pointer", textAlign: 'center', letterSpacing: '1px' }}
                  className="align-middle"
                >
                  Category Name {sortField === "name" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
                <th className="align-middle text-center">Type</th>
                <th className="align-middle text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <tr key={category._id} style={{ transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background='#f8f9fa'} onMouseOut={e => e.currentTarget.style.background=''}>
                    <td className="text-center align-middle" style={{ fontSize: '1.05rem', padding: '14px 0' }}>{category.name}</td>
                    <td className="text-center align-middle" style={{ fontSize: '1.05rem', padding: '14px 0' }}>{category.types}</td>
                    <td className="text-center align-middle">
                      <button
                        className="btn btn-danger btn-sm"
                        style={{ borderRadius: '6px', fontWeight: 600, letterSpacing: '0.5px' }}
                        onClick={() => handleDelete(category._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center align-middle" style={{ padding: '24px 0', color: '#888' }}>
                    No categories available
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

export default Category;
