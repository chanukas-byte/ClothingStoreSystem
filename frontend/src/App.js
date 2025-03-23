import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";                
import AddEmployee from "./Components/AddEmployee";      
import AllEmployees from "./Components/AllEmployee";     
import UpdateEmployee from "./Components/UpdateEmployee"; 
import ViewEmployee from "./Components/ViewEmployee";    
import AddReport from "./Components/AddReport";          
import AllReport from "./Components/AllReport";          
import ReportDetails from "./Components/Reportdetails";  
import AssignSalary from "./Components/AssignSalary";    
import ViewSalary from "./Components/ViewSalary";        
import Footer from "./Components/Footer";                
import Home from "./Components/Home";                    
    // New Component for 404 Page

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function App() {
  return (
    <Router>
      <Header />
      <div className="container mt-4">
        <Routes>
          {/* Home Route */}
          <Route path="/" element={<Home />} />

          {/* Employee Management Routes */}
          <Route path="/add-employee" element={<AddEmployee />} />
          <Route path="/all-employees" element={<AllEmployees />} />
          <Route path="/update-employee/:id" element={<UpdateEmployee />} />
          <Route path="/view-employee/:id" element={<ViewEmployee />} />

          {/* Report Management Routes */}
          <Route path="/add-report" element={<AddReport />} />
          <Route path="/all-reports" element={<AllReport />} />
          <Route path="/view-report/:id" element={<ReportDetails />} />

          {/* Salary Management Routes */}
          <Route path="/assign-salary" element={<AssignSalary />} />
          <Route path="/view-salary" element={<ViewSalary />} />

          {/* 404 Page Route */}
         
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;

