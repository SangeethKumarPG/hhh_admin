// src/redux/categoryApi.js
import { apiSlice } from "./apiSlice";

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => "categories/",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Category", id })),
              { type: "Category", id: "LIST" },
            ]
          : [{ type: "Category", id: "LIST" }],
    }),
    addCategory: builder.mutation({
      query: (newCategory) => ({
        url: "categories/",
        method: "POST",
        body: newCategory,
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),
  }),
});

export const { useGetCategoriesQuery, useAddCategoryMutation } = categoryApi;
