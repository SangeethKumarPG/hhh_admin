import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: !!sessionStorage.getItem("access_token"),
  access: sessionStorage.getItem("access_token") || null,
  refresh: sessionStorage.getItem("refresh_token") || null,
  email: null,
  message: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { access, refresh, email, message } = action.payload;
      state.isAuthenticated = true;
      state.access = access;
      state.refresh = refresh;
      state.email = email || null;
      state.message = message || null;

      sessionStorage.setItem("access_token", access);
      if (refresh) sessionStorage.setItem("refresh_token", refresh);
    },
    refreshAccessToken: (state, action) => {
      state.access = action.payload.access;
      state.isAuthenticated = true;
      sessionStorage.setItem("access_token", action.payload.access);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.access = null;
      state.refresh = null;
      state.email = null;
      state.message = null;
      sessionStorage.clear();
    },
  },
});

export const { setCredentials, refreshAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;
