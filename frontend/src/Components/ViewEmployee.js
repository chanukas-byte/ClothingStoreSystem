import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ViewEmployee() {
  const { id } = useParams();
  const [employee, setEmployee] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:8070/api/employee/${id}`).then((response) => {
      setEmployee(response.data);
    });
  }, [id]);

  return (
    <div className="container mt-5">
      <h3>Employee Details</h3>
      <p><strong>Name:</strong> {employee.name}</p>
      <p><strong>Age:</strong> {employee.age}</p>
      <p><strong>Department:</strong> {employee.department}</p>
      <p><strong>Email:</strong> {employee.email}</p>
      <p><strong>Mobile:</strong> {employee.mobile}</p>
      <p><strong>Status:</strong> {employee.status}</p>
      <p><strong>Salary:</strong> ${employee.salary}</p>
    </div>
  );
}

export default ViewEmployee;
