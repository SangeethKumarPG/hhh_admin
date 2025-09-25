import React, { useState } from "react";
import {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../redux/categoryApi";

const Categories = () => {
  const {
    data: categories = [],
    isLoading,
    isError,
    refetch,
  } = useGetCategoriesQuery();

  const [addCategory] = useAddCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState(null);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image);

    try {
      await addCategory(formData).unwrap();
      alert("Category added successfully");
      setName("");
      setImage(null);
      refetch(); // 🔑 refresh list immediately
    } catch (error) {
      alert("Failed to add category");
      console.error(error);
    }
  };

  const handleUpdateCategory = async (id) => {
    const formData = new FormData();
    formData.append("name", editName);
    if (editImage) formData.append("image", editImage);

    try {
      await updateCategory({ id, formData }).unwrap();
      alert("Category updated successfully");
      setEditId(null);
      setEditName("");
      setEditImage(null);
      refetch(); // 🔑 refresh list immediately
    } catch (error) {
      alert("Failed to update category");
      console.error(error);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory(id).unwrap();
      alert("Category deleted successfully");
      refetch(); // 🔑 refresh list immediately
    } catch (error) {
      alert("Failed to delete category");
      console.error(error);
    }
  };

  if (isLoading) return <p>Loading categories...</p>;
  if (isError) return <p style={{ color: "red" }}>Failed to load categories</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto" }}>
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
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          style={{ marginRight: "10px" }}
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
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {editId === cat.id ? (
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{
                    padding: "6px",
                    marginRight: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                />
                <input
                  type="file"
                  onChange={(e) => setEditImage(e.target.files[0])}
                  style={{ marginRight: "10px" }}
                />
                <button
                  onClick={() => handleUpdateCategory(cat.id)}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "green",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    marginRight: "5px",
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditId(null)}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "gray",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <div>
                  <strong>{cat.name}</strong>
                  {cat.image && (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        marginLeft: "10px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </div>
                <div>
                  <button
                    onClick={() => {
                      setEditId(cat.id);
                      setEditName(cat.name);
                    }}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#ffc107",
                      color: "black",
                      border: "none",
                      borderRadius: "5px",
                      marginRight: "5px",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
