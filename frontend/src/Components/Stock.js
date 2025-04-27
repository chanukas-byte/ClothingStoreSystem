import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const URL = "http://localhost:4058/products";

const fetchHandler = async () => {
  try {
    const response = await axios.get(URL);
    return response.data?.products || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

const deleteHandler = async (id) => {
  try {
    const res = await axios.delete(`${URL}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

function Stock() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchHandler()
      .then((data) => setProducts(data))
      .finally(() => setLoading(false));
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredProducts = products.filter(
    (product) =>
      (product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filter === "All" ||
        (filter === "In Stock" && product.stockQuantity > 4) ||
        (filter === "Running Low" && product.stockQuantity <= 4))
  );

  const sortedProducts = filteredProducts.sort((a, b) => {
    const aVal = a[sortField] || "";
    const bVal = b[sortField] || "";
    if (sortField === "price" || sortField === "stockQuantity") {
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    }
    return sortOrder === "asc"
      ? aVal.toString().toLowerCase().localeCompare(bVal.toString().toLowerCase())
      : bVal.toString().toLowerCase().localeCompare(aVal.toString().toLowerCase());
  });

  const handleSortChange = (field) => {
    setSortOrder(sortField === field && sortOrder === "asc" ? "desc" : "asc");
    setSortField(field);
  };

  const handleDelete = (id) => {
    setDeletingId(id);
    deleteHandler(id)
      .then(() => {
        setProducts((prev) => prev.filter((product) => product._id !== id));
      })
      .catch(() => {
        alert("Failed to delete the product. Try again.");
      })
      .finally(() => {
        setDeletingId(null);
      });
  };

  const getTotalAvailableItems = () => products.length;
  const getTotalStockQuantity = () =>
    products.reduce((total, product) => total + (product.stockQuantity || 0), 0);
  const getLowStockItemsCount = () =>
    products.filter((product) => (product.stockQuantity || 0) <= 2).length;

  // Add print-specific styles and a professional header for the report
  const printStyles = `
    <style>
      @media print {
        .no-print, .no-print * { display: none !important; }
        .print-header { display: block !important; }
        .print-table th, .print-table td { border: 1px solid #333 !important; text-align: center; }
        .print-table th { background: #e2e2e2; color: #111; font-size: 16px; }
        .print-table td { font-size: 14px; }
        .print-table tr:nth-child(even) { background: #f2f2f2; }
        .print-table { width: 100%; border-collapse: collapse; }
        .print-table th.price-col, .print-table td.price-col { width: 90px !important; }
        .print-table th.category-col, .print-table td.category-col { width: 180px !important; }
        .print-table th.stock-col, .print-table td.stock-col { width: 60px !important; }
        .print-table th.updated-col, .print-table td.updated-col { width: 120px !important; }
        body { font-family: 'Segoe UI', Arial, sans-serif; }
      }
      .print-header { display: none; text-align: center; margin-bottom: 20px; }
      .print-title { font-size: 2rem; font-weight: bold; color: #1a237e; margin-bottom: 18px; }
      .print-date { font-size: 1rem; color: #333; margin-bottom: 10px; }
      .print-table th, .print-table td { padding: 8px 12px; }
    </style>
  `;

  // Function to generate a print-only table with required columns (excluding 'Created At')
  const generatePrintTable = (products) => {
    let table = `<table class='print-table'>`;
    table += `
      <thead>
        <tr>
          <th>Item Name</th>
          <th class='price-col'>Price</th>
          <th class='category-col'>Category</th>
          <th class='stock-col'>Stock Quantity</th>
          <th class='updated-col'>Updated At</th>
        </tr>
      </thead>
      <tbody>
    `;
    if (products.length > 0) {
      products.forEach(product => {
        table += `
          <tr>
            <td>${product.name}</td>
            <td class='price-col'>Rs.${(product.price || 0).toFixed(2)}</td>
            <td class='category-col'>${product.category}</td>
            <td class='stock-col'>${product.stockQuantity}</td>
            <td class='updated-col'>${new Date(product.updatedAt).toLocaleString()}</td>
          </tr>
        `;
      });
    } else {
      table += `<tr><td colspan='5' style='text-align:center;'>No products available 💤</td></tr>`;
    }
    table += `</tbody></table>`;
    return table;
  };

  // Function to generate the report and trigger printing
  const generateReport = () => {
    const now = new Date();
    const formattedDate = now.toLocaleString();
    const printWindow = window.open("", "", "width=900,height=700");
    printWindow.document.write("<html><head><title>Stock Report</title>" + printStyles + "</head><body>");
    printWindow.document.write(`
      <div class='print-header'>
        <div class='print-title'>Live Art Clothings <br>Stock Report</div>
        <div style='height: 10px;'></div>
        <div class='print-date'>Generated on: ${formattedDate}</div>
        <hr style='margin: 10px 0 20px 0; border: none; border-top: 2px solid #1a237e;'>
      </div>
    `);
    printWindow.document.write(generatePrintTable(sortedProducts));
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.document.title = "Stock Report";
    printWindow.print();
  };

  return (
    <div className="container-fluid px-5 py-4" style={{ backgroundColor: "#f4f7fa", minHeight: "100vh" }}>
      <Nav />
      <h1 className="text-center mb-4 display-5 fw-bold text-primary">Product Stock</h1>

      <div className="row mb-5 text-white">
        <div className="col-md-4 mb-3">
          <div
            className="card shadow-lg border-0"
            style={{ backgroundColor: "#e2e2e2", boxShadow: "0 8px 15px rgba(0, 0, 0, 0.2)" }}
          >
            <div className="card-body text-center">
              <h5 className="card-title fw-bold">Available Variations</h5>
              <p className="card-text fs-5">{getTotalAvailableItems()} Items</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div
            className="card shadow-lg border-0"
            style={{ backgroundColor: "#e2e2e2", boxShadow: "0 8px 15px rgba(0, 0, 0, 0.2)" }}
          >
            <div className="card-body text-center">
              <h5 className="card-title fw-bold">Total Stock Quantity</h5>
              <p className="card-text fs-5">{getTotalStockQuantity()}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div
            className="card shadow-lg border-0"
            style={{ backgroundColor: "#e2e2e2", boxShadow: "0 8px 15px rgba(0, 0, 0, 0.2)" }}
          >
            <div className="card-body text-center">
              <h5 className="card-title fw-bold">Low Stock Items</h5>
              <p className="card-text fs-5">{getLowStockItemsCount()} Items</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 d-flex justify-content-center align-items-center">
        <input
          type="text"
          className="form-control w-50 shadow-sm border-primary"
          placeholder="🔍 Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <div className="dropdown ms-3">
          <button
            className="btn btn-outline-primary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {filter}
          </button>
          <ul className="dropdown-menu">
            <li>
              <a className="dropdown-item" onClick={() => setFilter("All")}>
                All
              </a>
            </li>
            <li>
              <a className="dropdown-item" onClick={() => setFilter("In Stock")}>
                In Stock
              </a>
            </li>
            <li>
              <a className="dropdown-item" onClick={() => setFilter("Running Low")}>
                Running Low
              </a>
            </li>
          </ul>
        </div>

        {/* Generate Report Button */}
        <button className="btn btn-outline-success ms-3" onClick={generateReport}>
          Generate Report
        </button>
      </div>

      <div className="table-responsive shadow-sm" id="reportContent">
        {loading ? (
          <div className="text-center text-secondary py-5">Loading products...</div>
        ) : (
          <table className="table table-bordered table-hover table-striped align-middle">
            <thead className="table-dark text-center" style={{ backgroundColor: "#e2e2e2" }}>
              <tr>
                <th onClick={() => handleSortChange("name")} style={{ cursor: "pointer" }}>
                  Item Name {sortField === "name" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                </th>
                <th onClick={() => handleSortChange("price")} style={{ cursor: "pointer" }}>
                  Price {sortField === "price" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                </th>
                <th>Category</th>
                <th onClick={() => handleSortChange("stockQuantity")} style={{ cursor: "pointer" }}>
                  Stock Quantity {sortField === "stockQuantity" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                </th>
                <th>Created At</th>
                <th>Updated At</th>
                <th className="no-print">Status</th>
                <th className="no-print">Action</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {sortedProducts.length > 0 ? (
                sortedProducts.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>Rs.{(product.price || 0).toFixed(2)}</td>
                    <td>{product.category}</td>
                    <td>{product.stockQuantity}</td>
                    <td>{new Date(product.createdAt).toLocaleString()}</td>
                    <td>{new Date(product.updatedAt).toLocaleString()}</td>
                    <td className="no-print">
                      {product.stockQuantity <= 4 ? (
                        <span className="badge bg-warning">Running Low</span>
                      ) : (
                        <span className="badge bg-success">In Stock</span>
                      )}
                    </td>
                    <td className="no-print">
                      <Link to={`/stock/item/${product._id}`} className="btn btn-sm btn-primary">
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9">
                    <div className="text-muted text-center py-3">No products available 💤</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Stock;
