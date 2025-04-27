import React from "react";
import { useLocation } from "react-router-dom";

function ReStock() {
  const location = useLocation();
  const { message } = location.state || {};

  return (
    <div>
      <h1>ReStock Page</h1>
      {message && <div style={{ padding: "20px", backgroundColor: "#d4edda", color: "#155724", borderRadius: "5px" }}>{message}</div>}
    </div>
  );
}

export default ReStock;
