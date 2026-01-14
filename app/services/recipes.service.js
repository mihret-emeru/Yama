import api from "../lib/api";

// GET active recipe for bread type
export const getRecipeByBreadId = async (breadTypeId) => {
  try {
    const res = await api.get(`/recipes/bread/${breadTypeId}`);
    return res.data.ingredients || [];
  } catch (err) {
    if (err.response?.status === 404) {
      // ✅ No recipe yet → return empty list
      return [];
    }
    throw err; // real error
  }
};

// POST set recipe ✅ FIXED
export const setRecipeForBread = async (breadTypeId, ingredients) => {
  if (!breadTypeId) {
    throw new Error("breadTypeId is required");
  }

  const res = await api.post("/recipes", {
    breadTypeId,
    ingredients,
  });

  return res.data;
};
