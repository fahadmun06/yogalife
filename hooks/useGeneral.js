import { useDispatch, useSelector } from "react-redux";

import {
  setGlobalHero,
  setGlobalHeroImage,
  setGlobalHeroPosition,
  setGlobalHeroTextColor,
  setLoading,
  setSidebarOpen,
  toggleSidebar,
} from "../store/slices/generalSlice";

export const useGeneral = () => {
  const dispatch = useDispatch();
  const {
    globalHeroImage,
    globalHeroPosition,
    globalHeroTextColor,
    isLoading,
    isSidebarOpen,
    loadingMessage,
  } = useSelector((state) => state.general);

  const setAppLoading = (loading, message = "") => {
    dispatch(setLoading({ loading, message }));
  };

  const toggleSidebarNav = () => {
    dispatch(toggleSidebar());
  };

  const setSidebarOpenNav = (isOpen) => {
    dispatch(setSidebarOpen(isOpen));
  };

  const setGlobalHeroNav = (data) => {
    dispatch(setGlobalHero(data));
  };

  const setGlobalHeroImageNav = (imageUrl) => {
    dispatch(setGlobalHeroImage(imageUrl));
  };

  const setGlobalHeroPositionNav = (position) => {
    dispatch(setGlobalHeroPosition(position));
  };

  const setGlobalHeroTextColorNav = (color) => {
    dispatch(setGlobalHeroTextColor(color));
  };

  return {
    globalHeroImage,
    globalHeroPosition,
    globalHeroTextColor,
    isLoading,
    isSidebarOpen,
    loadingMessage,
    setAppLoading,
    setGlobalHero: setGlobalHeroNav,
    setGlobalHeroImage: setGlobalHeroImageNav,
    setGlobalHeroPosition: setGlobalHeroPositionNav,
    setGlobalHeroTextColor: setGlobalHeroTextColorNav,
    setSidebarOpenNav,
    toggleSidebarNav,
  };
};
