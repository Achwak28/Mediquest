import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    getUserProfile: builder.query({
      query: () => ({
        url: `${USERS_URL}/profile`,
        method: "GET",
      }),
      providesTags: ['User'],
      keepUnusedDataFor: 5,
    }),
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),
    uploadUserImage: builder.mutation({
      query: (data) => ({
        url: `/api/upload`,
        method: 'POST',
        body: data,
      }),
    }),
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
      }),
      providesTags: ['User'],
      keepUnusedDataFor: 5,
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: 'DELETE',
      }),
    }),
    getUserDetails: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    addToFav: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/toFav`,
        method: 'POST',
        body: data,
      }), 
      invalidatesTags: ['Document'],
      providesTags: ['Document'],
    }),
    favList: builder.query({
      query: () => ({
        url: `${USERS_URL}/favourites`,
      }),
      invalidatesTags: ['User'],
    }),
    sendOTP: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/recoveryemail`,
        method: 'POST',
        body: data,
      }), 
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/resetpassword`,
        method: 'POST',
        body: data,
      }), 
    }),
    sendCode: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/verificationcode`,
        method: 'POST',
        body: data,
      }), 
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useProfileMutation,
  useGetUserProfileQuery,
  useUploadUserImageMutation,
  useAddToFavMutation,
  useGetFavListQuery,
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUserDetailsQuery,
  useSendOTPMutation,
  useResetPasswordMutation,
  useSendCodeMutation,
} = usersApiSlice;
