import React, { useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
} from "@mui/material";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetCategoriesQuery,
  useGetProductMediaQuery,
  useAddProductMediaMutation,
  useDeleteProductMediaMutation,
} from "../redux/productsApi";
import { MEDIA_URL } from "../API/api";

function Products() {
  const { data: products, error, isLoading } = useGetProductsQuery();
  const { data: categories, isLoading: categoriesLoading } =
    useGetCategoriesQuery();

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [addProductMedia] = useAddProductMediaMutation();
  const [deleteProductMedia] = useDeleteProductMediaMutation();

  const [form, setForm] = useState({
    brand: "",
    name: "",
    price: "",
    description: "",
    stock: "",
    category: "",
    image: null,
  });

  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [file, setFile] = useState(null);
  const [mediaType, setMediaType] = useState("image");

  const { data: media, isLoading: mediaLoading } = useGetProductMediaQuery(
    selectedProduct?.id,
    { skip: !selectedProduct }
  );

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in form) {
      if (form[key] !== null && form[key] !== "") {
        formData.append(key, form[key]);
      }
    }
    try {
      await createProduct(formData).unwrap();
      alert("Product created successfully!");
      setForm({
        brand: "",
        name: "",
        price: "",
        description: "",
        stock: "",
        category: "",
        image: null,
      });
    } catch {
      alert("Failed to create product");
    }
  };

  const handleOpen = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
    setFile(null);
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleUpload = async () => {
    if (!file || !selectedProduct) return;
    const formData = new FormData();
    formData.append("product", selectedProduct.id);
    formData.append("media_type", mediaType);
    formData.append("file", file);

    try {
        await addProductMedia(formData).unwrap();  
        alert("Media added successfully!");
        setFile(null);
    } catch (err) {
        console.error(err);
        alert("Failed to upload media");
    }
    };


  const handleEditOpen = (product) => {
    setEditForm({
      id: product.id,
      brand: product.brand,
      name: product.name,
      price: product.price,
      description: product.description,
      stock: product.stock,
      category: product.category,
    });
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditForm(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleEditSubmit = async () => {
    try {
      await updateProduct({
        id: editForm.id,
        formData: {
          brand: editForm.brand,
          name: editForm.name,
          price: editForm.price,
          description: editForm.description,
          stock: editForm.stock,
          category: editForm.category,
        },
      }).unwrap();
      alert("Product updated successfully!");
      handleEditClose();
    } catch {
      alert("Failed to update product");
    }
  };

  if (isLoading || categoriesLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography color="error">Failed to load products</Typography>
      </Box>
    );
  }

  if (!products) return null;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add New Product
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}
      >
        <TextField
          label="Brand"
          name="brand"
          value={form.brand}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Price"
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={2}
        />
        <TextField
          label="Stock"
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            {categories?.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" component="label">
          Upload Image
          <input type="file" name="image" hidden onChange={handleChange} />
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Create Product
        </Button>
      </Box>

      <Typography variant="h6" gutterBottom>
        All Products
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>
                    <img
                      src={
                        product.image.startsWith("http")
                          ? product.image
                          : `${MEDIA_URL}${product.image}`
                      }
                      alt={product.name}
                      style={{ width: 50, height: 50, borderRadius: 4 }}
                    />
                  </TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>₹{product.price}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.category_detail?.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleOpen(product)}
                      sx={{ mr: 1 }}
                    >
                      Manage Media
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleEditOpen(product)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={products.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>
          Manage Media for {selectedProduct?.name}
        </DialogTitle>
        <DialogContent>
          {mediaLoading ? (
            <CircularProgress />
          ) : (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
              {media?.map((m) => (
                <Box key={m.id} sx={{ textAlign: "center" }}>
                  {m.media_type === "image" ? (
                    <img
                      src={m.file}
                      alt={m.media_type}
                      style={{ width: 120, height: 120, borderRadius: 8 }}
                    />
                  ) : (
                    <video
                      src={m.file}
                      controls
                      style={{ width: 160, height: 120, borderRadius: 8 }}
                    />
                  )}
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    sx={{ mt: 1 }}
                    onClick={async () => {
                      try {
                        await deleteProductMedia({
                          mediaId: m.id,
                          productId: selectedProduct.id,
                        }).unwrap();
                        alert("Media deleted successfully!");
                      } catch {
                        alert("Failed to delete media");
                      }
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              ))}
            </Box>
          )}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1">Upload New Media</Typography>
            <FormControl sx={{ mt: 2, mb: 2, width: "200px" }}>
              <InputLabel>Media Type</InputLabel>
              <Select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value)}
              >
                <MenuItem value="image">Image</MenuItem>
                <MenuItem value="video">Video</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" component="label">
              Choose File
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            {file && <Typography sx={{ ml: 2 }}>{file.name}</Typography>}
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                disabled={!file}
              >
                Upload
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editOpen} onClose={handleEditClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          {editForm && (
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
            >
              <TextField
                label="Brand"
                name="brand"
                value={editForm.brand}
                onChange={handleEditChange}
                fullWidth
              />
              <TextField
                label="Name"
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
                fullWidth
              />
              <TextField
                label="Price"
                name="price"
                type="number"
                value={editForm.price}
                onChange={handleEditChange}
                fullWidth
              />
              <TextField
                label="Description"
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
                fullWidth
                multiline
                rows={2}
              />
              <TextField
                label="Stock"
                name="stock"
                type="number"
                value={editForm.stock}
                onChange={handleEditChange}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={editForm.category}
                  onChange={handleEditChange}
                >
                  {categories?.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditSubmit}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Products;
