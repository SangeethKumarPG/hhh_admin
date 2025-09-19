import { apiSlice } from "./apiSlice";

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => "/dashboard-stats/",
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
