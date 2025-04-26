# Clothing Store Management System

A comprehensive management system for clothing stores with inventory, finance, and employee management.

## Features

- **Financial Dashboard**: Visualize revenue, expenses, and financial metrics
- **Inventory Management**: Track products, categories, and stock levels
- **Employee Management**: Manage employee information and roles
- **Supplier Management**: Track suppliers and their products

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```
git clone <repository-url>
cd ClothingStoreSystem
```

2. Install dependencies for both frontend and backend
```
# Install backend dependencies
cd BACKEND
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables
Create a `.env` file in the BACKEND directory with the following variables:
```
MONGODB_URL=mongodb://localhost:27017/clothing-store
PORT=4058
```

4. Seed the database with sample data
```
cd BACKEND
npm run seed
```

5. Start the backend server
```
cd BACKEND
npm run dev
```

6. Start the frontend development server
```
cd frontend
npm start
```

7. Access the application
Open your browser and navigate to `http://localhost:3000`

## Project Structure

- **frontend/**: React frontend application
- **BACKEND/**: Node.js and Express backend API
  - **Controllers/**: API controllers
  - **Models/**: MongoDB models
  - **Routes/**: API routes
  - **scripts/**: Utility scripts

## Technologies Used

- **Frontend**: React, Material-UI, Chart.js
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT
