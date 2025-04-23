const express = require("express");
const router = express.Router();
const Employee = require("../Models/Employee"); // Import Employee model
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

// ✅ Create Employee Route (Salary set later by admin)
router.post("/add", validateEmployeeInput, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { employeeid, name, age, department, email, mobile, address } = req.body;

    // Check if employee already exists by employee ID or email
    const existingEmployee = await Employee.findOne({ $or: [{ employeeid }, { email }] });
    if (existingEmployee) {
      return res.status(400).json({ message: "Employee with this ID or email already exists" });
    }

    const newEmployee = new Employee({
      employeeid,
      name,
      age,
      department,
      email,
      mobile,
      address,
      salary: 0, // Default salary is 0, assigned by admin later
    });

    const savedEmployee = await newEmployee.save();
    res.status(201).json({ message: "Employee added successfully!", employee: savedEmployee });
  } catch (error) {
    console.error("Error adding employee:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// ✅ Assign Salary to Employee (Admin)
router.put("/assign-salary/:id", validateSalaryInput, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { salary } = req.body;

    // Find and update employee's salary
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { salary },
      { new: true, runValidators: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      message: "Salary assigned successfully!",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error("Error assigning salary:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// ✅ View Employee Salary (Restricted for the specific employee)
router.get("/view-salary/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id, { salary: 1, name: 1 }); // Fetch salary and name only
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      message: `Salary details for ${employee.name}`,
      salary: employee.salary,
    });
  } catch (error) {
    console.error("Error fetching salary:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// ✅ Update Employee Route (Partial updates allowed, including salary)
router.put("/update/:id", async (req, res) => {
  try {
    const { salary, ...otherDetails } = req.body; // Separate salary from other details
    const updateData = { ...otherDetails };

    if (salary !== undefined && typeof salary === "number" && salary >= 0) {
      updateData.salary = salary; // Allow salary update
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

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

// ✅ Delete Employee by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee deleted successfully!" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
    try {
      const employee = await Employee.findById(req.params.id);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
  
      res.status(200).json(employee);
    } catch (error) {
      console.error("Error fetching employee by ID:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  });









module.exports = router;
