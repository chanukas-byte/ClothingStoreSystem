import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Button } from "react-bootstrap";

function AllEmployees() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Enhanced function to fetch employees with error handling and improved logging
  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/employee/");
      if (response.status === 200) {
        setEmployees(response.data || []);
      } else {
        throw new Error("Unexpected response status: " + response.status);
      }
    } catch (error) {
      handleApiError(error, "Failed to fetch employee data. Please try again later.");
    }
  };

  // Enhanced error handling
  const handleApiError = (error, defaultMessage) => {
    console.error("API Error:", error);

    const errorMessage = error.response
      ? error.response.data.message || defaultMessage
      : "Network error. Please check your connection.";
    Swal.fire("Error", errorMessage, "error");
  };

  // Handle delete employee with confirmation and error handling
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
          await axios.delete(`http://localhost:8000/api/employee/delete/${employeeId}`);
          setEmployees((prevEmployees) => prevEmployees.filter((emp) => emp.employeeid !== employeeId));
          Swal.fire("Deleted!", "The employee has been deleted.", "success");
        } catch (error) {
          handleApiError(error, "Failed to delete the employee. Please try again.");
        }
      }
    });
  };

  // Handle employee update with validation
  const handleUpdate = async () => {
    if (!selectedEmployee || !selectedEmployee.name || !selectedEmployee.email || !selectedEmployee.department) {
      Swal.fire("Error!", "Please fill in all required fields.", "warning");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/api/employee/update/${selectedEmployee.employeeid}`,
        selectedEmployee
      );
      if (response.status === 200) {
        setEmployees((prev) =>
          prev.map((emp) => (emp.employeeid === selectedEmployee.employeeid ? selectedEmployee : emp))
        );
        Swal.fire("Updated!", "Employee details updated successfully!", "success");
        handleCloseModal();
      }
    } catch (error) {
      handleApiError(error, "Failed to update employee. Please try again.");
    }
  };

  // View and Update Employee
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
    setSelectedEmployee((prev) => ({ ...prev, [name]: value }));
  };

  // Filter employees based on the search term
  const filteredEmployees = employees.filter((employee) =>
    [employee.name, employee.email, employee.department]
      .map((field) => (field || "").toLowerCase())
      .some((field) => field.includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mt-5">
      <div className="card shadow-lg rounded-lg">
        <div className="card-header text-white fw-bold text-center py-3" style={{ backgroundColor: "#007bff" }}>
          <h3>All Employees</h3>
        </div>

        <div className="card-body p-4">
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search by name, email, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {filteredEmployees.length > 0 ? (
            <table className="table table-striped table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Department</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Status</th>
                  <th>Actions</th>
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
                    <td>{employee.status}</td>
                    <td>
                      <button className="btn btn-info btn-sm mx-1" onClick={() => handleViewAndUpdate(employee)}>
                        View / Update
                      </button>
                      <button className="btn btn-danger btn-sm mx-1" onClick={() => handleDelete(employee.employeeid)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="alert alert-info text-center">No employees found.</div>
          )}
        </div>
      </div>

      {selectedEmployee && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Update Employee</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {["name", "age", "department", "email", "mobile"].map((field) => (
              <input
                key={field}
                type={field === "age" ? "number" : "text"}
                className="form-control mb-2"
                name={field}
                value={selectedEmployee[field] || ""}
                onChange={handleInputChange}
              />
            ))}
            <select className="form-select mb-2" name="status" value={selectedEmployee.status} onChange={handleInputChange}>
              <option>Active</option>
              <option>On Leave</option>
              <option>Retired</option>
              <option>Terminated</option>
            </select>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleUpdate}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default AllEmployees;
