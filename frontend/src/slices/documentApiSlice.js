import { DOCS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const documentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDocuments: builder.query({
      query: ({keyword,pageNumber,category}) => ({
        url: DOCS_URL,
        params:  {keyword, pageNumber, category} ,
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Documents'],
    }), 
    getDocumentDetails: builder.query({
      query: (id) => ({
        url: `${DOCS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createDocument: builder.mutation({
      query: () => ({
        url: `${DOCS_URL}`,
        method: "POST",
      }),
      invalidatesTags: ["Document"],
    }),
    updateDocument: builder.mutation({
      query: (data) => ({
        url: `${DOCS_URL}/${data.documentId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Documents"],
    }),
    uploadDocumentImage: builder.mutation({
      query: (data) => ({
        url: `/api/upload`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteDocument: builder.mutation({
      query: (documentId) => ({
        url: `${DOCS_URL}/${documentId}`,
        method: 'DELETE',
      }),
      providesTags: ['Document'],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${DOCS_URL}/${data.documentId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Document'],
    }),
    deleteComment: builder.mutation({
      query: (data) => ({
        url: `${DOCS_URL}/${data.documentId}/reviews`,
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['Document'],
    }),
    getTopProducts: builder.query({
      query: () => `${DOCS_URL}/top`,
      keepUnusedDataFor: 5,
    }),
    downloadDocument: builder.mutation({
      query: (data) => ({
        url: `${DOCS_URL}/${data.documentId}/download`,
        method: 'POST',
        responseType: 'blob',
      }),
      
    }),
    getDownloadDocument: builder.query({
      query: (id) => ({
        url: `${DOCS_URL}/${id}/download`,
        responseType: 'blob',
      }),
     
    }),
  }),
});

export const {
  useGetDocumentsQuery,
  useGetDocumentDetailsQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useUploadDocumentImageMutation,
  useDeleteDocumentMutation,
  useCreateReviewMutation,
  useDeleteCommentMutation,
  useGetTopProductsQuery,
  useGetDownloadDocumentQuery,
  useDownloadDocumentMutation,
} = documentApiSlice;
