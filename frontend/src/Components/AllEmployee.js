import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Button } from "react-bootstrap";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import Header from "./Header";
import Footer from "./Footer";

function AllEmployees() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:4058/api/employee/");
      if (response.status === 200 && Array.isArray(response.data)) {
        const normalizedData = response.data.map(emp => ({
          employeeid: emp.employeeid || emp._id || emp.id || "N/A",
          name: emp.name || "",
          age: emp.age || "",
          department: emp.department || "",
          email: emp.email || "",
          mobile: emp.mobile || "",
          status: emp.status || "Active"
        }));
        setEmployees(normalizedData);
      } else {
        throw new Error("Unexpected response format or status.");
      }
    } catch (error) {
      handleApiError(error, "Failed to fetch employee data. Please try again later.");
    }
  };

  const handleApiError = (error, defaultMessage) => {
    const errorMessage = error.response?.data?.message || defaultMessage;
    Swal.fire("Error", errorMessage, "error");
  };

  const handleDelete = (employeeId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:4058/api/employee/delete/${employeeId}`);
          setEmployees((prevEmployees) => prevEmployees.filter((emp) => emp.employeeid !== employeeId));
          Swal.fire("Deleted!", "The employee has been deleted.", "success");
        } catch (error) {
          handleApiError(error, "Failed to delete the employee. Please try again.");
        }
      }
    });
  };

  const handleUpdate = async () => {
    if (!selectedEmployee || !selectedEmployee.name || !selectedEmployee.email || !selectedEmployee.department) {
      Swal.fire("Error!", "Please fill in all required fields.", "warning");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:4058/api/employee/update/${selectedEmployee.employeeid}`,
        selectedEmployee
      );
      if (response.status === 200) {
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.employeeid === selectedEmployee.employeeid ? selectedEmployee : emp
          )
        );
        Swal.fire("Updated!", "Employee details updated successfully!", "success");
        handleCloseModal();
      }
    } catch (error) {
      handleApiError(error, "Failed to update employee. Please try again.");
    }
  };

  const handleViewAndUpdate = (employee) => {
    setSelectedEmployee({ ...employee });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmployee((prev) => ({
      ...prev,
      [name]: name === "age" ? parseInt(value) || "" : value,
    }));
  };

  const filteredEmployees = employees.filter((employee) =>
    [employee.name, employee.email, employee.department]
      .map((field) => (field || "").toLowerCase())
      .some((field) => field.includes(searchTerm.toLowerCase()))
  );

  const statusBadge = (status) => {
    const badgeClass = {
      Active: "success",
      "On Leave": "warning",
      Retired: "secondary",
      Terminated: "danger",
    }[status] || "primary";

    return <span className={`badge bg-${badgeClass}`}>{status}</span>;
  };

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-header text-white text-center py-3" style={{ backgroundColor: "#0d6efd" }}>
            <h3 className="mb-0">All Employees</h3>
          </div>

          <div className="card-body p-4">
            <div className="input-group mb-3">
              <span className="input-group-text"><FaSearch /></span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {filteredEmployees.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Employee ID</th>
                      <th>Name</th>
                      <th>Age</th>
                      <th>Department</th>
                      <th>Email</th>
                      <th>Mobile</th>
                      <th>Status</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((employee) => (
                      <tr key={employee.employeeid}>
                        <td>{employee.employeeid}</td>
                        <td>{employee.name}</td>
                        <td>{employee.age}</td>
                        <td>{employee.department}</td>
                        <td>{employee.email}</td>
                        <td>{employee.mobile}</td>
                        <td>{statusBadge(employee.status)}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-outline-primary btn-sm me-2"
                            onClick={() => handleViewAndUpdate(employee)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(employee.employeeid)}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="alert alert-info text-center">No employees found.</div>
            )}
          </div>
        </div>

        {selectedEmployee && (
          <Modal show={showModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>Edit Employee</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {["name", "age", "department", "email", "mobile"].map((field) => (
                <div className="mb-3" key={field}>
                  <label className="form-label text-capitalize">{field}</label>
                  <input
                    type={field === "age" ? "number" : "text"}
                    className="form-control"
                    name={field}
                    value={selectedEmployee[field] || ""}
                    onChange={handleInputChange}
                  />
                </div>
              ))}
              <label className="form-label">Status</label>
              <select
                className="form-select mb-3"
                name="status"
                value={selectedEmployee.status || "Active"}
                onChange={handleInputChange}
              >
                <option>Active</option>
                <option>On Leave</option>
                <option>Retired</option>
                <option>Terminated</option>
              </select>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleUpdate}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default AllEmployees;
