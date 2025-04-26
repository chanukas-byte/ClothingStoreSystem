import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Alert,
  Button,
  ButtonGroup,
  Badge,
  Table,
  Form,
  InputGroup,
} from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import {
  FaMoneyBillWave,
  FaChartLine,
  FaChartBar,
  FaChartPie,
  FaDownload,
  FaFilter,
  FaCalendarAlt,
} from "react-icons/fa";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "./FinanceDashboard.css";

const FinanceDashboard = () => {
  const [reports, setReports] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("all"); // all, year, month, week
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [revenueByMonth, setRevenueByMonth] = useState([]);
  const [expensesByMonth, setExpensesByMonth] = useState([]);
  const [profitByMonth, setProfitByMonth] = useState([]);
  const [expenseByCategory, setExpenseByCategory] = useState([]);
  const [profitMargin, setProfitMargin] = useState(0);

  // Colors for charts
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FFC658",
    "#FF7C43",
    "#A4DE6C",
    "#D0EDF7",
  ];

  // Fetch all financial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch reports
        const reportsResponse = await axios.get("http://localhost:4058/api/finance/");
        setReports(reportsResponse.data || []);
        
        // Fetch expenses
        const expensesResponse = await axios.get("http://localhost:4058/api/expenses");
        setExpenses(expensesResponse.data || []);
        
        // Process data
        processFinancialData(reportsResponse.data, expensesResponse.data);
      } catch (err) {
        console.error("Error fetching financial data:", err);
        setError("Failed to load financial data. Please check your connection or try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Process financial data for charts and summaries
  const processFinancialData = (reportsData, expensesData) => {
    if (!reportsData || !expensesData) return;
    
    // Calculate totals
    const revenue = reportsData.reduce((sum, report) => sum + parseFloat(report.revenue || 0), 0);
    const expenses = reportsData.reduce((sum, report) => sum + parseFloat(report.expenses || 0), 0);
    const profit = revenue - expenses;
    
    setTotalRevenue(revenue);
    setTotalExpenses(expenses);
    setTotalProfit(profit);
    setProfitMargin(revenue > 0 ? (profit / revenue) * 100 : 0);
    
    // Group expenses by category
    const categoryMap = {};
    expensesData.forEach(expense => {
      const category = expense.category || "Uncategorized";
      categoryMap[category] = (categoryMap[category] || 0) + parseFloat(expense.amount || 0);
    });
    
    const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value
    }));
    
    setExpenseByCategory(categoryData);
    
    // Group by month for time series
    const monthMap = {};
    reportsData.forEach(report => {
      const month = report.month || "Unknown";
      monthMap[month] = monthMap[month] || { revenue: 0, expenses: 0, profit: 0 };
      monthMap[month].revenue += parseFloat(report.revenue || 0);
      monthMap[month].expenses += parseFloat(report.expenses || 0);
      monthMap[month].profit = monthMap[month].revenue - monthMap[month].expenses;
    });
    
    const monthData = Object.entries(monthMap).map(([month, data]) => ({
      month,
      revenue: data.revenue,
      expenses: data.expenses,
      profit: data.profit
    }));
    
    setRevenueByMonth(monthData);
    setExpensesByMonth(monthData);
    setProfitByMonth(monthData);
  };

  // Filter data based on selected time range
  const getFilteredData = () => {
    if (timeRange === "all") return reports;
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    return reports.filter(report => {
      const reportDate = new Date(report.month);
      const reportYear = reportDate.getFullYear();
      const reportMonth = reportDate.getMonth();
      
      if (timeRange === "year") {
        return reportYear === selectedYear;
      } else if (timeRange === "month") {
        return reportYear === selectedYear && reportMonth === selectedMonth;
      } else if (timeRange === "week") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return reportDate >= oneWeekAgo;
      }
      
      return true;
    });
  };

  // Generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text("Financial Dashboard Report", 20, 20);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Add summary
    doc.setFontSize(16);
    doc.text("Financial Summary", 20, 45);
    
    doc.setFontSize(12);
    doc.text(`Total Revenue: $${totalRevenue.toFixed(2)}`, 20, 55);
    doc.text(`Total Expenses: $${totalExpenses.toFixed(2)}`, 20, 65);
    doc.text(`Total Profit: $${totalProfit.toFixed(2)}`, 20, 75);
    doc.text(`Profit Margin: ${profitMargin.toFixed(2)}%`, 20, 85);
    
    // Add recent reports table
    doc.setFontSize(16);
    doc.text("Recent Financial Reports", 20, 105);
    
    const tableData = reports.slice(0, 10).map(report => [
      report.month,
      `$${parseFloat(report.revenue).toFixed(2)}`,
      `$${parseFloat(report.expenses).toFixed(2)}`,
      `$${parseFloat(report.profitOrLoss).toFixed(2)}`
    ]);
    
    doc.autoTable({
      startY: 115,
      head: [["Month", "Revenue", "Expenses", "Profit/Loss"]],
      body: tableData,
    });
    
    // Save the PDF
    doc.save("financial-dashboard-report.pdf");
  };

  // Render loading state
  if (loading) {
    return (
      <>
        <Header />
        <Container className="dashboard-container">
          <div className="text-center my-5">
            <Spinner animation="border" role="status" variant="primary" />
            <p className="mt-3">Loading financial data...</p>
          </div>
        </Container>
        <Footer />
      </>
    );
  }

  // Render error state
  if (error) {
    return (
      <>
        <Header />
        <Container className="dashboard-container">
          <Alert variant="danger" className="my-5">
            <Alert.Heading>Error</Alert.Heading>
            <p>{error}</p>
          </Alert>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Container fluid className="dashboard-container">
        <Row className="mb-4">
          <Col>
            <h1 className="dashboard-title">
              <FaChartLine className="me-2" />
              Financial Dashboard
            </h1>
          </Col>
          <Col xs="auto">
            <ButtonGroup>
              <Button 
                variant={timeRange === "all" ? "primary" : "outline-primary"}
                onClick={() => setTimeRange("all")}
              >
                All Time
              </Button>
              <Button 
                variant={timeRange === "year" ? "primary" : "outline-primary"}
                onClick={() => setTimeRange("year")}
              >
                Year
              </Button>
              <Button 
                variant={timeRange === "month" ? "primary" : "outline-primary"}
                onClick={() => setTimeRange("month")}
              >
                Month
              </Button>
              <Button 
                variant={timeRange === "week" ? "primary" : "outline-primary"}
                onClick={() => setTimeRange("week")}
              >
                Week
              </Button>
            </ButtonGroup>
            <Button 
              variant="success" 
              className="ms-3"
              onClick={generatePDF}
            >
              <FaDownload className="me-2" />
              Export PDF
            </Button>
          </Col>
        </Row>

        {/* Summary Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="summary-card revenue-card">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-subtitle mb-1">Total Revenue</h6>
                    <h3 className="card-title mb-0">${totalRevenue.toFixed(2)}</h3>
                  </div>
                  <div className="summary-icon">
                    <FaMoneyBillWave />
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="summary-card expense-card">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-subtitle mb-1">Total Expenses</h6>
                    <h3 className="card-title mb-0">${totalExpenses.toFixed(2)}</h3>
                  </div>
                  <div className="summary-icon">
                    <FaMoneyBillWave />
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md={3}>
            <Card className={`summary-card ${totalProfit >= 0 ? 'profit-card' : 'loss-card'}`}>
              <CardBody>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-subtitle mb-1">Total Profit</h6>
                    <h3 className="card-title mb-0">${totalProfit.toFixed(2)}</h3>
                  </div>
                  <div className="summary-icon">
                    <FaChartLine />
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="summary-card margin-card">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-subtitle mb-1">Profit Margin</h6>
                    <h3 className="card-title mb-0">{profitMargin.toFixed(2)}%</h3>
                  </div>
                  <div className="summary-icon">
                    <FaChartPie />
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Charts Row 1 */}
        <Row className="mb-4">
          <Col md={8}>
            <Card className="chart-card">
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Revenue vs Expenses</h5>
                <div>
                  <FaChartBar className="me-2" />
                </div>
              </CardHeader>
              <CardBody>
                <div style={{ height: "300px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={revenueByMonth}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="revenue" name="Revenue" fill="#4CAF50" />
                      <Bar dataKey="expenses" name="Expenses" fill="#F44336" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="chart-card">
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Expenses by Category</h5>
                <div>
                  <FaChartPie className="me-2" />
                </div>
              </CardHeader>
              <CardBody>
                <div style={{ height: "300px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {expenseByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Charts Row 2 */}
        <Row className="mb-4">
          <Col md={6}>
            <Card className="chart-card">
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Profit Trend</h5>
                <div>
                  <FaChartLine className="me-2" />
                </div>
              </CardHeader>
              <CardBody>
                <div style={{ height: "300px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={profitByMonth}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="profit" 
                        name="Profit" 
                        stroke="#2196F3" 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="chart-card">
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Revenue Growth</h5>
                <div>
                  <FaChartLine className="me-2" />
                </div>
              </CardHeader>
              <CardBody>
                <div style={{ height: "300px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={revenueByMonth}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        name="Revenue" 
                        stroke="#4CAF50" 
                        fill="#4CAF50" 
                        fillOpacity={0.3} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Recent Reports Table */}
        <Row className="mb-4">
          <Col>
            <Card className="table-card">
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Financial Reports</h5>
                <Button variant="outline-primary" size="sm">
                  View All
                </Button>
              </CardHeader>
              <CardBody>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Revenue</th>
                      <th>Expenses</th>
                      <th>Profit/Loss</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.slice(0, 5).map((report, index) => (
                      <tr key={index}>
                        <td>{report.month}</td>
                        <td>${parseFloat(report.revenue).toFixed(2)}</td>
                        <td>${parseFloat(report.expenses).toFixed(2)}</td>
                        <td>${parseFloat(report.profitOrLoss).toFixed(2)}</td>
                        <td>
                          <Badge bg={parseFloat(report.profitOrLoss) >= 0 ? "success" : "danger"}>
                            {parseFloat(report.profitOrLoss) >= 0 ? "Profit" : "Loss"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default FinanceDashboard; 