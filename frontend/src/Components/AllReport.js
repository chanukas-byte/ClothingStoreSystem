import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer"; 

import {
  Table,
  Badge,
  Container,
  Spinner,
  Alert,
  InputGroup,
  FormControl,
  Button,
  Dropdown
} from "react-bootstrap";
import axios from "axios";
import { FaArrowUp, FaArrowDown, FaSortUp, FaSortDown, FaEye, FaTrashAlt, FaDownload } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // SweetAlert import
import { jsPDF } from "jspdf"; // jsPDF import

function AllReport() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "month", direction: "asc" });
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 5;

  const navigate = useNavigate();

  // Fetch reports
  const fetchReports = () => {
    setLoading(true);
    setError("");
    axios
      .get("http://localhost:8090/api/finance/")
      .then((response) => {
        setReports(response.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching finance reports:", err);
        setError("Failed to load finance reports. Please check your connection or try again later.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Sorting logic
  const sortedReports = [...reports].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Filter reports
  const filteredReports = sortedReports.filter((report) => {
    const matchesSearch =
      report.month.toLowerCase().includes(search.toLowerCase()) ||
      report.revenue.toString().includes(search) ||
      report.expenses.toString().includes(search);

    const matchesStatus =
      filterStatus === "All" ||
      (filterStatus === "Profit" && report.profitOrLoss > 0) ||
      (filterStatus === "Loss" && report.profitOrLoss < 0);

    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Handle delete operation with SweetAlert
  const handleDelete = (reportId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:8090/api/finance/delete/${reportId}`)
          .then(() => {
            fetchReports();
            Swal.fire("Deleted!", "The report has been deleted.", "success");
          })
          .catch((err) => {
            console.error("Error deleting report:", err);
            Swal.fire("Error!", "Failed to delete the report. Please try again.", "error");
          });
      }
    });
  };

  // Function to generate and download PDF for a specific report
  const handleDownloadPDF = (report) => {
    const doc = new jsPDF();
  
    // Set document font and size
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
  
    // Title with a border box
    doc.setTextColor(0, 0, 255); // Blue color for title
    doc.setFontSize(18);
    doc.text("Live Art Clothing Pvt Ltd - Financial Report", 20, 20);
  
    // Add a top border
    doc.setLineWidth(0.5);
    doc.line(20, 22, 190, 22); // Horizontal line
  
    // Date
    doc.setTextColor(0, 0, 0); // Black color for date
    doc.setFontSize(12);
    doc.text("Generated on: " + new Date().toLocaleString(), 20, 30);
  
    // Add a separator line
    doc.setLineWidth(0.5);
    doc.line(20, 32, 190, 32); // Horizontal line
  
    // Add report details in a structured way with borders
    doc.setTextColor(0, 102, 204); // Dark blue for section title
    doc.text(`Report for ${report.month}`, 20, 40);
    doc.setTextColor(0, 0, 0); // Black color for report content
  
    // Draw a bordered box around the report details
    doc.rect(20, 45, 170, 40); // Rectangle for report content box
  
    // Inside the rectangle, add the report details
    doc.text(`Month: ${report.month}`, 25, 50);
    doc.text(`Revenue: LKR ${report.revenue.toLocaleString()}`, 25, 60);
    doc.text(`Expenses: LKR ${report.expenses.toLocaleString()}`, 25, 70);
    
    // Profit or Loss (colored)
    doc.setTextColor(report.profitOrLoss >= 0 ? 34 : 255, report.profitOrLoss >= 0 ? 139 : 69, report.profitOrLoss >= 0 ? 34 : 0);
    doc.text(
      `Profit/Loss: LKR ${report.profitOrLoss >= 0 ? report.profitOrLoss.toLocaleString() : Math.abs(report.profitOrLoss).toLocaleString()}`,
      25,
      80
    );
  
    // Add a bottom separator line after the content
    doc.setLineWidth(0.5);
    doc.line(20, 90, 190, 90); // Horizontal line
  
    // Signature section with some styling
    doc.setTextColor(0, 0, 0); // Black color for signature section
    doc.text("Signed by: [Store Manager Name]", 20, 100);
    doc.text("____________________", 20, 110); // Signature line
  
    // Footer with company name and copyright notice
    doc.setTextColor(128, 0, 128); // Purple color for footer
    doc.text("Live Art Clothing Pvt Ltd | All rights reserved", 20, 120);
  
    // Save the document with a more structured name
    doc.save(`LiveArtClothing_FinancialReport_${report.month}.pdf`);
  };
  

  return (
    <div>
      <Header/>
    <Container className="my-5">
      <h2 className="text-center mb-4" style={{ color: "#6a1b9a", fontWeight: "bold" }}>
        All Finance Reports - Live Art Clothing Pvt Ltd
      </h2>

      {/* Search and Filter Controls */}
      <div className="d-flex justify-content-between mb-4">
        <InputGroup>
          <FormControl
            placeholder="Search by month, revenue, or expenses"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="shadow-sm rounded-3"
          />
        </InputGroup>
        <Dropdown onSelect={(eventKey) => setFilterStatus(eventKey)}>
          <Dropdown.Toggle variant="info">Filter: {filterStatus}</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey="All">All</Dropdown.Item>
            <Dropdown.Item eventKey="Profit">Profit</Dropdown.Item>
            <Dropdown.Item eventKey="Loss">Loss</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status" />
          <p>Loading reports, please wait...</p>
        </div>
      ) : error ? (
        <div className="text-center">
          <Alert variant="danger">{error}</Alert>
          <Button variant="primary" onClick={fetchReports}>
            Retry
          </Button>
        </div>
      ) : (
        <>
          {filteredReports.length > 0 ? (
            <>
              <Table striped bordered hover responsive className="shadow-sm modern-table">
                <thead className="bg-dark text-white">
                  <tr>
                    <th>#</th>
                    <th onClick={() => handleSort("month")} style={{ cursor: "pointer" }}>
                      Month {sortConfig.key === "month" && (sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />)}
                    </th>
                    <th onClick={() => handleSort("revenue")} style={{ cursor: "pointer" }}>
                      Revenue (LKR) {sortConfig.key === "revenue" && (sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />)}
                    </th>
                    <th onClick={() => handleSort("expenses")} style={{ cursor: "pointer" }}>
                      Expenses (LKR) {sortConfig.key === "expenses" && (sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />)}
                    </th>
                    <th>Profit or Loss</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentReports.map((report, index) => (
                    <tr key={report.id || report._id} className={index % 2 === 0 ? "bg-light" : ""}>
                      <td>{indexOfFirstReport + index + 1}</td>
                      <td style={{ fontWeight: "bold", color: "#4a148c" }}>{report.month}</td>
                      <td>LKR {report.revenue.toLocaleString()}</td>
                      <td>LKR {report.expenses.toLocaleString()}</td>
                      <td>
                        {report.profitOrLoss >= 0 ? (
                          <Badge bg="success">
                            <FaArrowUp /> Profit: LKR {report.profitOrLoss.toLocaleString()}
                          </Badge>
                        ) : (
                          <Badge bg="danger">
                            <FaArrowDown /> Loss: LKR {Math.abs(report.profitOrLoss).toLocaleString()}
                          </Badge>
                        )}
                      </td>
                      <td>
                        <Button variant="primary" size="sm" onClick={() => navigate(`/view-report/${report.id || report._id}`)}>
                          <FaEye /> View Report
                        </Button>
                        <Button variant="danger" size="sm" className="ms-2" onClick={() => handleDelete(report.id || report._id)}>
                          <FaTrashAlt /> Delete
                        </Button>
                        <Button variant="info" size="sm" className="ms-2" onClick={() => handleDownloadPDF(report)}>
                          <FaDownload /> Download PDF
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="d-flex justify-content-between align-items-center mt-4">
                <Button variant="secondary" disabled={currentPage === 1} onClick={handlePrevPage}>
                  Previous
                </Button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <Button variant="secondary" disabled={currentPage === totalPages} onClick={handleNextPage}>
                  Next
                </Button>
              </div>
            </>
          ) : (
            <Alert variant="info" className="text-center">
              No reports found.
            </Alert>
          )}
        </>
      )}
    </Container>
    <Footer/>
    </div>
  );
}

export default AllReport;
