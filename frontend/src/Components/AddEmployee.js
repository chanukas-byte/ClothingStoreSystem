import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { PDFDocument, rgb } from "pdf-lib";
import Header from "./Header";
import Footer from "./Footer";
import './AddEmployee.css';
import logo from '../assets/logo.png';


function AddEmployee({ isAdmin }) {
  const [employeeData, setEmployeeData] = useState({
    employeeid: "",
    name: "",
    age: "",
    department: "",
    email: "",
    mobile: "",
    status: "",
    address: "",
    salary: isAdmin ? "" : "Not Assigned",
  });

  const [errors, setErrors] = useState({});

  const nameRegex = /^[A-Za-z\s]*$/;
  const emailRegex = /\S+@\S+\.\S+/;
  const mobileRegex = /^\d{0,10}$/;

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "employeeid":
        if (!value.trim()) error = "Employee ID is required";
        break;
      case "name":
        if (!value.trim()) error = "Name is required";
        else if (!nameRegex.test(value)) error = "Only letters and spaces allowed";
        break;
      case "age":
        if (!value || isNaN(value) || value < 18) error = "Must be ≥ 18";
        break;
      case "department":
        if (!value) error = "Department is required";
        break;
      case "email":
        if (!emailRegex.test(value)) error = "Invalid email";
        break;
      case "mobile":
        if (!mobileRegex.test(value)) error = "Invalid mobile (10 digits)";
        break;
      case "status":
        if (!value) error = "Status is required";
        break;
      case "address":
        if (!value.trim()) error = "Address is required";
        break;
      case "salary":
        if (isAdmin) {
          if (value === "") error = "Salary required";
          else if (isNaN(value) || Number(value) < 0) error = "Invalid salary";
        }
        break;
      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    Object.entries(employeeData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name" && !nameRegex.test(value)) return;
    if (name === "mobile" && !/^\d*$/.test(value)) return;

    const updatedData = { ...employeeData, [name]: value };
    setEmployeeData(updatedData);

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.post("http://localhost:4058/api/employee/add", employeeData);
      if (res.status === 201) {
        Swal.fire("Success", "Employee added!", "success");
        await generatePDF(employeeData);
        setEmployeeData({
          employeeid: "",
          name: "",
          age: "",
          department: "",
          email: "",
          mobile: "",
          status: "",
          address: "",
          salary: isAdmin ? "" : "Not Assigned",
        });
        setErrors({});
      }
    } catch (err) {
      Swal.fire("Error", "Failed to add employee", "error");
    }
  };

  const generatePDF = async (employee) => {
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

    // Add logo
    const logoImage = await pdfDoc.embedPng(logo);
    const logoDims = logoImage.scale(0.2);
    page.drawImage(logoImage, {
      x: 50,
      y: height - 100,
      width: logoDims.width,
      height: logoDims.height,
    });

    // Add header with modern styling
    page.drawText("Employee Registration Receipt", {
      x: 200,
      y: height - 80,
      size: 24,
      color: rgb(0, 0, 0),
    });

    // Add registration date with gold color
    page.drawText(`Registration Date: ${new Date().toLocaleString()}`, {
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
      { label: "Age", value: employee.age },
      { label: "Department", value: employee.department },
      { label: "Mobile", value: employee.mobile },
      { label: "Status", value: employee.status },
      { label: "Address", value: employee.address },
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

    // Add signature section
    yPosition -= 30;
    page.drawLine({
      start: { x: 50, y: yPosition },
      end: { x: 250, y: yPosition },
      color: rgb(0.85, 0.65, 0.13),
      thickness: 1,
    });

    page.drawText("Finance Manager", {
      x: 50,
      y: yPosition - 20,
      size: 12,
      color: rgb(0, 0, 0),
    });

    page.drawText("Signature", {
      x: 50,
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
    link.download = `${employee.name}_Employee_Receipt.pdf`;
    link.click();
  };

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <div className="card shadow-lg rounded-lg">
          <div className="card-header text-white fw-bold text-center py-3">
            <h3>Employee Registration Form</h3>
          </div>
          <div className="card-body p-5" style={{ backgroundColor: "#f8f9fa" }}>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                {[
                  { name: "employeeid", label: "Employee ID", type: "text" },
                  { name: "name", label: "Name", type: "text" },
                  { name: "age", label: "Age", type: "number" },
                  {
                    name: "department",
                    label: "Department",
                    type: "select",
                    options: ["Sales", "Inventory", "Customer Support", "Operation Management"],
                  },
                  { name: "email", label: "Email", type: "email" },
                  { name: "mobile", label: "Mobile", type: "text" },
                  {
                    name: "status",
                    label: "Employment Status",
                    type: "select",
                    options: ["Active", "On Leave", "Retired", "Terminated"],
                  },
                ].map((field, i) => (
                  <div className={`col-md-${field.name === "status" ? 12 : 6}`} key={i}>
                    <label className="form-label fw-bold">{field.label}</label>
                    {field.type === "select" ? (
                      <select
                        className="form-select"
                        name={field.name}
                        value={employeeData[field.name]}
                        onChange={handleChange}
                      >
                        <option value="">Select {field.label}</option>
                        {field.options.map((opt, i) => (
                          <option value={opt} key={i}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        className="form-control"
                        name={field.name}
                        value={employeeData[field.name]}
                        onChange={handleChange}
                      />
                    )}
                    {errors[field.name] && <div className="text-danger">{errors[field.name]}</div>}
                  </div>
                ))}

                {/* Address */}
                <div className="col-md-12">
                  <label className="form-label fw-bold">Address</label>
                  <textarea
                    className="form-control"
                    name="address"
                    rows="3"
                    value={employeeData.address}
                    onChange={handleChange}
                  ></textarea>
                  {errors.address && <div className="text-danger">{errors.address}</div>}
                </div>

                {/* Salary (only Admin) */}
                {isAdmin && (
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Salary ($)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="salary"
                      value={employeeData.salary}
                      onChange={handleChange}
                    />
                    {errors.salary && <div className="text-danger">{errors.salary}</div>}
                  </div>
                )}
              </div>

              <div className="text-center mt-4">
                <button type="submit" className="modern-btn">
                  Register Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AddEmployee;
