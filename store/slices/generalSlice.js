import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCollapse: false,
  globalHeroImage: null,
  globalHeroPosition: "center",
  globalHeroTextColor: "#4A3B4C",
  isLoading: false,
  isSidebarOpen: false,
  loadingMessage: "",
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
    setGlobalHero: (state, action) => {
      state.globalHeroImage = action.payload.backgroundImage || action.payload.globalHeroImage || state.globalHeroImage;
      state.globalHeroPosition = action.payload.backgroundPosition || action.payload.globalHeroPosition || state.globalHeroPosition;
      state.globalHeroTextColor = action.payload.textColor || action.payload.globalHeroTextColor || state.globalHeroTextColor;
    },
    setGlobalHeroImage: (state, action) => {
      state.globalHeroImage = action.payload;
    },
    setGlobalHeroPosition: (state, action) => {
      state.globalHeroPosition = action.payload;
    },
    setGlobalHeroTextColor: (state, action) => {
      state.globalHeroTextColor = action.payload;
    },
  },
});

export const {
  setLoading,
  toggleSidebar,
  setSidebarOpen,
  setIsCollapse,
  setGlobalHero,
  setGlobalHeroImage,
  setGlobalHeroPosition,
  setGlobalHeroTextColor,
} = generalSlice.actions;

export default generalSlice.reducer;
