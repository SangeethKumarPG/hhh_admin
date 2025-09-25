// src/redux/heroApi.js
import { apiSlice } from "./apiSlice";

export const heroApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHeroSections: builder.query({
      query: () => "herosection/",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Hero", id })),
              { type: "Hero", id: "LIST" },
            ]
          : [{ type: "Hero", id: "LIST" }],
    }),

    addHeroSection: builder.mutation({
      query: (formData) => ({
        url: "herosection/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Hero", id: "LIST" }],
    }),

    updateHeroSection: builder.mutation({
      query: ({ id, formData }) => ({
        url: `herosection/${id}/`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Hero", id },
        { type: "Hero", id: "LIST" },
      ],
    }),

    deleteHeroSection: builder.mutation({
      query: (id) => ({
        url: `herosection/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Hero", id },
        { type: "Hero", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetHeroSectionsQuery,
  useAddHeroSectionMutation,
  useUpdateHeroSectionMutation,
  useDeleteHeroSectionMutation,
} = heroApi;
