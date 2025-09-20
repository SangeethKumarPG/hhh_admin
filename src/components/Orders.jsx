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
  TextField,
  TablePagination,
  Button,
  Stack,
  Select,
  MenuItem,
} from "@mui/material";
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from "../redux/ordersApi";

function Orders() {
  const { data: orders, error, isLoading } = useGetOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleStatusChange = async (order_id, newStatus) => {
    try {
      await updateOrderStatus({ order_id, status: newStatus }).unwrap();
      alert("Order status updated successfully!");
    } catch {
      alert("Failed to update order status");
    }
  };

  const filteredOrders = orders
    ?.filter(
      (order) =>
        (statusFilter === "All" || order.status === statusFilter) &&
        (order.order_id.toLowerCase().includes(search.toLowerCase()) ||
          order.user.email.toLowerCase().includes(search.toLowerCase()) ||
          order.user.first_name.toLowerCase().includes(search.toLowerCase()) ||
          order.user.last_name.toLowerCase().includes(search.toLowerCase()))
    )
    .sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography color="error">Failed to load orders</Typography>
      </Box>
    );
  }

  if (!orders) return null;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Orders
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        {["All", "Pending", "Paid", "Shipped", "Delivered"].map((status) => (
          <Button
            key={status}
            variant={statusFilter === status ? "contained" : "outlined"}
            onClick={() => {
              setStatusFilter(status);
              setPage(0);
            }}
          >
            {status}
          </Button>
        ))}
      </Stack>

      <TextField
        label="Search Orders"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Update Status</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order) => (
                <TableRow key={order.order_id}>
                  <TableCell>{order.order_id}</TableCell>
                  <TableCell>
                    {order.user.first_name} {order.user.last_name}
                  </TableCell>
                  <TableCell>{order.user.email}</TableCell>
                  <TableCell>{order.phone_number}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.order_id, e.target.value)
                      }
                      size="small"
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Paid">Paid</MenuItem>
                      <MenuItem value="Shipped">Shipped</MenuItem>
                      <MenuItem value="Delivered">Delivered</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>₹{order.total_amount}</TableCell>
                  <TableCell>
                    {order.items.map((item) => (
                      <Box key={item.id}>
                        {item.product_name} (x{item.quantity})
                      </Box>
                    ))}
                  </TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredOrders?.length || 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>
    </Box>
  );
}

export default Orders;
