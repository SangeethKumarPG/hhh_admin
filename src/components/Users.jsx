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
  Tabs,
  Tab,
  TextField,
  TablePagination,
} from "@mui/material";
import {
  useGetUsersQuery,
  useUpdateUserStatusMutation,
} from "../redux/usersApi";

function Users() {
  const { data, error, isLoading } = useGetUsersQuery();
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
        <Typography color="error">Failed to load users</Typography>
      </Box>
    );
  }

  if (!data) return null;

  const filteredUsers = data
    .filter((u) => !u.is_superuser)
    .filter(
      (u) =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.phone_number || "").toLowerCase().includes(search.toLowerCase())
    );

  const activeUsers = filteredUsers.filter((u) => u.is_active);
  const blockedUsers = filteredUsers.filter((u) => !u.is_active);

  const handleStatusChange = async (id, is_active) => {
    await updateUserStatus({ id, is_active });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderTable = (users, type) => {
    const paginatedUsers = users.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );

    return (
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Date Joined</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone_number || "-"}</TableCell>
                <TableCell>
                  {new Date(user.date_joined).toLocaleString()}
                </TableCell>
                <TableCell>
                  {type === "active" ? (
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleStatusChange(user.id, false)}
                    >
                      Block
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleStatusChange(user.id, true)}
                    >
                      Unblock
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={users.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </TableContainer>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <TextField
        label="Search Users"
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Tabs value={tab} onChange={(e, newVal) => setTab(newVal)}>
        <Tab label="Active Users" />
        <Tab label="Blocked Users" />
      </Tabs>
      {tab === 0 && renderTable(activeUsers, "active")}
      {tab === 1 && renderTable(blockedUsers, "blocked")}
    </Box>
  );
}

export default Users;
