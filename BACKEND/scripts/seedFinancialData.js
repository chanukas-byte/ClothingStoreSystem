const mongoose = require('mongoose');
const FinancialData = require('../Models/FinancialData');
require('dotenv').config();

// MongoDB Connection URL
const URL = process.env.MONGODB_URL;

// Sample data
const sampleData = [
  // Revenue data
  {
    type: 'revenue',
    amount: 12500,
    category: 'Sales',
    description: 'Monthly clothing sales',
    month: 'January',
    year: 2023
  },
  {
    type: 'revenue',
    amount: 13200,
    category: 'Sales',
    description: 'Monthly clothing sales',
    month: 'February',
    year: 2023
  },
  {
    type: 'revenue',
    amount: 14800,
    category: 'Sales',
    description: 'Monthly clothing sales',
    month: 'March',
    year: 2023
  },
  {
    type: 'revenue',
    amount: 15600,
    category: 'Sales',
    description: 'Monthly clothing sales',
    month: 'April',
    year: 2023
  },
  {
    type: 'revenue',
    amount: 16200,
    category: 'Sales',
    description: 'Monthly clothing sales',
    month: 'May',
    year: 2023
  },
  {
    type: 'revenue',
    amount: 17500,
    category: 'Sales',
    description: 'Monthly clothing sales',
    month: 'June',
    year: 2023
  },
  {
    type: 'revenue',
    amount: 18200,
    category: 'Sales',
    description: 'Monthly clothing sales',
    month: 'July',
    year: 2023
  },
  {
    type: 'revenue',
    amount: 19500,
    category: 'Sales',
    description: 'Monthly clothing sales',
    month: 'August',
    year: 2023
  },
  {
    type: 'revenue',
    amount: 20100,
    category: 'Sales',
    description: 'Monthly clothing sales',
    month: 'September',
    year: 2023
  },
  {
    type: 'revenue',
    amount: 21500,
    category: 'Sales',
    description: 'Monthly clothing sales',
    month: 'October',
    year: 2023
  },
  {
    type: 'revenue',
    amount: 22800,
    category: 'Sales',
    description: 'Monthly clothing sales',
    month: 'November',
    year: 2023
  },
  {
    type: 'revenue',
    amount: 24500,
    category: 'Sales',
    description: 'Monthly clothing sales',
    month: 'December',
    year: 2023
  },
  
  // Expense data
  {
    type: 'expense',
    amount: 8500,
    category: 'Inventory',
    description: 'Purchase of new clothing inventory',
    month: 'January',
    year: 2023
  },
  {
    type: 'expense',
    amount: 9200,
    category: 'Inventory',
    description: 'Purchase of new clothing inventory',
    month: 'February',
    year: 2023
  },
  {
    type: 'expense',
    amount: 9800,
    category: 'Inventory',
    description: 'Purchase of new clothing inventory',
    month: 'March',
    year: 2023
  },
  {
    type: 'expense',
    amount: 10500,
    category: 'Inventory',
    description: 'Purchase of new clothing inventory',
    month: 'April',
    year: 2023
  },
  {
    type: 'expense',
    amount: 11200,
    category: 'Inventory',
    description: 'Purchase of new clothing inventory',
    month: 'May',
    year: 2023
  },
  {
    type: 'expense',
    amount: 11800,
    category: 'Inventory',
    description: 'Purchase of new clothing inventory',
    month: 'June',
    year: 2023
  },
  {
    type: 'expense',
    amount: 12500,
    category: 'Inventory',
    description: 'Purchase of new clothing inventory',
    month: 'July',
    year: 2023
  },
  {
    type: 'expense',
    amount: 13200,
    category: 'Inventory',
    description: 'Purchase of new clothing inventory',
    month: 'August',
    year: 2023
  },
  {
    type: 'expense',
    amount: 13800,
    category: 'Inventory',
    description: 'Purchase of new clothing inventory',
    month: 'September',
    year: 2023
  },
  {
    type: 'expense',
    amount: 14500,
    category: 'Inventory',
    description: 'Purchase of new clothing inventory',
    month: 'October',
    year: 2023
  },
  {
    type: 'expense',
    amount: 15200,
    category: 'Inventory',
    description: 'Purchase of new clothing inventory',
    month: 'November',
    year: 2023
  },
  {
    type: 'expense',
    amount: 15800,
    category: 'Inventory',
    description: 'Purchase of new clothing inventory',
    month: 'December',
    year: 2023
  },
  
  // Additional expense categories
  {
    type: 'expense',
    amount: 2500,
    category: 'Utilities',
    description: 'Monthly utilities',
    month: 'January',
    year: 2023
  },
  {
    type: 'expense',
    amount: 2800,
    category: 'Utilities',
    description: 'Monthly utilities',
    month: 'February',
    year: 2023
  },
  {
    type: 'expense',
    amount: 3100,
    category: 'Utilities',
    description: 'Monthly utilities',
    month: 'March',
    year: 2023
  },
  {
    type: 'expense',
    amount: 3400,
    category: 'Utilities',
    description: 'Monthly utilities',
    month: 'April',
    year: 2023
  },
  {
    type: 'expense',
    amount: 3700,
    category: 'Utilities',
    description: 'Monthly utilities',
    month: 'May',
    year: 2023
  },
  {
    type: 'expense',
    amount: 4000,
    category: 'Utilities',
    description: 'Monthly utilities',
    month: 'June',
    year: 2023
  },
  {
    type: 'expense',
    amount: 4300,
    category: 'Utilities',
    description: 'Monthly utilities',
    month: 'July',
    year: 2023
  },
  {
    type: 'expense',
    amount: 4600,
    category: 'Utilities',
    description: 'Monthly utilities',
    month: 'August',
    year: 2023
  },
  {
    type: 'expense',
    amount: 4900,
    category: 'Utilities',
    description: 'Monthly utilities',
    month: 'September',
    year: 2023
  },
  {
    type: 'expense',
    amount: 5200,
    category: 'Utilities',
    description: 'Monthly utilities',
    month: 'October',
    year: 2023
  },
  {
    type: 'expense',
    amount: 5500,
    category: 'Utilities',
    description: 'Monthly utilities',
    month: 'November',
    year: 2023
  },
  {
    type: 'expense',
    amount: 5800,
    category: 'Utilities',
    description: 'Monthly utilities',
    month: 'December',
    year: 2023
  },
  
  {
    type: 'expense',
    amount: 1800,
    category: 'Marketing',
    description: 'Marketing campaigns',
    month: 'January',
    year: 2023
  },
  {
    type: 'expense',
    amount: 2100,
    category: 'Marketing',
    description: 'Marketing campaigns',
    month: 'February',
    year: 2023
  },
  {
    type: 'expense',
    amount: 2400,
    category: 'Marketing',
    description: 'Marketing campaigns',
    month: 'March',
    year: 2023
  },
  {
    type: 'expense',
    amount: 2700,
    category: 'Marketing',
    description: 'Marketing campaigns',
    month: 'April',
    year: 2023
  },
  {
    type: 'expense',
    amount: 3000,
    category: 'Marketing',
    description: 'Marketing campaigns',
    month: 'May',
    year: 2023
  },
  {
    type: 'expense',
    amount: 3300,
    category: 'Marketing',
    description: 'Marketing campaigns',
    month: 'June',
    year: 2023
  },
  {
    type: 'expense',
    amount: 3600,
    category: 'Marketing',
    description: 'Marketing campaigns',
    month: 'July',
    year: 2023
  },
  {
    type: 'expense',
    amount: 3900,
    category: 'Marketing',
    description: 'Marketing campaigns',
    month: 'August',
    year: 2023
  },
  {
    type: 'expense',
    amount: 4200,
    category: 'Marketing',
    description: 'Marketing campaigns',
    month: 'September',
    year: 2023
  },
  {
    type: 'expense',
    amount: 4500,
    category: 'Marketing',
    description: 'Marketing campaigns',
    month: 'October',
    year: 2023
  },
  {
    type: 'expense',
    amount: 4800,
    category: 'Marketing',
    description: 'Marketing campaigns',
    month: 'November',
    year: 2023
  },
  {
    type: 'expense',
    amount: 5100,
    category: 'Marketing',
    description: 'Marketing campaigns',
    month: 'December',
    year: 2023
  },
  
  {
    type: 'expense',
    amount: 1200,
    category: 'Salaries',
    description: 'Employee salaries',
    month: 'January',
    year: 2023
  },
  {
    type: 'expense',
    amount: 1200,
    category: 'Salaries',
    description: 'Employee salaries',
    month: 'February',
    year: 2023
  },
  {
    type: 'expense',
    amount: 1200,
    category: 'Salaries',
    description: 'Employee salaries',
    month: 'March',
    year: 2023
  },
  {
    type: 'expense',
    amount: 1200,
    category: 'Salaries',
    description: 'Employee salaries',
    month: 'April',
    year: 2023
  },
  {
    type: 'expense',
    amount: 1200,
    category: 'Salaries',
    description: 'Employee salaries',
    month: 'May',
    year: 2023
  },
  {
    type: 'expense',
    amount: 1200,
    category: 'Salaries',
    description: 'Employee salaries',
    month: 'June',
    year: 2023
  },
  {
    type: 'expense',
    amount: 1200,
    category: 'Salaries',
    description: 'Employee salaries',
    month: 'July',
    year: 2023
  },
  {
    type: 'expense',
    amount: 1200,
    category: 'Salaries',
    description: 'Employee salaries',
    month: 'August',
    year: 2023
  },
  {
    type: 'expense',
    amount: 1200,
    category: 'Salaries',
    description: 'Employee salaries',
    month: 'September',
    year: 2023
  },
  {
    type: 'expense',
    amount: 1200,
    category: 'Salaries',
    description: 'Employee salaries',
    month: 'October',
    year: 2023
  },
  {
    type: 'expense',
    amount: 1200,
    category: 'Salaries',
    description: 'Employee salaries',
    month: 'November',
    year: 2023
  },
  {
    type: 'expense',
    amount: 1200,
    category: 'Salaries',
    description: 'Employee salaries',
    month: 'December',
    year: 2023
  }
];

// Connect to MongoDB
mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB Connection Successful!");
    seedData();
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection Error:", error);
  });

// Seed the database with sample data
async function seedData() {
  try {
    // Clear existing data
    await FinancialData.deleteMany({});
    console.log("Cleared existing financial data");
    
    // Insert sample data
    await FinancialData.insertMany(sampleData);
    console.log(`Successfully seeded ${sampleData.length} financial records`);
    
    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error seeding data:", error);
    mongoose.disconnect();
  }
} 