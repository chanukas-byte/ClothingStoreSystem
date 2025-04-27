import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, PieChart, Pie, Cell
} from "recharts";
import axios from "axios";

const DEMO_DATA = [
  { category: "Salaries", budget: 40000, actual: 38000 },
  { category: "Supplies", budget: 15000, actual: 17000 },
  { category: "Utilities", budget: 8000, actual: 6000 },
  { category: "Marketing", budget: 12000, actual: 9000 },
  { category: "Other", budget: 5000, actual: 7000 },
];

const PIE_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0"];

export default function BudgetPlanner() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState("Quarterly");
  const [year, setYear] = useState(new Date().getFullYear());
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Adjust this URL to your backend or file location
        let url = `/api/budgets?period=${period.toLowerCase()}&year=${year}`;
        if (categoryFilter) url += `&category=${categoryFilter}`;
        const res = await axios.get(url);
        if (res.data && res.data.length > 0) {
          setCategories(res.data);
        } else {
          setCategories(DEMO_DATA); // fallback to demo data
        }
      } catch (err) {
        setCategories(DEMO_DATA); // fallback to demo data
      }
      setLoading(false);
    }
    fetchData();
  }, [period, year, categoryFilter]);

  // Totals
  const totalBudget = categories.reduce((sum, c) => sum + c.budget, 0);
  const totalActual = categories.reduce((sum, c) => sum + c.actual, 0);

  // Pie chart data
  const pieData = [
    { name: "Budget", value: totalBudget },
    { name: "Actual", value: totalActual }
  ];

  return (
    <div style={{
      maxWidth: 1000, margin: "40px auto", background: "#fff", borderRadius: 16,
      boxShadow: "0 4px 24px #0001", padding: 32
    }}>
      <h2 style={{ textAlign: "center", marginBottom: 16 }}>Budget Planner ({period})</h2>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24, justifyContent: "center" }}>
        <select value={period} onChange={e => setPeriod(e.target.value)} className="form-select" style={{ maxWidth: 140 }}>
          <option>Monthly</option>
          <option>Quarterly</option>
          <option>Yearly</option>
        </select>
        <input
          type="number"
          value={year}
          min="2000"
          max="2100"
          onChange={e => setYear(e.target.value)}
          className="form-control"
          style={{ maxWidth: 100 }}
        />
        <input
          type="text"
          placeholder="Filter by Category"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="form-control"
          style={{ maxWidth: 180 }}
        />
      </div>
      {loading ? (
        <div style={{ textAlign: "center", margin: 40 }}>Loading...</div>
      ) : (
        <>
          <table style={{ width: "100%", marginBottom: 32, borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={{ padding: 10 }}>Category</th>
                <th style={{ padding: 10 }}>Budget</th>
                <th style={{ padding: 10 }}>Actual</th>
                <th style={{ padding: 10 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, idx) => {
                const diff = cat.actual - cat.budget;
                let status = "On Budget", color = "#2563eb";
                if (diff > 0) { status = "Over Budget"; color = "#dc2626"; }
                else if (diff < 0) { status = "Under Budget"; color = "#16a34a"; }
                return (
                  <tr key={cat.category} style={{ background: idx % 2 ? "#f4f4f4" : "#fff" }}>
                    <td style={{ padding: 10 }}>{cat.category}</td>
                    <td style={{ padding: 10 }}>{cat.budget}</td>
                    <td style={{ padding: 10 }}>{cat.actual}</td>
                    <td style={{ padding: 10, color, fontWeight: 600 }}>{status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center", marginBottom: 24 }}>
            <div style={{ flex: 1, minWidth: 320 }}>
              <h5 style={{ textAlign: "center" }}>Budget vs Actual (Bar Chart)</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categories}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="budget" fill="#60a5fa" name="Budget">
                    <LabelList dataKey="budget" position="top" />
                  </Bar>
                  <Bar dataKey="actual" fill="#f87171" name="Actual">
                    <LabelList dataKey="actual" position="top" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: 1, minWidth: 320 }}>
              <h5 style={{ textAlign: "center" }}>Total Budget vs Actual (Pie Chart)</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {pieData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={{
            textAlign: "center", marginTop: 24, color: "#888", fontWeight: 500,
            background: "#f8fafc", borderRadius: 8, padding: 12
          }}>
            <span>Total Budget: <b style={{ color: "#2563eb" }}>{totalBudget}</b> | </span>
            <span>Total Actual: <b style={{ color: "#f87171" }}>{totalActual}</b> | </span>
            <span>
              {totalActual > totalBudget
                ? <span style={{ color: "#dc2626" }}>Over Budget by {totalActual - totalBudget}</span>
                : totalActual < totalBudget
                  ? <span style={{ color: "#16a34a" }}>Under Budget by {totalBudget - totalActual}</span>
                  : <span style={{ color: "#2563eb" }}>On Budget</span>
              }
            </span>
          </div>
        </>
      )}
    </div>
  );
}