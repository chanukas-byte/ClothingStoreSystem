import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";                
import AddEmployee from "./Components/AddEmployee";      
import AllEmployees from "./Components/AllEmployee";     
import UpdateEmployee from "./Components/UpdateEmployee"; 
import ViewEmployee from "./Components/ViewEmployee";    
import AddReport from "./Components/AddReport";          
import AllReport from "./Components/AllReport";          
import ReportDetails from "./Components/Reportdetails";  
import AssignSalary from "./Components/AssignSalary";    
import ViewSalary from "./Components/ViewSalary";                       
import Home from "./Components/Home";  

//Inventory Manager
import HomeS from "./Components/HomeS";
import Stock from "./Components/Stock";
import Supplier from "./Components/Suppliers";
import Notify from "./Components/Notification";
import SupplierRegi from "./Components/SupplierRegi";
import AddProduct from "./Components/AddProduct"; 
import Success from "./Components/Success";
import UpdateProduct from "./Components/UpdateProduct";


// New Component for 404 Page
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function App() {
  return (
    <Router>
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

          {/*Inventory Manager Routes*/}
          <Route path="/inventory-management-Home" element={<HomeS />} />
          <Route path="/stock" element={<Stock />}/>
          <Route path="/supplier" element={<Supplier />}/>
          <Route path="/notify" element={<Notify />}/>
          <Route path="/supplier-register" element={<SupplierRegi />} />
          <Route path="/addproduct" element={<AddProduct />}/>
          <Route path="/success" element={<Success />}/>
          <Route path="/stock/update/:id" element={<UpdateProduct />}/>

          {/* 404 Page Route */}
         
        </Routes>
      </div>
    </Router>
  );
}

export default App;

