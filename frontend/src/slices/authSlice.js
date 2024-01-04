import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfoMediquest: localStorage.getItem('userInfoMediquest')
    ? JSON.parse(localStorage.getItem('userInfoMediquest'))
    : null,
};

  const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
      setCredentials: (state, action) => {
        state.userInfoMediquest = action.payload;
        localStorage.setItem('userInfoMediquest', JSON.stringify(action.payload));
      },
      logout: (state, action) => {
        state.userInfoMediquest = null
        localStorage.removeItem('userInfoMediquest')
      }
    }

  })

  export const { setCredentials, logout } = authSlice.actions
  export default authSlice.reducer