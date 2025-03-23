import React from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";

function HomeS() {
  const navigate = useNavigate();

  return (
    <div>
      <Nav /> 
      <h1>Our Home Page</h1>
      <button onClick={() => navigate("/supplier-register")} className="btn">
        Register Supplier
      </button>
      <button onClick={() => navigate("/addproduct")} className="btn">
        Add New Product
      </button>
    </div>
  );
}

export default HomeS;
