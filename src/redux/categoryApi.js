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
      refetchOnMountOrArgChange: true, 
    }),

    addCategory: builder.mutation({
      query: (formData) => ({
        url: "categories/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }], 
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            categoryApi.util.invalidateTags([{ type: "Category", id: "LIST" }])
          );
        } catch {}
      },
    }),

    updateCategory: builder.mutation({
      query: ({ id, formData }) => ({
        url: `categories/${id}/`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
      ],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            categoryApi.util.invalidateTags([{ type: "Category", id: "LIST" }])
          );
        } catch {}
      },
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `categories/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
      ],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            categoryApi.util.invalidateTags([{ type: "Category", id: "LIST" }])
          );
        } catch {}
      },
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
