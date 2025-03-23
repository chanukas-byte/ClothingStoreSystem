import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { PDFDocument, rgb } from "pdf-lib";

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
    salary: isAdmin ? "" : "Not Assigned", // Disable for non-admins
  });

  const handleChange = (e) => {
    setEmployeeData({
      ...employeeData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8020/api/employee/add", employeeData);

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Employee Added Successfully!",
          text: "Employee registration completed.",
        });

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
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Add Employee",
        text: "Please try again later.",
      });
    }
  };

  const generatePDF = async (employee) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { employeeid, name, age, department, email, mobile, status, address, salary } = employee;

    const fontSize = 12;
    page.drawText("Employee Registration Receipt", { x: 200, y: 750, size: 18, color: rgb(0.2, 0.4, 0.8) });
    page.drawText(`Registration Date: ${new Date().toLocaleString()}`, { x: 150, y: 720, size: fontSize });

    const text = `
    Employee ID    : ${employeeid}
    Name           : ${name}
    Age            : ${age}
    Department     : ${department}
    Email          : ${email}
    Mobile         : ${mobile}
    Status         : ${status}
    Address        : ${address}
    Salary         : $${salary}
    `;
    page.drawText(text, { x: 50, y: 650, size: fontSize, lineHeight: 20, color: rgb(0.1, 0.1, 0.1) });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${name}_Employee_Receipt.pdf`;
    link.click();
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg rounded-lg">
        <div className="card-header text-white fw-bold text-center py-3" style={{ backgroundColor: "#007bff" }}>
          <h3>Employee Registration Form</h3>
        </div>

        <div className="card-body p-5">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* Employee ID and Name */}
              <div className="col-md-6">
                <label htmlFor="employeeId" className="form-label fw-bold">Employee ID</label>
                <input type="text" className="form-control shadow-sm rounded" id="employeeId" name="employeeid" value={employeeData.employeeid} onChange={handleChange} required />
              </div>

              <div className="col-md-6">
                <label htmlFor="name" className="form-label fw-bold">Name</label>
                <input type="text" className="form-control shadow-sm rounded" id="name" name="name" value={employeeData.name} onChange={handleChange} required />
              </div>

              {/* Age and Department */}
              <div className="col-md-6">
                <label htmlFor="age" className="form-label fw-bold">Age</label>
                <input type="number" className="form-control shadow-sm rounded" id="age" name="age" value={employeeData.age} onChange={handleChange} required min="18" />
              </div>

              <div className="col-md-6">
                <label htmlFor="department" className="form-label fw-bold">Department</label>
                <select className="form-select shadow-sm rounded" id="department" name="department" value={employeeData.department} onChange={handleChange} required>
                  <option value="" disabled>Select Department</option>
                  <option value="Sales">Sales</option>
                  <option value="Inventory">Inventory</option>
                  <option value="Customer Support">Customer Support</option>
                  <option value="Operation Management">Operation Management</option>
                </select>
              </div>

              {/* Email and Mobile */}
              <div className="col-md-6">
                <label htmlFor="email" className="form-label fw-bold">Email Address</label>
                <input type="email" className="form-control shadow-sm rounded" id="email" name="email" value={employeeData.email} onChange={handleChange} required />
              </div>

              <div className="col-md-6">
                <label htmlFor="mobile" className="form-label fw-bold">Mobile</label>
                <input type="text" className="form-control shadow-sm rounded" id="mobile" name="mobile" value={employeeData.mobile} onChange={handleChange} required />
              </div>

              {/* Employment Status Dropdown */}
              <div className="col-md-12">
                <label htmlFor="status" className="form-label fw-bold">Employment Status</label>
                <select className="form-select shadow-sm rounded" id="status" name="status" value={employeeData.status} onChange={handleChange} required>
                  <option value="" disabled>Select Employment Status</option>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Retired">Retired</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>

              <div className="col-md-12">
                <label htmlFor="address" className="form-label fw-bold">Address</label>
                <textarea className="form-control shadow-sm rounded" id="address" name="address" value={employeeData.address} onChange={handleChange} required rows="3"></textarea>
              </div>

              {isAdmin && (
                <div className="col-md-6">
                  <label htmlFor="salary" className="form-label fw-bold">Salary ($)</label>
                  <input type="number" className="form-control shadow-sm rounded" id="salary" name="salary" value={employeeData.salary} onChange={handleChange} required />
                </div>
              )}
            </div>

            <div className="text-center mt-4">
              <button type="submit" className="btn btn-primary btn-lg rounded-pill shadow-sm px-4">
                Register Employee
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddEmployee;
