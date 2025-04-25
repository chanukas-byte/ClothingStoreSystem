import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Button } from "react-bootstrap";
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
        const normalizedData = response.data.map((emp) => ({
          employeeid: emp.employeeid || emp._id || emp.id || "N/A",
          name: emp.name || "",
          age: emp.age || "",
          department: emp.department || "",
          email: emp.email || "",
          mobile: emp.mobile || "",
          status: emp.status || "Active",
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
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`http://localhost:4058/api/employee/delete/${employeeId}`);
          if (response.status === 200) {
            setEmployees((prev) => prev.filter((emp) => emp.employeeid !== employeeId));
            Swal.fire("Deleted!", "The employee has been deleted.", "success");
          } else {
            throw new Error("Unexpected response status.");
          }
        } catch (error) {
          handleApiError(error, "Failed to delete the employee. Please try again.");
        }
      }
    });
  };

  const handleUpdate = async () => {
    if (!selectedEmployee?.name || !selectedEmployee?.email || !selectedEmployee?.department) {
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
            emp.employeeid === selectedEmployee.employeeid ? { ...selectedEmployee } : emp
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
      .map((field) => field.toLowerCase())
      .some((field) => field.includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <div className="card shadow-lg rounded-4">
          <div className="card-header bg-primary text-white text-center py-3">
            <h3 className="fw-bold mb-0">All Employees</h3>
          </div>

          <div className="card-body p-4">
            <input
              type="text"
              className="form-control form-control-lg mb-4 shadow-sm"
              placeholder="🔍 Search by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {filteredEmployees.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle table-bordered rounded-3 overflow-hidden">
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
                          <button
                            className="btn btn-outline-info btn-sm me-2"
                            onClick={() => handleViewAndUpdate(employee)}
                          >
                            View / Update
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(employee.employeeid)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="alert alert-warning text-center">
                No employees found.
              </div>
            )}
          </div>
        </div>

        {selectedEmployee && (
          <Modal show={showModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton className="bg-primary text-white">
              <Modal.Title>Update Employee</Modal.Title>
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
