import { apiSlice } from "./apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/admin-login/",
        method: "POST",
        body: credentials,
      }),
    }),
    getProfile: builder.query({
      query: () => "/profile/",
    }),
  }),
});

export const { useLoginMutation, useGetProfileQuery } = authApi;
