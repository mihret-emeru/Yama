"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { getTomorrowProductionReport } from "../services/reports.service";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function Analytics() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await getTomorrowProductionReport();
        setReport({
          date: data?.date ?? "",
          totals: data?.totals ?? {},
          breadTotals: data?.breadTotals ?? [],
          ingredients: data?.ingredients ?? [],
          shortages: data?.shortages ?? [],
        });
      } catch (err) {
        console.error("Failed to load report", err);
        setReport({
          date: "",
          totals: {},
          breadTotals: [],
          ingredients: [],
          shortages: [],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading) return <p>Loading report...</p>;

  const breadChartData = {
    labels: report?.breadTotals.map((b) => b.bread_name) || [],
    datasets: [
      {
        label: "Quantity to Produce",
        data: report?.breadTotals.map((b) => b.total_qty) || [],
        backgroundColor: "#4caf50",
      },
    ],
  };

  const ingredientChartData = {
    labels: report?.ingredients.map((i) => i.ingredient_name) || [],
    datasets: [
      {
        label: "Required Quantity",
        data: report?.ingredients.map((i) => i.required_qty) || [],
        backgroundColor: "#2196f3",
      },
    ],
  };

  return (
    <div className="pro">
      <div className="analytics">
        <h1>Tomorrow Production Report</h1>
        <p>Date: {report?.date || "N/A"}</p>
        <div className="order-divider"></div>

        {/* SUMMARY CARDS */}
        <div className="summary-cards">
          <div className="card">
            <div className="emoji-icon">🛒</div>
            <h4>Total Orders</h4>
            <p>{report?.totals?.orders_count ?? 0}</p>
          </div>
          <div className="card">
            <div className="emoji-icon">💰</div>
            <h4>Total revenue</h4>
            <p>{report?.totals?.total_revenue ?? 0} Birr</p>
          </div>
          <div className="card">
            <div className="emoji-icon">❌</div>
            <h4>Unpaid Amount</h4>
            <p>{report?.totals?.unpaid_amount ?? 0} Birr</p>
          </div>
          <div className="card">
            <div className="emoji-icon">📋</div>
            <h4>Bread Types</h4>
            <p>{report?.breadTotals?.length ?? 0}</p>
          </div>
        </div>

        {/* BREAD CHART */}
        <div className="chart-container">
          <h3>Bread Production (Tomorrow)</h3>
          <Bar data={breadChartData} />
        </div>

        {/* INGREDIENT CHART */}
        <div className="chart-container">
          <h3>Ingredient Requirements</h3>
          <Bar data={ingredientChartData} />
        </div>

        {/* SHORTAGES TABLE */}
        <div className="low-stock">
          <h3>Ingredient Shortages</h3>
          {report?.shortages?.length === 0 ? (
            <p>No shortages 🎉</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Ingredient</th>
                  <th>Required</th>
                  <th>Available</th>
                </tr>
              </thead>
              <tbody>
                {report?.shortages.map((s, i) => (
                  <tr key={i}>
                    <td>{s.ingredient_name}</td>
                    <td>
                      {s.required_qty} {s.unit}
                    </td>
                    <td>
                      {s.available_qty} {s.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
