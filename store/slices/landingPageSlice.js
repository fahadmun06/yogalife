import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hero: null,
  services: null,
  about: null,
  whyChooseUs: null,
  butterfly: null,
  testimonials: null,
  blog: null,
  blogSettings: null,
  retro: null,
  contact: null,
  faqs: [],
  transformation: {
    images: [],
    settings: null
  },
  loading: {},
};

const landingPageSlice = createSlice({
  name: "landingPage",
  initialState,
  reducers: {
    setHeroData: (state, action) => {
      state.hero = action.payload;
    },
    setServicesData: (state, action) => {
      state.services = action.payload;
    },
    setAboutData: (state, action) => {
      state.about = action.payload;
    },
    setWhyChooseUsData: (state, action) => {
      state.whyChooseUs = action.payload;
    },
    setButterflyData: (state, action) => {
      state.butterfly = action.payload;
    },
    setTestimonialsData: (state, action) => {
      state.testimonials = action.payload;
    },
    setBlogData: (state, action) => {
      state.blog = action.payload;
    },
    setBlogSettings: (state, action) => {
      state.blogSettings = action.payload;
    },
    setRetroData: (state, action) => {
      state.retro = action.payload;
    },
    setContactData: (state, action) => {
      state.contact = action.payload;
    },
    setFaqData: (state, action) => {
      state.faqs = action.payload;
    },
    setTransformationData: (state, action) => {
      state.transformation.images = action.payload.images || state.transformation.images;
      state.transformation.settings = action.payload.settings || state.transformation.settings;
    },
    setSectionLoading: (state, action) => {
      const { section, isLoading } = action.payload;
      state.loading[section] = isLoading;
    }
  },
});

export const {
  setHeroData,
  setServicesData,
  setAboutData,
  setWhyChooseUsData,
  setButterflyData,
  setTestimonialsData,
  setBlogData,
  setBlogSettings,
  setRetroData,
  setContactData,
  setFaqData,
  setTransformationData,
  setSectionLoading
} = landingPageSlice.actions;

export default landingPageSlice.reducer;
