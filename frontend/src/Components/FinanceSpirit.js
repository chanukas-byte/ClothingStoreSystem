import React, { useState } from "react";
import Papa from "papaparse";
import { FaRobot, FaFileUpload } from "react-icons/fa";
import * as pdfjsLib from "pdfjs-dist";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, Label } from "recharts";

// PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

function analyzeData(data) {
  if (!data || !data.length) return "No data found.";
  let totalBudget = 0, totalActual = 0, overBudget = [];
  data.forEach(row => {
    const budget = Number(row.budget || 0);
    const actual = Number(row.actual || 0);
    totalBudget += budget;
    totalActual += actual;
    if (actual > budget) overBudget.push(row.category || "Unknown");
  });
  let summary = `Total Budget: ${totalBudget}, Total Actual: ${totalActual}. `;
  if (totalActual > totalBudget) summary += "You are over budget overall. ";
  else if (totalActual < totalBudget) summary += "You are under budget overall. ";
  else summary += "You are exactly on budget. ";
  if (overBudget.length) summary += `Over budget in: ${overBudget.join(", ")}.`;
  else summary += "No categories are over budget. Great job!";
  return summary;
}

export default function FinanceSpirit() {
  const [fileName, setFileName] = useState("");
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const handleFile = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setLoading(true);

    if (file.name.endsWith(".csv")) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setLoading(false);
          setData(results.data);
          setInsights(analyzeData(results.data));
        },
        error: () => {
          setLoading(false);
          setInsights("Error reading file.");
        }
      });
    } else if (file.name.endsWith(".pdf")) {
      // PDF parsing
      const reader = new FileReader();
      reader.onload = async function() {
        const typedarray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map(item => item.str).join(" ") + "\n";
        }
        // Try to extract table-like data: category, budget, actual
        // This is a simple regex-based approach; for real-world PDFs, use a more robust parser!
        const rows = text.split("\n").filter(line => /[0-9]/.test(line));
        const parsed = [];
        for (let row of rows) {
          // Example: "Marketing 12000 9000"
          const match = row.match(/([A-Za-z ]+)\s+(\d+)\s+(\d+)/);
          if (match) {
            parsed.push({
              category: match[1].trim(),
              budget: match[2],
              actual: match[3]
            });
          }
        }
        setLoading(false);
        setData(parsed);
        setInsights(analyzeData(parsed));
      };
      reader.readAsArrayBuffer(file);
    } else {
      setLoading(false);
      setInsights("Unsupported file type. Please upload a CSV or PDF.");
    }
  };

  return (
    <div style={{
      maxWidth: 700, margin: "40px auto", background: "#fff", borderRadius: 16,
      boxShadow: "0 4px 24px #0001", padding: 32, textAlign: "center"
    }}>
      <div style={{ fontSize: 48, color: "#a020f0", marginBottom: 16 }}>
        <FaRobot />
      </div>
      <h2>AI Spirit: Financial Insights</h2>
      <p style={{ color: "#666" }}>Upload your budget/report file (CSV or PDF) and let the AI Spirit analyze your finances!</p>
      <label style={{
        display: "inline-block", background: "#f8fafc", borderRadius: 8, padding: "16px 32px",
        cursor: "pointer", margin: "24px 0", border: "2px dashed #a020f0"
      }}>
        <FaFileUpload style={{ marginRight: 8 }} />
        {fileName ? fileName : "Choose CSV or PDF File"}
        <input type="file" accept=".csv,.pdf" style={{ display: "none" }} onChange={handleFile} />
      </label>
      {loading && (
        <div style={{ margin: 16 }}>
          <div className="spinner" style={{ margin: "0 auto", border: "4px solid #eee", borderTop: "4px solid #a020f0", borderRadius: "50%", width: 40, height: 40, animation: "spin 1s linear infinite" }} />
          <div style={{ marginTop: 8 }}>Analyzing...</div>
        </div>
      )}
      {insights && (
        <div style={{
          marginTop: 24, background: "#f3e8ff", borderRadius: 8, padding: 20, color: "#4b006e",
          fontWeight: 500, fontSize: "1.1rem", boxShadow: "0 2px 8px #a020f033"
        }}>
          <strong>Spirit says:</strong> {insights}
        </div>
      )}
      {/* Bar Chart */}
      {data && data.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h4>Budget vs Actual (Bar Chart)</h4>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="category">
                <Label value="Category" offset={-10} position="insideBottom" />
              </XAxis>
              <YAxis>
                <Label value="Amount" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
              </YAxis>
              <Tooltip formatter={(value, name) => [value, name === 'budget' ? 'Budget' : 'Actual']} />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="budget" fill="#60a5fa" name="Budget" radius={[8, 8, 0, 0]} />
              <Bar dataKey="actual" fill="#f87171" name="Actual" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <h4 style={{ marginTop: 32 }}>Budget vs Actual (Scatter Plot)</h4>
          <ResponsiveContainer width="100%" height={320}>
            <ScatterChart margin={{ top: 20, right: 30, left: 10, bottom: 40 }}>
              <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />
              <XAxis dataKey="budget" name="Budget" type="number">
                <Label value="Budget" offset={-10} position="insideBottom" />
              </XAxis>
              <YAxis dataKey="actual" name="Actual" type="number">
                <Label value="Actual" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
              </YAxis>
              <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value, name) => [value, name.charAt(0).toUpperCase() + name.slice(1)]} />
              <Legend verticalAlign="top" height={36} />
              <Scatter name="Categories" data={data} fill="#a020f0" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}
      {/* Spinner keyframes for loading */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}