// app/services/reports.service.js
import api from "../lib/api";

export const getTomorrowProductionReport = async () => {
  try {
    const res = await api.get("/reports/tomorrow-production");
    return res.data;
  } catch (err) {
    console.error(
      "REPORT API ERROR:",
      err.response?.status,
      err.response?.data || err.message
    );
    // Return safe fallback so frontend doesn't crash
    return {
      date: "",
      totals: { orders_count: 0, total_revenue: 0, unpaid_amount: 0 },
      breadTotals: [],
      ingredients: [],
      shortages: [],
    };
  }
};
