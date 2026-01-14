"use client";
import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import {
  createPreOrder,
  getPreOrders,
  submitPreOrder,
  approvePreOrder,
  completePreOrder,
  cancelPreOrder,
  getTomorrowPreOrderSummary,
} from "../services/preorders.service";
import { updatePreOrder } from "../services/preorders.service";
import { getBreadTypes } from "../services/bread.service";
export default function Preorder() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [tomorrowSummary, setTomorrowSummary] = useState(null);

  const [orders, setOrders] = useState([]);
  const [breads, setBreads] = useState([]);
  const [formData, setFormData] = useState({
    customerId: 1,
    breadTypeId: "",
    quantity: 1,
    unitPrice: 0,
  });

  // Load data
  useEffect(() => {
    fetchOrders();
    fetchBreads();
    fetchTomorrowSummary(); // ✅ ADD
  }, []);

  const filteredOrders = orders.filter((o) => {
    // Filter by search (order ID)
    const matchesSearch = search
      ? o.id.toString().includes(search.toString())
      : true;

    // Filter by status
    const matchesStatus =
      filterStatus === "All"
        ? true
        : o.status.toUpperCase() === filterStatus.toUpperCase();

    // Filter by date (order_for_date)
    const matchesDate = filterDate
      ? o.order_for_date?.slice(0, 10) === filterDate
      : true;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const fetchOrders = async () => {
    try {
      const data = await getPreOrders();
      console.log("RAW preorders response:", data);

      // ✅ FIX HERE
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (err) {
      console.error("Failed to fetch preorders", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBreads = async () => {
    const data = await getBreadTypes();
    setBreads(data || []);
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // SAVE preorder
  const handleSave = async () => {
    const payload = {
      customerId: Number(formData.customerId),
      paymentStatus: "UNPAID",
      items: [
        {
          breadTypeId: Number(formData.breadTypeId),
          quantity: Number(formData.quantity),
          unitPrice: Number(formData.unitPrice),
        },
      ],
    };

    console.log("CREATE PREORDER PAYLOAD:", payload);

    // 🔴 Frontend validation
    if (
      !payload.customerId ||
      !payload.items[0].breadTypeId ||
      payload.items[0].quantity <= 0 ||
      payload.items[0].unitPrice <= 0
    ) {
      alert("Please fill all required fields correctly");
      return;
    }

    try {
      await createPreOrder(payload);
      await fetchOrders(); // reload table
      setOpen(false);
    } catch (err) {
      console.error(
        "CREATE PREORDER ERROR:",
        err.response?.data || err.message
      );
      alert("Failed to create preorder");
    }
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        paymentStatus: "PAID",
        items: [
          {
            breadTypeId: Number(formData.breadTypeId),
            quantity: Number(formData.quantity),
            unitPrice: Number(formData.unitPrice),
          },
        ],
      };

      console.log("UPDATE PAYLOAD:", payload);

      await updatePreOrder(selectedOrderId, payload);

      alert("Pre-order updated successfully ✅");

      fetchOrders(); // refresh list
    } catch (err) {
      console.error(
        "UPDATE PREORDER ERROR:",
        err.response?.data || err.message
      );
    }
  };

  // ---------- Actions ----------
  const handleSubmit = async (id) => {
    try {
      await submitPreOrder(id);
      await fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approvePreOrder(id);
      await fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleComplete = async (id) => {
    try {
      await completePreOrder(id);
      await fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelPreOrder(id);
      await fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTomorrowSummary = async () => {
    try {
      const data = await getTomorrowPreOrderSummary();
      console.log("Tomorrow summary:", data);
      setTomorrowSummary(data);
    } catch (err) {
      console.error("Failed to fetch tomorrow summary", err);
      setTomorrowSummary(null);
    }
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="pro">
      <div className="container">
        <main className="main-content">
          <h1>PreOrder</h1>
          <p>
            Keep track of all customer customized orders, including special
            requests and modifications
          </p>
          <div className="order-divider"></div>
          <div className="filters">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option>All</option>
              <option>Draft</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>

            <input
              type="number"
              placeholder="Search by id..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn" onClick={() => setOpen(true)}>
            + Add pre-order
          </button>

          <button className="btn" onClick={() => setOpen(true)}>
            Update Pre-order
          </button>

          {/* preorder Cards */}
          <div className="pcards">
            <div className="pcard">
              <div className="emoji-icon">✅</div>
              <h3>Total orders</h3>
              <p>{tomorrowSummary?.totalOrders || 0}</p>
            </div>

            <div className="pcard">
              <div className="emoji-icon">⏳</div>
              <h3>Total quantity</h3>
              <p>{tomorrowSummary?.totalQuantity || 0}</p>
            </div>

            <div className="pcard">
              <div className="emoji-icon">⏳</div>
              <h3>Total amount</h3>
              <p>{tomorrowSummary?.totalAmount || 0} Birr</p>
            </div>
          </div>

          {/* MODAL */}
          <Modal
            open={open}
            title="Add Pre-order"
            onClose={() => setOpen(false)}
          >
            <div className="modal-form">
              {/* Customer */}
              <div className="form-group">
                <label>Customer ID</label>
                <input
                  type="number"
                  value={formData.customerId}
                  onChange={(e) => handleChange("customerId", e.target.value)}
                />
              </div>

              {/* Bread */}
              <div className="form-group">
                <label>Bread Type</label>
                <select
                  value={formData.breadTypeId}
                  onChange={(e) => handleChange("breadTypeId", e.target.value)}
                >
                  <option value="">Select bread</option>
                  {breads.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => handleChange("quantity", e.target.value)}
                />
              </div>

              {/* Unit Price */}
              <div className="form-group">
                <label>Unit Price</label>
                <input
                  type="number"
                  min="0"
                  value={formData.unitPrice}
                  onChange={(e) => handleChange("unitPrice", e.target.value)}
                />
              </div>

              <div className="modal-buttons">
                <button onClick={() => setOpen(false)}>Cancel</button>
                <button type="submit" className="primary" onClick={handleSave}>
                  Save
                </button>
              </div>
            </div>
          </Modal>

          {/* TABLE */}
          <table className="order-table">
            <thead>
              <tr>
                <th>ID</th>

                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>

                  <td>{o.status}</td>
                  <td>
                    {o.status === "DRAFT" && (
                      <>
                        <button onClick={() => handleSubmit(o.id)}>
                          Submit
                        </button>
                        <button onClick={() => handleCancel(o.id)}>
                          Cancel
                        </button>
                      </>
                    )}
                    {o.status === "PENDING" && (
                      <>
                        <button onClick={() => handleApprove(o.id, o.status)}>
                          Approve
                        </button>

                        <button onClick={() => handleCancel(o.id)}>
                          Cancel
                        </button>
                      </>
                    )}
                    {o.status === "APPROVED" && (
                      <button onClick={() => handleComplete(o.id)}>
                        Complete
                      </button>
                    )}
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
