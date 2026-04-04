import { useDispatch, useSelector } from "react-redux";
import {
  setLoading,
  toggleSidebar,
  setSidebarOpen,
} from "../store/slices/generalSlice";

export const useGeneral = () => {
  const dispatch = useDispatch();
  const { isLoading, loadingMessage, isSidebarOpen } = useSelector(
    (state) => state.general,
  );

  const setAppLoading = (loading, message = "") => {
    dispatch(setLoading({ loading, message }));
  };

  const toggleSidebarNav = () => {
    dispatch(toggleSidebar());
  };

  const setSidebarOpenNav = (isOpen) => {
    dispatch(setSidebarOpen(isOpen));
  };

  return {
    isLoading,
    loadingMessage,
    isSidebarOpen,
    setAppLoading,
    toggleSidebarNav,
    setSidebarOpenNav,
  };
};
