import api from "../lib/api";

// Get all customers

export const getCustomers = async () => {
  try {
    const res = await api.get("/customers"); // GET /api/v1/customers
    console.log("getCustomers response:", res.data);

    // The API returns { customers: [...] }
    const customers = res.data.customers || [];

    // Map API response to include needed frontend fields
    return customers.map((c) => ({
      id: c.id,
      full_name: c.full_name,
      phone: c.phone,
      address: c.address,
      note: c.note,
      is_active: c.is_active,
      created_at: c.created_at,
      type: c.note, // use note as Customer Type
      totalOrders: c.totalOrders ?? 0, // default to 0
    }));
  } catch (err) {
    console.error("Error fetching customers:", err.response?.data || err);
    return []; // return empty array on error
  }
};

// Create a new customer
export const createCustomer = async (payload) => {
  try {
    const res = await api.post("/customers", payload);
    return res.data.customer || res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to create customer");
  }
};

// Activate / deactivate a customer
export const toggleCustomerActive = async (id, isActive) => {
  try {
    const response = await api.patch(`/customers/${id}/active`, {
      is_active: isActive,
    });
    return response.data;
  } catch (error) {
    console.error("Toggle Customer Error:", error.response?.data || error);
    throw new Error(
      error.response?.data?.message || "Failed to update customer status"
    );
  }
};
