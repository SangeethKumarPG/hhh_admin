import { apiSlice } from "./apiSlice";

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/view-products",
      providesTags: ["Products"],
    }),
    createProduct: builder.mutation({
      query: (formData) => ({
        url: "/create-product/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/products/${id}/`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
    getCategories: builder.query({
      query: () => "/categories/",
    }),
    getProductMedia: builder.query({
      query: (productId) => `/get-product-media/${productId}`,
      providesTags: (result, error, id) => [{ type: "ProductMedia", id }],
    }),
    addProductMedia: builder.mutation({
      query: (formData) => ({
        url: "/add-product-media",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "ProductMedia", id: arg.get("product") },
      ],
    }),
    deleteProductMedia: builder.mutation({
      query: ({ mediaId }) => ({
        url: `/delete-product-media/${mediaId}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "ProductMedia", id: productId },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetCategoriesQuery,
  useGetProductMediaQuery,
  useAddProductMediaMutation,
  useDeleteProductMediaMutation,
} = productsApi;
