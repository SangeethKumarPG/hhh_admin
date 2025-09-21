import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Box,
  Toolbar,
  AppBar,
  Typography,
  Button,
} from "@mui/material";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import Users from "../components/Users";
import Settings from "../components/Settings";
import Home from "../components/Home";
import Products from "../components/Products";
import Orders from "../components/Orders";
import Categories from "../components/Categories";

const drawerWidth = 240;

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/"); // redirect to login
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" noWrap>
            Admin Dashboard
          </Typography>
          <Button
            color="inherit"
            variant="outlined"
            onClick={handleLogout}
            sx={{ ml: 2 }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItemButton onClick={() => navigate("/dashboard/")}>
              <ListItemText primary="Home" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate("/dashboard/users")}>
              <ListItemText primary="Users" />
            </ListItemButton>
                        <ListItemButton onClick={() => navigate("/dashboard/products")}>
            <ListItemText primary="Products" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate("/dashboard/orders")}>
              <ListItemText primary="Orders" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate("/dashboard/categories")}>
              <ListItemText primary="Categories" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: 3,
          py: 2,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          bgcolor: "#f5f5f5",
        }}
      >
        <Toolbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="users" element={<Users />} />
          <Route path="Categories" element={<Categories />} />
          <Route path="products" element={<Products/>}/>
          <Route path="orders" element={<Orders/>}/>
          <Route path="*" element={<Typography>Select an option</Typography>} />
        </Routes>
      </Box>
    </Box>
  );
}

export default Dashboard;
