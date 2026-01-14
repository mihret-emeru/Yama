import api from "../lib/api";

export const getIngredients = async () => {
  const res = await api.get("/ingredients");
  return res.data.ingredients || [];
};

export const createIngredient = async ({ name, base_unit }) => {
  const res = await api.post("/ingredients", {
    name,
    base_unit,
  });
  return res.data;
};
