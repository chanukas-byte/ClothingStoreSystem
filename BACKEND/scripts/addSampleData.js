const mongoose = require('mongoose');
const FinancialData = require('../Models/FinancialData');
require('dotenv').config();

// MongoDB Connection URL
const URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/clothingstore';

// Sample data
const sampleData = [
  // Revenue data
  {
    type: 'revenue',
    amount: 15000,
    category: 'Sales',
    description: 'Monthly clothing sales',
    month: 'January',
    year: 2023
  },
  {
    type: 'revenue',
    amount: 18000,
    category: 'Sales',
    description: 'Monthly clothing sales',
    month: 'February',
    year: 2023
  },
  {
    type: 'revenue',
    amount: 22000,
    category: 'Sales',
    description: 'Monthly clothing sales',
    month: 'March',
    year: 2023
  },
  {
    type: 'revenue',
    amount: 25000,
    category: 'Sales',
    description: 'Monthly clothing sales',
    month: 'April',
    year: 2023
  },
  {
    type: 'revenue',
    amount: 28000,
    category: 'Sales',
    description: 'Monthly clothing sales',
    month: 'May',
    year: 2023
  },
  {
    type: 'revenue',
    amount: 30000,
    category: 'Sales',
    description: 'Monthly clothing sales',
    month: 'June',
    year: 2023
  },
  
  // Expense data
  {
    type: 'expense',
    amount: 8000,
    category: 'Inventory',
    description: 'Purchase of new clothing items',
    month: 'January',
    year: 2023
  },
  {
    type: 'expense',
    amount: 9500,
    category: 'Inventory',
    description: 'Purchase of new clothing items',
    month: 'February',
    year: 2023
  },
  {
    type: 'expense',
    amount: 11000,
    category: 'Inventory',
    description: 'Purchase of new clothing items',
    month: 'March',
    year: 2023
  },
  {
    type: 'expense',
    amount: 12000,
    category: 'Inventory',
    description: 'Purchase of new clothing items',
    month: 'April',
    year: 2023
  },
  {
    type: 'expense',
    amount: 13000,
    category: 'Inventory',
    description: 'Purchase of new clothing items',
    month: 'May',
    year: 2023
  },
  {
    type: 'expense',
    amount: 14000,
    category: 'Inventory',
    description: 'Purchase of new clothing items',
    month: 'June',
    year: 2023
  },
  
  // Additional expense categories
  {
    type: 'expense',
    amount: 3000,
    category: 'Utilities',
    description: 'Monthly utilities',
    month: 'January',
    year: 2023
  },
  {
    type: 'expense',
    amount: 3200,
    category: 'Utilities',
    description: 'Monthly utilities',
    month: 'February',
    year: 2023
  },
  {
    type: 'expense',
    amount: 3500,
    category: 'Utilities',
    description: 'Monthly utilities',
    month: 'March',
    year: 2023
  },
  {
    type: 'expense',
    amount: 4000,
    category: 'Salaries',
    description: 'Employee salaries',
    month: 'January',
    year: 2023
  },
  {
    type: 'expense',
    amount: 4200,
    category: 'Salaries',
    description: 'Employee salaries',
    month: 'February',
    year: 2023
  },
  {
    type: 'expense',
    amount: 4500,
    category: 'Salaries',
    description: 'Employee salaries',
    month: 'March',
    year: 2023
  },
  {
    type: 'expense',
    amount: 2000,
    category: 'Marketing',
    description: 'Marketing campaigns',
    month: 'January',
    year: 2023
  },
  {
    type: 'expense',
    amount: 2500,
    category: 'Marketing',
    description: 'Marketing campaigns',
    month: 'February',
    year: 2023
  },
  {
    type: 'expense',
    amount: 3000,
    category: 'Marketing',
    description: 'Marketing campaigns',
    month: 'March',
    year: 2023
  },
  {
    type: 'expense',
    amount: 1500,
    category: 'Maintenance',
    description: 'Store maintenance',
    month: 'January',
    year: 2023
  },
  {
    type: 'expense',
    amount: 1800,
    category: 'Maintenance',
    description: 'Store maintenance',
    month: 'February',
    year: 2023
  },
  {
    type: 'expense',
    amount: 2000,
    category: 'Maintenance',
    description: 'Store maintenance',
    month: 'March',
    year: 2023
  }
];

// Connect to MongoDB
mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("✅ MongoDB Connection Successful!");
    
    try {
      // Clear existing data
      await FinancialData.deleteMany({});
      console.log("✅ Existing data cleared");
      
      // Insert sample data
      await FinancialData.insertMany(sampleData);
      console.log(`✅ ${sampleData.length} sample records inserted successfully`);
      
      // Close the connection
      mongoose.connection.close();
      console.log("✅ Database connection closed");
    } catch (error) {
      console.error("❌ Error inserting sample data:", error);
      mongoose.connection.close();
    }
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection Error:", error);
  }); 