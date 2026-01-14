"use client";

import { useState } from "react";

import Modal from "../components/Modal";
export default function OrderPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    customer: "Walk-in", // default
    category: "",
    product: "",
    quantity: 1,
  });

  // Handle input change
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Handle form submit
  const handleSave = () => {
    console.log("Saved preorder:", formData);
    // Here you can call API to save the preorder
    setOpen(false);
    // Reset form
    setFormData({
      customer: "Walk-in",
      category: "",
      product: "",
      quantity: 1,
    });
  };

  const customers = [
    { id: 1, name: "John D." },
    { id: 2, name: "Selam W." },
    { id: 3, name: "Abel T." },
  ];

  const orders = [
    {
      id: "01",
      client: "Lala",
      date: "01/04/2025",
      product: "Blackforest",
      quantity: 5,
      status: "Pending",
    },
    {
      id: "02",
      client: "Papa",
      date: "11/04/2025",
      product: "Bun",
      quantity: 10,
      status: "Completed",
    },
  ];

  return (
    <div className="pro">
      <div className="container">
        <main className="main-content">
          <h1>Order</h1>
          <p>Keep track of all customer orders</p>
          <div className="order-divider"></div>

          <div className="filters">
            <input type="date" />
            <select>
              <option>All</option>
              <option>Pending</option>
              <option>Completed</option>
            </select>

            <input
              type="text"
              placeholder="Search by customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn" onClick={() => setOpen(true)}>
            + Add order
          </button>

          <Modal
            open={open}
            title="Add New Preorder"
            onClose={() => setOpen(false)}
          >
            <div className="modal-form">
              {/* Customer select */}
              <div className="form-group">
                <label>Customer</label>
                <select
                  value={formData.customer}
                  onChange={(e) => handleChange("customer", e.target.value)}
                >
                  <option value="Walk-in">Walk-in</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  placeholder="Enter category"
                />
              </div>

              {/* Product */}
              <div className="form-group">
                <label>Product</label>
                <input
                  type="text"
                  value={formData.product}
                  onChange={(e) => handleChange("product", e.target.value)}
                  placeholder="Enter product"
                />
              </div>

              {/* Quantity */}
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleChange("quantity", e.target.value)}
                  min="1"
                />
              </div>

              {/* Buttons */}
              <div className="modal-buttons">
                <button className="btn cancel" onClick={() => setOpen(false)}>
                  Cancel
                </button>
                <button className="btn save" onClick={handleSave}>
                  Save
                </button>
              </div>
            </div>
          </Modal>

          <h2>Recent Orders</h2>
          <table className="order-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Client Name</th>
                <th>Date</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.client}</td>
                  <td>{order.date}</td>
                  <td>{order.product}</td>
                  <td>{order.quantity}</td>
                  <td>{order.status}</td>
                  <td>
                    <button>Edit</button>
                    <button>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal for New Order 
        <Modal
          title="New Order"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <form className="modal-form">
            <input type="text" placeholder="Client Name" />
            <input type="date" />
            <input type="text" placeholder="Category" />
            <input type="number" placeholder="Quantity" />
            <div className="modal-buttons">
              <button type="submit">Add Order</button>
              <button type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
            </div>
          </form>
        </Modal>
         */}
        </main>
      </div>
    </div>
  );
}
