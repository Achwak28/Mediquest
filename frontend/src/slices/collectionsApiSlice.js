import { COLLECTIONS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

const collectionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCollection: builder.mutation({
      query: (collection) => ({
        url: COLLECTIONS_URL,
        method: "POST",
        body: collection,
      }),
    }),
    getCollectionDetails: builder.query({
      query: (id) => ({
        url: `${COLLECTIONS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateCollection: builder.mutation({
      query: (data) => ({
        url: `${COLLECTIONS_URL}/${data.collectionId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Collections"],
    }), 
    deleteCollection: builder.mutation({
      query: (collectionId) => ({
        url: `${COLLECTIONS_URL}/${collectionId}`,
        method: 'DELETE',
      }),
    }),
    getMyCollections: builder.query({
      query: () => ({
        url: `${COLLECTIONS_URL}/mycollections`,
      }),
      keepUnusedDataFor: 5,
    }),
    getCollections: builder.query({
      query: () => ({
        url: COLLECTIONS_URL,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});
 
export const {
  useCreateCollectionMutation,
  useGetCollectionDetailsQuery,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation,
  useGetMyCollectionsQuery,
  useGetCollectionsQuery,
} = collectionApiSlice;
