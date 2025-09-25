import React, { useState } from "react";
import {
  useGetHeroSectionsQuery,
  useAddHeroSectionMutation,
  useUpdateHeroSectionMutation,
  useDeleteHeroSectionMutation,
} from "../redux/heroApi";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";

const HeroSection = () => {
  const { data: heroes = [], isLoading, isError, refetch } =
    useGetHeroSectionsQuery();
  const [addHero] = useAddHeroSectionMutation();
  const [updateHero] = useUpdateHeroSectionMutation();
  const [deleteHero] = useDeleteHeroSectionMutation();

  const [form, setForm] = useState({
    smallText: "",
    title: "",
    subtitle: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ smallText: "", title: "", subtitle: "", description: "" });
    setImage(null);
    setEditId(null);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      formData.append(key, value)
    );
    if (image) formData.append("image", image);
    try {
      await addHero(formData).unwrap();
      alert("Hero section added");
      resetForm();
      refetch();
    } catch (err) {
      alert("Failed to add");
      console.error(err);
    }
  };

  const handleUpdate = async (id) => {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      formData.append(key, value)
    );
    if (image) formData.append("image", image);
    try {
      await updateHero({ id, formData }).unwrap();
      alert("Hero section updated");
      resetForm();
      refetch();
    } catch (err) {
      alert("Failed to update");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this hero section?")) return;
    try {
      await deleteHero(id).unwrap();
      alert("Deleted");
      refetch();
    } catch (err) {
      alert("Failed to delete");
      console.error(err);
    }
  };

  if (isLoading) return <Typography>Loading hero sections...</Typography>;
  if (isError)
    return <Typography color="error">Failed to load hero sections</Typography>;

  return (
    <Box sx={{ maxWidth: "800px", mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Hero Sections
      </Typography>

      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          if (editId) {
            handleUpdate(editId);
          } else {
            handleAdd(e);
          }
        }}
        sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}
      >
        <TextField
          label="Small Text"
          name="smallText"
          value={form.smallText}
          onChange={handleChange}
        />
        <TextField
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <TextField
          label="Subtitle"
          name="subtitle"
          value={form.subtitle}
          onChange={handleChange}
        />
        <TextField
          label="Description"
          name="description"
          multiline
          rows={3}
          value={form.description}
          onChange={handleChange}
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          style={{ marginTop: "10px" }}
        />
        <Button type="submit" variant="contained" color="primary">
          {editId ? "Update Hero" : "Add Hero"}
        </Button>
      </Box>

      {heroes.map((hero) => (
        <Card key={hero.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h5">{hero.title}</Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {hero.subtitle}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <em>{hero.smallText}</em>
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {hero.description}
            </Typography>
            {hero.image && (
              <Box sx={{ mt: 2 }}>
                <img
                  src={hero.image}
                  alt={hero.title}
                  style={{
                    width: "100%",
                    maxWidth: "300px",
                    borderRadius: "8px",
                  }}
                />
              </Box>
            )}
            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                color="warning"
                onClick={() => {
                  setEditId(hero.id);
                  setForm({
                    smallText: hero.smallText || "",
                    title: hero.title || "",
                    subtitle: hero.subtitle || "",
                    description: hero.description || "",
                  });
                }}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDelete(hero.id)}
              >
                Delete
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default HeroSection;
