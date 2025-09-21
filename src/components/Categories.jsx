import React, { useState } from "react";
import {
  useGetCategoriesQuery,
  useAddCategoryMutation,
} from "../redux/categoryApi";

const Categories = () => {
  const {
    data: categories = [],
    isLoading,
    isError,
    refetch,
  } = useGetCategoriesQuery();
  const [addCategory] = useAddCategoryMutation();
  const [name, setName] = useState("");

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await addCategory({ name }).unwrap();
      alert("Category added successfully");
      setName("");
      refetch(); // 🔑 force reload categories immediately
    } catch (error) {
      alert("Failed to add category");
      console.error("Failed to add category:", error);
    }
  };

  if (isLoading) return <p>Loading categories...</p>;
  if (isError) return <p style={{ color: "red" }}>Failed to load categories</p>;

  return (
    <div style={{ maxWidth: "500px", margin: "20px auto" }}>
      <h2>Categories</h2>

      <form onSubmit={handleAddCategory} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={name}
          placeholder="Enter category name"
          onChange={(e) => setName(e.target.value)}
          style={{
            padding: "8px",
            marginRight: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 15px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Add
        </button>
      </form>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {categories.map((cat) => (
          <li
            key={cat.id}
            style={{
              background: "#f8f9fa",
              padding: "10px",
              margin: "5px 0",
              borderRadius: "6px",
            }}
          >
            {cat.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
