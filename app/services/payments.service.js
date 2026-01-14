import api from "../lib/api";

// Record a payment
export const createPayment = async (payload) => {
  const res = await api.post("/payments", payload);
  return res.data;
};

// Get payments for a specific preorder
export const getPaymentsByPreOrderId = async (preOrderId) => {
  const res = await api.get(`/payments/${preOrderId}`);
  return res.data;
};

export const getAllPayments = async () => {
  const res = await api.get("/payments/all"); // or whatever your backend supports
  return res.data;
};
