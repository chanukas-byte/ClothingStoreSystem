import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Button, Table, Form } from "react-bootstrap";
import { FaDownload } from "react-icons/fa";
import { PDFDocument, rgb } from "pdf-lib"; // Import from pdf-lib
import Header from "./Header";
import Footer from "./Footer"; 
import "./ViewSalary.css";
import logo from '../assets/logo.png';

function AllEmployees() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAsc, setSortAsc] = useState(true); // Sort employees alphabetically by name
  const [departmentFilter, setDepartmentFilter] = useState(""); // Filter employees by department
  const [sortSalaryAsc, setSortSalaryAsc] = useState(true); // Sort employees by gross salary

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:4058/api/employee/");
      if (response && response.data) {
        setEmployees(response.data);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  const calculateSalary = (employee) => {
    const baseSalaryRates = {
      Inventory: 110000.0,
      Sales: 90000.0,
      "Operation Management": 85000.0,
      "Customer Support": 100000.0,
    };

    const grossSalary = baseSalaryRates[employee.department] || 50000.0;
    const epf = (grossSalary * 12) / 100;
    const etf = (grossSalary * 3) / 100;
    const netSalary = grossSalary - epf - etf;

    return { grossSalary, epf, etf, netSalary };
  };

  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());
  const handleSortByName = () => setSortAsc(!sortAsc); // Sort toggle by name
  const handleSortBySalary = () => setSortSalaryAsc(!sortSalaryAsc); // Sort toggle by salary

  const handleDepartmentFilter = (e) => setDepartmentFilter(e.target.value);

  const formatDepartment = (department) => {
    const formattedDepartments = {
      inventory: "Inventory",
      sales: "Sales",
      "customer support": "Customer Support",
      "operation management": "Operation Management",
    };
    return formattedDepartments[department.toLowerCase()] || department;
  };

  const downloadPDF = async (employee) => {
    const { grossSalary, epf, etf, netSalary } = calculateSalary(employee);
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();

    // Add decorative border with gold color
    page.drawRectangle({
      x: 20,
      y: 20,
      width: width - 40,
      height: height - 40,
      borderColor: rgb(0.85, 0.65, 0.13), // Gold color
      borderWidth: 2,
    });

    // Add inner border with black color
    page.drawRectangle({
      x: 25,
      y: 25,
      width: width - 50,
      height: height - 50,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });

    // Fetch the logo as an array buffer and embed it
    try {
      const response = await fetch(logo);
      const logoBytes = await response.arrayBuffer();
      const logoImage = await pdfDoc.embedPng(logoBytes);
      const logoDims = logoImage.scale(0.15);
      page.drawImage(logoImage, {
        x: 50,
        y: height - 120,
        width: logoDims.width,
        height: logoDims.height,
      });
    } catch (error) {
      console.warn('Could not embed logo:', error);
    }

    // Add header with modern styling
    page.drawText("Live Art Clothing - Salary Slip", {
      x: 200,
      y: height - 80,
      size: 24,
      color: rgb(0, 0, 0),
    });

    // Add date with gold color
    page.drawText(`Date: ${new Date().toLocaleDateString()}`, {
      x: 200,
      y: height - 110,
      size: 12,
      color: rgb(0.85, 0.65, 0.13),
    });

    // Add decorative line
    page.drawLine({
      start: { x: 50, y: height - 130 },
      end: { x: width - 50, y: height - 130 },
      color: rgb(0.85, 0.65, 0.13),
      thickness: 1,
    });

    // Add employee details with modern styling
    const details = [
      { label: "Employee ID", value: employee.employeeid },
      { label: "Name", value: employee.name },
      { label: "Department", value: formatDepartment(employee.department) },
      { label: "Gross Salary", value: `LKR ${grossSalary.toLocaleString("en-LK")}` },
      { label: "EPF (12%)", value: `LKR ${epf.toLocaleString("en-LK")}` },
      { label: "ETF (3%)", value: `LKR ${etf.toLocaleString("en-LK")}` },
      { label: "Net Salary", value: `LKR ${netSalary.toLocaleString("en-LK")}` },
    ];

    let yPosition = height - 170;
    details.forEach(({ label, value }) => {
      // Draw label in gold
      page.drawText(`${label}:`, {
        x: 50,
        y: yPosition,
        size: 12,
        color: rgb(0.85, 0.65, 0.13),
      });

      // Draw value in black
      page.drawText(value, {
        x: 200,
        y: yPosition,
        size: 12,
        color: rgb(0, 0, 0),
      });

      yPosition -= 30;
    });

    // Add signature section at the bottom right
    yPosition = 100;
    page.drawLine({
      start: { x: width - 200, y: yPosition },
      end: { x: width - 50, y: yPosition },
      color: rgb(0.85, 0.65, 0.13),
      thickness: 1,
    });

    page.drawText("Finance Manager", {
      x: width - 200,
      y: yPosition - 20,
      size: 12,
      color: rgb(0, 0, 0),
    });

    page.drawText("Signature", {
      x: width - 200,
      y: yPosition - 40,
      size: 10,
      color: rgb(0.85, 0.65, 0.13),
    });

    // Add footer with modern styling
    page.drawText("Live Art Clothing - Employee Management System", {
      x: width / 2,
      y: 50,
      size: 10,
      color: rgb(0.85, 0.65, 0.13),
      align: 'center',
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Salary_Slip_${employee.employeeid}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Apply search, department filter, and sorting
  const filteredEmployees = employees
    .filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchTerm) &&
        (!departmentFilter || employee.department === departmentFilter)
    )
    .sort((a, b) =>
      sortSalaryAsc
        ? calculateSalary(a).grossSalary - calculateSalary(b).grossSalary
        : calculateSalary(b).grossSalary - calculateSalary(a).grossSalary
    )
    .sort((a, b) => (sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));

  return (
    <div>
      <Header/>
    <div className="container mt-5">
      
      <div className="card shadow-lg rounded-lg border-0 bg-light">
        <div className="card-header salary-header-black fw-bold text-center py-3">
          <h3>Employee Salaries</h3>
        </div>

        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <Form.Control
              type="search"
              placeholder="Search by Name..."
              onChange={handleSearch}
              className="me-2 border-2 rounded-pill shadow-sm"
              style={{ padding: "12px", maxWidth: "300px" }}
            />

            <Form.Select onChange={handleDepartmentFilter} style={{ maxWidth: "200px" }}>
              <option value="">All Departments</option>
              <option value="Inventory">Inventory</option>
              <option value="Sales">Sales</option>
              <option value="Customer Support">Customer Support</option>
              <option value="Operation Management">Operation Management</option>
            </Form.Select>

            <Button onClick={handleSortBySalary} variant="info" className="text-white">
              Sort by Salary ({sortSalaryAsc ? "Asc" : "Desc"})
            </Button>
          </div>

          <div className="table-responsive">
            <Table striped bordered hover className="text-center">
              <thead className="bg-primary text-white">
                <tr>
                  <th>Employee ID</th>
                  <th onClick={handleSortByName}>Name</th>
                  <th>Department</th>
                  <th>Gross Salary (LKR)</th>
                  <th>EPF (12%)</th>
                  <th>ETF (3%)</th>
                  <th>Net Salary (LKR)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => {
                  const { grossSalary, epf, etf, netSalary } = calculateSalary(employee);

                  return (
                    <tr key={employee.employeeid}>
                      <td>{employee.employeeid}</td>
                      <td>{employee.name}</td>
                      <td>{formatDepartment(employee.department)}</td>
                      <td>LKR {grossSalary.toLocaleString("en-LK")}</td>
                      <td>LKR {epf.toLocaleString("en-LK")}</td>
                      <td>LKR {etf.toLocaleString("en-LK")}</td>
                      <td>LKR {netSalary.toLocaleString("en-LK")}</td>
                      <td>
                        <Button className="download-slip-btn" onClick={() => downloadPDF(employee)}>
                          <FaDownload /> Download Salary Slip
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
}

export default AllEmployees;
