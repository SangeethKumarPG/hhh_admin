import { apiSlice } from "./apiSlice";

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => "/order-details/",
      providesTags: ["Orders"],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ order_id, status }) => ({
        url: "/orders/update-status/",
        method: "PATCH",
        body: { order_id, status },
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const { useGetOrdersQuery, useUpdateOrderStatusMutation } = ordersApi;
