"use client";
import { useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  // Mock summary data
  const summary = [
    { title: "Total Orders", value: 120, icon: "🛒" },
    { title: "Total Sales", value: 4500, icon: "💰" },
    { title: "Total Customers", value: 80, icon: "👥" },
    { title: "Low Stock", value: 5, icon: "⚠️" },
  ];

  // Mock recent orders
  const recentOrders = [
    {
      Orderid: 1,
      Client: "John D.",
      Ordertype: "preorder",
      Category: "Cake",

      status: "Pending",
    },
    {
      Orderid: 2,
      Client: "Mary A.",
      Ordertype: "order",
      Category: "Bread",

      status: "Completed",
    },
    {
      Orderid: 3,
      Client: "Ali S.",
      Ordertype: "preorder",
      Category: "Cake",
      status: "Preparing",
    },
  ];

  // Mock sales data
  const salesData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Sales ($)",
        data: [120, 150, 80, 200, 170, 90, 220],
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.3,
      },
    ],
  };

  // Mock top products
  const topProducts = {
    labels: ["Croissant", "Cake", "Bread", "Muffin", "Pie"],
    datasets: [
      {
        label: "Units Sold",
        data: [50, 30, 40, 20, 15],
        backgroundColor: [
          "#4caf50",
          "#2196f3",
          "#ff9800",
          "#f44336",
          "#9c27b0",
        ],
      },
    ],
  };

  return (
    <div className="dashboard">
      <h1>Overview</h1>
      <p>Welcome back to your bakery dashboard</p>
      <div className="dashboard-divider"></div>
      {/* Summary Cards */}
      <div className="summary-cards">
        {summary.map((item, index) => (
          <div key={index} className="card">
            <div
              className="stat-icon"
              style={{ background: item.color + "20" }}
            >
              <span style={{ color: item.color }}>{item.icon}</span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts">
        <div className="chart-container">
          <h3>Weekly Sales</h3>
          <Line data={salesData} />
        </div>
        <div className="chart-container">
          <h3>Top Selling Products</h3>
          <Bar data={topProducts} />
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="recent-orders">
        <h3>Recent Orders</h3>
        <table>
          <thead>
            <tr>
              <th>Orderid</th>
              <th>Client</th>
              <th>Ordertype</th>
              <th>Category</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order, index) => (
              <tr key={`${order.Orderid}-${index}`}>
                <td>{order.Orderid}</td>
                <td>{order.Client}</td>
                <td>{order.Ordertype}</td>
                <td>{order.Category}</td>
                <td>{order.status}</td>
                <td>
                  <button>View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
