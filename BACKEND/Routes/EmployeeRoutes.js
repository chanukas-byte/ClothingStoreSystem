const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Employee = require("../Models/Employee");
const { body, validationResult } = require("express-validator");

// Validation rules for creating employees (without salary)
const validateEmployeeInput = [
  body("employeeid").notEmpty().withMessage("Employee ID is required"),
  body("name").notEmpty().withMessage("Name is required"),
  body("age").isInt({ min: 18 }).withMessage("Age must be 18 or older"),
  body("department").notEmpty().withMessage("Department is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("mobile")
    .isLength({ min: 10, max: 10 })
    .withMessage("Mobile number must be exactly 10 digits"),
  body("address").notEmpty().withMessage("Address is required"),
];

// Validation for assigning salary (must be a positive number)
const validateSalaryInput = [
  body("salary").isNumeric({ min: 0 }).withMessage("Salary must be a non-negative number"),
];

// ✅ Create Employee
router.post("/add", validateEmployeeInput, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { employeeid, name, age, department, email, mobile, address } = req.body;

    const existingEmployee = await Employee.findOne({ $or: [{ employeeid }, { email }] });
    if (existingEmployee)
      return res.status(400).json({ message: "Employee with this ID or email already exists" });

    const newEmployee = new Employee({
      employeeid,
      name,
      age,
      department,
      email,
      mobile,
      address,
      salary: 0,
    });

    const savedEmployee = await newEmployee.save();
    res.status(201).json({ message: "Employee added successfully!", employee: savedEmployee });
  } catch (error) {
    console.error("Error adding employee:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// ✅ Assign Salary to Employee
router.put("/assign-salary/:id", validateSalaryInput, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { salary } = req.body;

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { salary },
      { new: true, runValidators: true }
    );

    if (!updatedEmployee) return res.status(404).json({ message: "Employee not found" });

    res.status(200).json({
      message: "Salary assigned successfully!",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error("Error assigning salary:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// ✅ View Employee Salary
router.get("/view-salary/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id, { salary: 1, name: 1 });
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    res.status(200).json({
      message: `Salary details for ${employee.name}`,
      salary: employee.salary,
    });
  } catch (error) {
    console.error("Error fetching salary:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// ✅ Update Employee
router.put("/update/:id", async (req, res) => {
  try {
    const { salary, ...otherDetails } = req.body;
    const updateData = { ...otherDetails };

    if (salary !== undefined && typeof salary === "number" && salary >= 0) {
      updateData.salary = salary;
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedEmployee) return res.status(404).json({ message: "Employee not found" });

    res.status(200).json({ message: "Employee updated successfully!", employee: updatedEmployee });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// ✅ Get All Employees
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// ✅ Delete Employee by ID (WITH ObjectId check!)
router.delete("/delete/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid employee ID format" });
  }

  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) return res.status(404).json({ message: "Employee not found" });

    res.status(200).json({ message: "Employee deleted successfully!" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// ✅ Get Employee by ID
router.get("/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    res.status(200).json(employee);
  } catch (error) {
    console.error("Error fetching employee by ID:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = router;
