"use client";

import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import {
  getIngredients,
  createIngredient,
} from "../services/ingredients.service";
import { restockIngredient } from "../services/stock.service";

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [addOpen, setAddOpen] = useState(false);
  const [restockOpen, setRestockOpen] = useState(false);

  /* ---------------- FILTER STATES ---------------- */
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [newItem, setNewItem] = useState({
    name: "",
    base_unit: "g",
  });

  const [restock, setRestock] = useState({
    ingredientId: "",
    qty: "",
    unit: "kg",
    reason: "New purchase",
  });

  // 🔹 Fetch ingredients on load
  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      setLoading(true);
      const data = await getIngredients();
      setItems(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load ingredients");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FILTER LOGIC ---------------- */
  const filteredItems = items.filter((item) => {
    // 🔍 Search by ID or Name
    const matchesSearch = search
      ? item.id.toString().includes(search) ||
        item.name.toLowerCase().includes(search.toLowerCase())
      : true;

    // 📦 Stock Status Filter
    const qty = Number(item.available_qty);

    const matchesStatus =
      statusFilter === "All"
        ? true
        : statusFilter === "IN_STOCK"
        ? qty > 5
        : statusFilter === "LOW_STOCK"
        ? qty > 0 && qty <= 5
        : statusFilter === "OUT_OF_STOCK"
        ? qty === 0
        : true;

    // 📅 Date filter (created_at)
    const matchesDate = dateFilter
      ? item.created_at?.slice(0, 10) === dateFilter
      : true;

    return matchesSearch && matchesStatus && matchesDate;
  });

  // 🔹 Add ingredient
  const handleAddItem = async () => {
    if (!newItem.name || !newItem.base_unit) {
      alert("Name and unit required");
      return;
    }

    try {
      await createIngredient(newItem);
      setAddOpen(false);
      setNewItem({ name: "", base_unit: "g" });
      fetchIngredients();
    } catch (err) {
      console.error(err);
      alert("Ingredient already exists or invalid");
    }
  };

  // 🔹 Restock
  const handleRestock = async () => {
    if (!restock.ingredientId || !restock.qty) {
      alert("Select ingredient and quantity");
      return;
    }

    try {
      await restockIngredient({
        ...restock,
        ingredientId: Number(restock.ingredientId),
        qty: Number(restock.qty),
      });
      setRestockOpen(false);
      setRestock({
        ingredientId: "",
        qty: "",
        unit: "kg",
        reason: "New purchase",
      });
    } catch (err) {
      console.error(err);
      alert("Restock failed");
    }
  };

  return (
    <div className="pro">
      <div className="container">
        <main className="main-content">
          <h1>Inventory</h1>
          <div className="order-divider"></div>
          {/* Filters */}
          <div className="filters">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />

            <input
              type="text"
              placeholder="Search by ID or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="IN_STOCK">In Stock</option>
              <option value="LOW_STOCK">Low Stock</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
          </div>

          <button className="add-item" onClick={() => setAddOpen(true)}>
            + Add Ingredient
          </button>
          <button className="restock-btn" onClick={() => setRestockOpen(true)}>
            Restock
          </button>

          {/* ADD MODAL */}
          <Modal
            open={addOpen}
            title="Add Ingredient"
            onClose={() => setAddOpen(false)}
          >
            <input
              placeholder="Ingredient name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <input
              placeholder="Base unit (g, kg, l)"
              value={newItem.base_unit}
              onChange={(e) =>
                setNewItem({ ...newItem, base_unit: e.target.value })
              }
            />

            <div className="modal-actions">
              <button onClick={() => setAddOpen(false)}>Cancel</button>
              <button className="primary" onClick={handleAddItem}>
                Save
              </button>
            </div>
          </Modal>

          {/* RESTOCK MODAL */}
          <Modal
            open={restockOpen}
            title="Restock"
            onClose={() => setRestockOpen(false)}
          >
            <select
              value={restock.ingredientId}
              onChange={(e) =>
                setRestock({ ...restock, ingredientId: e.target.value })
              }
            >
              <option value="">Select Ingredient</option>
              {items.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Quantity"
              value={restock.qty}
              onChange={(e) => setRestock({ ...restock, qty: e.target.value })}
            />

            <div className="modal-actions">
              <button onClick={() => setRestockOpen(false)}>Cancel</button>
              <button className="primary" onClick={handleRestock}>
                Update
              </button>
            </div>
          </Modal>

          {/* TABLE */}
          <h2>Ingredients</h2>
          <table className="customer-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Base Unit</th>
                <th>Available Qty</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4">Loading...</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="4">No ingredients</td>
                </tr>
              ) : (
                filteredItems.map((i) => (
                  <tr key={i.id}>
                    <td>{i.id}</td>
                    <td>{i.name}</td>
                    <td>{i.base_unit}</td>
                    <td>{i.available_qty}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}
