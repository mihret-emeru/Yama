import api from "../lib/api";

// GET all bread types
// GET bread types
export const getBreadTypes = async () => {
  const res = await api.get("/bread-types");

  console.log("RAW bread API response:", res.data);

  // ✅ handle both possible backend formats
  return Array.isArray(res.data.breads) ? res.data.breads : [];
};

// CREATE bread type
export const createBreadType = async (data) => {
  const res = await api.post("/bread-types", {
    name: data.name,
    gram: Number(data.gram),
    price: Number(data.price),
  });
  return res.data;
};
