"use client";

import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import {
  createPayment,
  getPaymentsByPreOrderId,
} from "../services/payments.service";

export default function PaymentPage() {
  const [open, setOpen] = useState(false);

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  // Payment form data
  const [formData, setFormData] = useState({
    preOrderId: "",
    amount: "",
    method: "CASH",
    reference: "",
    note: "",
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Fetch payments for a preorder
  const fetchPayments = async (preOrderId) => {
    if (!preOrderId) return;
    setLoading(true);
    try {
      const data = await getPaymentsByPreOrderId(preOrderId);
      setPayments(Array.isArray(data?.payments) ? data.payments : []);
    } catch (err) {
      console.error(err);
      setPayments([]);
      alert("Invalid Pre-order ID or no payments found");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // AUTO FETCH ON ID CHANGE
  // =========================
  useEffect(() => {
    if (formData.preOrderId) {
      fetchPayments(formData.preOrderId);
    }
  }, [formData.preOrderId]);

  // Record payment
  const handleRecordPayment = async () => {
    const { preOrderId, amount, method, reference, note } = formData;

    if (!preOrderId) return alert("Enter Pre-order ID");
    if (!amount || amount <= 0) return alert("Enter valid amount");

    const payload = {
      preOrderId: Number(preOrderId),
      amount: Number(amount),
      method,
      reference,
      note,
    };
    console.log("PAYMENT PAYLOAD:", payload);
    try {
      await createPayment(payload);

      alert("Payment recorded ✅");

      fetchPayments(preOrderId);

      setFormData({
        ...formData,
        amount: "",
        reference: "",
        note: "",
      });

      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to record payment");
    }
  };

  // Filters
  const filtered = payments.filter((p) => {
    const matchesDate = dateFilter ? p.date?.slice(0, 10) === dateFilter : true;

    const matchesStatus =
      statusFilter === "All"
        ? true
        : p.status?.toUpperCase() === statusFilter.toUpperCase();

    const matchesSearch = search
      ? p.customerName?.toLowerCase().includes(search.toLowerCase())
      : true;

    return matchesDate && matchesStatus && matchesSearch;
  });

  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const totalPending = 0;
  return (
    <div className="pro">
      <div className="container">
        <main className="main-content">
          <h1>Payments</h1>
          <p> Review all payments</p>
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
              <option>Paid</option>
              <option>Pending</option>
            </select>

            <input
              type="text"
              placeholder="Search by customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Middle Cards */}
          <div className="pcards">
            <div className="pcard">
              <div className="emoji-icon">✅</div>
              <h3>Total paid</h3>
              <p>{totalPaid} ETB</p>
            </div>

            <div className="pcard">
              <div className="emoji-icon">⏳</div>
              <h3>Total pending</h3>
              <p>{totalPending} ETB</p>
            </div>
          </div>
          <button className="btn" onClick={() => setOpen(true)}>
            + payment
          </button>
          {/* Modal for Record Payment */}
          <Modal
            open={open}
            title="Record Payment"
            onClose={() => setOpen(false)}
          >
            <div className="modal-form">
              {/* Pre-order ID */}
              <div className="form-group">
                <label>Pre-order ID</label>
                <input
                  type="number"
                  value={formData.preOrderId}
                  onChange={(e) => handleChange("preOrderId", e.target.value)}
                />
              </div>

              {/* Amount */}
              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  min="1"
                  value={formData.amount}
                  onChange={(e) => handleChange("amount", e.target.value)}
                />
              </div>

              {/* Method */}
              <div className="form-group">
                <label>Method</label>
                <select
                  value={formData.method}
                  onChange={(e) => handleChange("method", e.target.value)}
                >
                  <option value="CASH">Cash</option>
                  <option value="CARD">Card</option>
                  <option value="MOBILE_MONEY">Mobile Money</option>
                </select>
              </div>

              {/* Reference */}
              <div className="form-group">
                <label>Reference</label>
                <input
                  type="text"
                  value={formData.reference}
                  onChange={(e) => handleChange("reference", e.target.value)}
                />
              </div>

              {/* Note */}
              <div className="form-group">
                <label>Note</label>
                <input
                  type="text"
                  value={formData.note}
                  onChange={(e) => handleChange("note", e.target.value)}
                />
              </div>

              <div className="modal-buttons">
                <button onClick={() => setOpen(false)}>Cancel</button>
                <button
                  type="submit"
                  className="primary"
                  onClick={handleRecordPayment}
                >
                  Record Payment
                </button>
              </div>
            </div>
          </Modal>

          {/* Payments Table */}
          <h2>Payments</h2>
          <table className="payment-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Received By</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6">Loading...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6">No payments</td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.received_by}</td>
                    <td>{p.method}</td>
                    <td>{p.amount}</td>
                    <td>PAID</td>
                    <td>{p.received_at?.slice(0, 10)}</td>
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
