"use client";

import { useState, useEffect } from "react";
import Modal from "../components/Modal";
import { getCustomers, createCustomer } from "../services/customers.service";

export default function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true); // tracks API loading

  const [addCustomerOpen, setAddCustomerOpen] = useState(false);

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      console.log("🔥 fetchCustomers CALLED");

      try {
        const data = await getCustomers();
        console.log("✅ Customers from API:", data);
        setCustomers(data);
      } catch (err) {
        console.error("❌ Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Filtered customers
  const filtered = customers.filter((c) => {
    if (!c || !c.full_name) return false; // skip invalid entries

    const matchesDate = dateFilter
      ? c.created_at?.slice(0, 10) === dateFilter
      : true;

    const matchesStatus =
      statusFilter === "All"
        ? true
        : (c.is_active ? "Active" : "Inactive") === statusFilter;

    const matchesSearch = c.full_name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesDate && matchesStatus && matchesSearch;
  });

  // Counts
  const activeCount = customers.filter((c) => c?.is_active).length;
  const inactiveCount = customers.filter((c) => c && !c.is_active).length;

  // Add customer
  const handleAddCustomer = async (e) => {
    e.preventDefault();
    const form = e.target;
    const newCustomer = {
      full_name: form.full_name.value,
      phone: form.phone.value,
      address: form.address.value,
      note: form.note.value || "",
    };

    try {
      const created = await createCustomer(newCustomer);

      // Map API response to frontend structure
      const mappedCustomer = {
        id: created.id ?? Math.random().toString(36).substr(2, 9), // fallback if no id
        full_name: created.full_name || created.name,
        phone: created.phone,
        address: created.address,
        note: created.note,
        is_active: created.is_active ?? true,
        created_at: created.created_at || new Date().toISOString(),
        type: created.type || "N/A",
        totalOrders: created.totalOrders || 0,
      };

      setCustomers((prev) => [...prev, mappedCustomer]);
      setAddCustomerOpen(false);
      form.reset();
    } catch (err) {
      alert(err.message || "Failed to add customer.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="pro">
      <div className="container">
        <main className="main-content">
          <h1>Customers</h1>
          <p> Monitor all your bakery customers</p>
          <div className="order-divider"></div>

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
              <option>Active</option>
              <option>Inactive</option>
            </select>

            <input
              type="text"
              placeholder="Search customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="add-btn"
            onClick={() => setAddCustomerOpen(true)}
          >
            + Add Customer
          </button>

          <Modal
            open={addCustomerOpen}
            title="Add New Customer"
            onClose={() => setAddCustomerOpen(false)}
          >
            <form onSubmit={handleAddCustomer}>
              <input name="full_name" type="text" placeholder="Customer Name" />
              <input name="address" type="text" placeholder="Address" />
              <input name="phone" type="tel" placeholder="Phone Number" />
              <input name="note" type="text" placeholder="Note" />

              <select name="status" defaultValue="Active">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <div className="modal-actions">
                <button onClick={() => setAddCustomerOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary">
                  Save Customer
                </button>
              </div>
            </form>
          </Modal>

          {/* Middle Cards */}
          <div className="ccards">
            <div className="ccard">
              <div className="emoji-icon">🟢</div>
              <h3>Active Customers</h3>
              <p>{activeCount}</p>
            </div>

            <div className="ccard">
              <div className="emoji-icon">⛔ </div>
              <h3>Inactive Customers</h3>
              <p>{inactiveCount}</p>
            </div>
          </div>

          {/* Customer Table */}
          <h2>Customer List</h2>
          <table className="customer-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Customer Type</th>
                <th>Total Orders</th>
                <th>Registered Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, index) => (
                <tr key={c.id || index}>
                  <td>{c?.full_name}</td>
                  <td>{c?.phone}</td>
                  <td>{c.type}</td>
                  <td>{c.totalOrders}</td>
                  <td>{c?.created_at?.slice(0, 10)}</td>
                  <td>{c?.is_active ? "Active" : "Inactive"}</td>
                  <td>
                    <button>Details</button>
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
