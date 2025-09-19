import React from "react";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useGetDashboardStatsQuery } from "../redux/dashboardApi";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const CARD_COLORS = [
  { bg: "#4FC3F7", text: "#fff" },
  { bg: "#66BB6A", text: "#fff" },
  { bg: "#FFA726", text: "#fff" },
  { bg: "#EF5350", text: "#fff" },
];

function Home() {
  const { data, error, isLoading } = useGetDashboardStatsQuery();

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
        <Typography color="error">Failed to load dashboard data</Typography>
      </Box>
    );
  }

  if (!data) return null;

  const topStatsData = [
    { label: "Total Orders", value: data.total_orders },
    { label: "Total Sales", value: `₹${data.total_sales_value}` },
    { label: "Active Users", value: data.total_active_users },
    { label: "Blocked Users", value: data.total_blocked_users },
  ];

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#f5f5f5", p: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "center",
          mb: 4,
        }}
      >
        {topStatsData.map((stat, index) => (
          <Paper
            key={index}
            sx={{
              flex: "1 1 calc(25% - 24px)",
              minWidth: "220px",
              maxWidth: "300px",
              p: 3,
              textAlign: "center",
              backgroundColor: CARD_COLORS[index].bg,
              color: CARD_COLORS[index].text,
              boxShadow: 3,
              borderRadius: 2,
              height: "140px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 6,
              },
            }}
          >
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
              {stat.label}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {stat.value}
            </Typography>
          </Paper>
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          mb: 4,
        }}
      >
        <Paper
          sx={{
            flex: "1 1 50%",
            p: 3,
            borderRadius: 2,
            boxShadow: 2,
            minWidth: "300px",
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Orders Per Month
          </Typography>
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={data.orders_per_month} barCategoryGap="30%">
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="count"
                fill="#4FC3F7"
                barSize={60}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        <Paper
          sx={{
            flex: "1 1 50%",
            p: 3,
            borderRadius: 2,
            boxShadow: 2,
            minWidth: "300px",
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Sales Per Month
          </Typography>
          <ResponsiveContainer width="100%" height={450}>
            <LineChart data={data.sales_per_month}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#66BB6A"
                strokeWidth={3}
                dot={{ fill: "#66BB6A", r: 6, strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      <Box>
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Top Selling Products
          </Typography>
          <ResponsiveContainer width="100%" height={450}>
            <PieChart>
              <Pie
                data={data.top_selling_products}
                dataKey="total_sales"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={170}
                label
              >
                {data.top_selling_products.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
    </Box>
  );
}

export default Home;
