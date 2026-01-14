import api from "../lib/api";

export const getStock = async () => {
  const res = await api.get("/stock");
  return res.data || [];
};

export const restockIngredient = async ({
  ingredientId,
  qty,
  unit,
  reason,
}) => {
  const res = await api.post("/stock/restock", {
    ingredientId,
    qty,
    unit,
    reason,
  });
  return res.data;
};
