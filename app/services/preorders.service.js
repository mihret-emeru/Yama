// app/services/preorders.service.js
import api from "../lib/api";

// CREATE preorder (DRAFT)
export const createPreOrder = async (payload) => {
  const res = await api.post("/pre-orders", payload);
  return res.data;
};

// LIST tomorrow preorders
export const getPreOrders = async (status) => {
  const res = await api.get("/pre-orders", {
    params: status ? { status } : {},
  });
  return res.data;
};

// SUBMIT preorder
export const submitPreOrder = async (id) => {
  const res = await api.post(`/pre-orders/${id}/submit`);
  return res.data;
};

// UPDATE preorder (only before approval/lock)
export const updatePreOrder = async (id, payload) => {
  const res = await api.put(`/pre-orders/${id}`, payload);
  return res.data;
};

// APPROVE preorder (PENDING → APPROVED)
export const approvePreOrder = async (id) => {
  const res = await api.post(`/pre-orders/${id}/approve`);
  return res.data;
};
// COMPLETE preorder (APPROVED → COMPLETED)
export const completePreOrder = async (id) => {
  const res = await api.post(`/pre-orders/${id}/complete`);
  return res.data;
};

// CANCEL preorder (DRAFT/PENDING → CANCELLED)
export const cancelPreOrder = async (id) => {
  const res = await api.post(`/pre-orders/${id}/cancel`);
  return res.data;
};
export const getPreOrderById = async (id) => {
  const res = await api.get(`/pre-orders/${id}`);
  return res.data; // assumes backend returns the pre-order object
};

export const getTomorrowPreOrderSummary = async () => {
  const res = await api.get("/pre-orders/tomorrow-summary");
  const d = res.data;

  return {
    totalOrders: Number(d?.totals?.orders_count ?? 0),
    totalQuantity: Array.isArray(d?.breadTotals)
      ? d.breadTotals.reduce((sum, b) => sum + Number(b.total_qty || 0), 0)
      : 0,
    totalAmount: Number(d?.totals?.total_revenue ?? 0),
  };
};
