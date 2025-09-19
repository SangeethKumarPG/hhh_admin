import { apiSlice } from "./apiSlice";

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/users/",
      providesTags: ["Users"],
    }),
    updateUserStatus: builder.mutation({
      query: ({ id, is_active }) => ({
        url: `/users/${id}/`,
        method: "PATCH",
        body: { is_active },
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const { useGetUsersQuery, useUpdateUserStatusMutation } = usersApi;
