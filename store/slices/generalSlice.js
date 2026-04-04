import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  loadingMessage: "",
  isSidebarOpen: false,
  isCollapse: false,
};

const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload.loading;
      state.loadingMessage = action.payload.message || "";
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    setIsCollapse: (state, action) => {
      state.isCollapse = action.payload;
    },
  },
});

export const { setLoading, toggleSidebar, setSidebarOpen, setIsCollapse } =
  generalSlice.actions;
export default generalSlice.reducer;
