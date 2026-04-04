import { useDispatch, useSelector } from "react-redux";

import {
  setPackages,
  setLoading,
  setError,
} from "../store/slices/packageSlice";
import ApiFunction from "../components/api/apiFuntions";
import { packageApi } from "../components/api/ApiRoutesFile";

export const usePackages = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.packages);
  const { get } = ApiFunction();

  const fetchPackages = async () => {
    dispatch(setLoading(true));
    try {
      const response = await get(packageApi.getAll);

      dispatch(setPackages(response.data || []));

      return response.data;
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to fetch packages";

      dispatch(setError(errMsg));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  return { items, loading, error, fetchPackages };
};
