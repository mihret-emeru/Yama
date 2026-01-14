"use client";

import { useState } from "react";
import Preorder from "../preorder/page";

export default function OrderHistory() {
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  const orders = [
    {
      id: "01",
      client: "Lala",
      date: "2025-04-01",
      ordertype: "Preorder",
      category: "Cake",
      qty: 5,
      status: "Pending",
    },
    {
      id: "02",
      client: "Papa",
      date: "2025-04-11",
      ordertype: "order",
      category: "Bread",
      qty: 10,
      status: "Completed",
    },
    {
      id: "03",
      client: "Marta",
      date: "2025-04-12",
      ordertype: "Preorder",
      category: "Cake",
      qty: 3,
      status: "Cancelled",
    },
  ];

  // Filtered results
  const filtered = orders.filter((o) => {
    const matchesDate = dateFilter ? o.date === dateFilter : true;
    const matchesStatus =
      statusFilter === "All" ? true : o.status === statusFilter;
    const matchesSearch = o.client.toLowerCase().includes(search.toLowerCase());
    return matchesDate && matchesStatus && matchesSearch;
  });

  return (
    <div className="pro">
      <div className="container">
        <main className="main-content">
          <h1>Order History</h1>
          <p>View detailed order history for any date</p>
          <div className="order-divider"></div>
          {/* Top Cards */}
          <div className="ocards">
            <div className="ocard">
              <div className="emoji-icon">🛒</div>
              <h3>Total Orders</h3>
              <p>{orders.length}</p>
            </div>

            <div className="ocard">
              <div className="emoji-icon">⏳</div>
              <h3>Pending Orders</h3>
              <p>{orders.filter((o) => o.status === "Pending").length}</p>
            </div>

            <div className="ocard">
              <div className="emoji-icon">❌</div>
              <h3>Cancelled Orders</h3>
              <p>{orders.filter((o) => o.status === "Cancelled").length}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="filters">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All</option>
              <option>Pending</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>

            <input
              type="text"
              placeholder="Search by client name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Recent Orders Table */}
          <h2>Recent Orders</h2>
          <table className="order-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Client Name</th>
                <th>Date</th>
                <th>Ordertype</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.client}</td>
                  <td>{o.ordertype}</td>
                  <td>{o.date}</td>
                  <td>{o.category}</td>
                  <td>{o.qty}</td>
                  <td>{o.status}</td>
                  <td>
                    <button>Viewdetails</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}
