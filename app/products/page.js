"use client";

import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import { getBreadTypes, createBreadType } from "../services/bread.service";
import {
  getRecipeByBreadId,
  setRecipeForBread,
} from "../services/recipes.service";
import { getIngredients } from "../services/ingredients.service";

export default function ProductPage() {
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);

  const [breads, setBreads] = useState([]);
  const [loading, setLoading] = useState(true);

  const [recipeOpen, setRecipeOpen] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [recipeIngredients, setRecipeIngredients] = useState([]);
  const [selectedBread, setSelectedBread] = useState(null);

  // ---------------- FETCH INGREDIENTS ----------------
  const fetchIngredients = async () => {
    try {
      const data = await getIngredients();
      setIngredients(data);
    } catch (err) {
      console.error("Failed to fetch ingredients", err);
      setIngredients([]);
    }
  };

  useEffect(() => {
    fetchBreads();
    fetchIngredients();
  }, []);

  const fetchBreads = async () => {
    try {
      const data = await getBreadTypes();
      console.log("Breads fetched:", data);
      setBreads(data);
    } catch (err) {
      console.error("Failed to load breads", err);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBreads();
  }, []);

  const filtered = breads.filter((b) => {
    const matchesDate = dateFilter ? b.date === dateFilter : true; // optional if products have date
    const matchesStatus =
      statusFilter === "All" ? true : b.status === statusFilter;
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase());
    return matchesDate && matchesStatus && matchesSearch;
  });

  // ---------------- OPEN RECIPE MODAL (FIXED) ----------------
  const openRecipeModal = async (bread) => {
    const breadTypeId = bread.id ?? bread.breadTypeId;

    if (!breadTypeId) {
      alert("Invalid bread type ID");
      return;
    }

    const normalizedBread = { ...bread, id: breadTypeId };
    setSelectedBread(normalizedBread);

    try {
      const recipe = await getRecipeByBreadId(breadTypeId);
      setRecipeIngredients(recipe);
    } catch (err) {
      // 404 = no recipe yet → NOT an error
      setRecipeIngredients([]);
    }

    setRecipeOpen(true);
  };

  // ---------------- SET RECIPE (FIXED) ----------------
  const handleSetRecipe = async (e) => {
    e.preventDefault();

    if (!selectedBread?.id) {
      alert("Bread type ID missing");
      return;
    }

    const form = e.target;

    const ingredientsPayload = ingredients
      .map((ing) => ({
        ingredientId: ing.id,
        qty_base: Number(form[`qty_${ing.id}`]?.value || 0),
      }))
      .filter((i) => i.qty_base > 0);

    if (ingredientsPayload.length === 0) {
      alert("Please enter quantity for at least one ingredient");
      return;
    }

    try {
      await setRecipeForBread(selectedBread.id, ingredientsPayload);
      alert("Recipe saved successfully!");
      setRecipeOpen(false);
    } catch (err) {
      console.error("Failed to set recipe", err);
      alert("Failed to save recipe");
    }
  };

  // ---------------- ADD PRODUCT ----------------
  const handleAddProduct = async (e) => {
    e.preventDefault();
    const form = e.target;

    const payload = {
      name: form.name.value.trim(),
      gram: Number(form.gram.value),
      price: Number(form.price.value),
    };

    // Check for duplicate
    if (
      breads.some((b) => b.name.toLowerCase() === payload.name.toLowerCase())
    ) {
      alert("Bread type already exists!");
      return;
    }

    try {
      const created = await createBreadType(payload); // ✅ DEFINE IT
      console.log("Created bread:", created);
      await fetchBreads(); // reload table
      setProductOpen(false);
      form.reset();
    } catch (err) {
      console.error("ADD PRODUCT ERROR:", err);
      alert("Failed to add product");
    }
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="pro">
      <div className="container">
        <main className="main-content">
          <h1>Products</h1>
          <p>Track your products</p>
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
              <option>Active</option>
              <option>Out of Stock</option>
            </select>

            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="add-btn" onClick={() => setCategoryOpen(true)}>
            + Add Category
          </button>
          <button className="add-btnn" onClick={() => setProductOpen(true)}>
            + Add Product
          </button>
          <Modal
            open={categoryOpen}
            title="Add New Category"
            onClose={() => setCategoryOpen(false)}
          >
            <input type="text" placeholder="Category Name" />

            <div className="modal-actions">
              <button onClick={() => setCategoryOpen(false)}>Cancel</button>
              <button className="primary">Save Category</button>
            </div>
          </Modal>

          <Modal
            open={productOpen}
            title="Add New Product"
            onClose={() => setProductOpen(false)}
          >
            <form onSubmit={handleAddProduct}>
              <input name="name" placeholder="Product Name" required />

              <input
                name="gram"
                type="number"
                placeholder="Weight (gram)"
                required
              />
              <input
                name="price"
                type="number"
                placeholder="Price (Birr)"
                required
              />

              <div className="modal-actions">
                <button onClick={() => setProductOpen(false)}>Cancel</button>
                <button type="submit" className="primary">
                  Save Product
                </button>
              </div>
            </form>
          </Modal>

          {/* ---------------- RECIPE MODAL ---------------- */}
          <Modal
            open={recipeOpen}
            title={`Set Recipe for ${selectedBread?.name}`}
            onClose={() => setRecipeOpen(false)}
          >
            <form onSubmit={handleSetRecipe}>
              {ingredients.map((ing) => (
                <div key={ing.id} style={{ marginBottom: "8px" }}>
                  <label>{ing.name} (qty_base): </label>
                  <input
                    type="number"
                    name={`qty_${ing.id}`}
                    defaultValue={
                      recipeIngredients.find((r) => r.ingredientId === ing.id)
                        ?.qty_base || ""
                    }
                    placeholder="Quantity"
                    min={0}
                  />
                </div>
              ))}
              <div className="modal-actions">
                <button onClick={() => setRecipeOpen(false)}>Cancel</button>
                <button type="submit" className="primary">
                  Save Recipe
                </button>
              </div>
            </form>
          </Modal>

          {/* Products Table */}
          <h2>Recent Orders</h2>
          <table className="customer-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Weight (g)</th>
                <th>Price (Birr)</th>

                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((b) => (
                <tr key={b.id}>
                  <td>{b.name}</td>
                  <td>{b.gram}</td>
                  <td>{b.price}</td>
                  <td>
                    <button onClick={() => openRecipeModal(b)}>
                      Set Recipe
                    </button>
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
