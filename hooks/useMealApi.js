import { useState } from "react";
import { toast } from "sonner";

import ApiFunction from "../components/api/apiFuntions";

const useMealApi = () => {
  const [loading, setLoading] = useState(false);
  const { get, userData } = ApiFunction();

  const fetchMealCategories = async () => {
    setLoading(true);

    try {
      const response = await get(`categories?type=meal`);

      return response;
    } catch {
      toast.error("Failed to fetch nutrition categories");
    } finally {
      setLoading(false);
    }
  };

  const fetchMeals = async (query = "") => {
    if (!userData) return;
    if (userData.subscriptionStatus === "free") return;

    setLoading(true);

    try {
      // If query is an object, convert to string
      let queryString = query;

      if (typeof query === "object") {
        const params = new URLSearchParams(query);

        queryString = `?${params.toString()}`;
      }

      const response = await get(`meals${queryString}`);

      return response;
    } catch {
      toast.error("Failed to fetch meals");
    } finally {
      setLoading(false);
    }
  };

  const fetchMealById = async (id) => {
    setLoading(true);

    try {
      const response = await get(`meals/${id}`);

      return response;
    } catch {
      toast.error("Failed to fetch meal details");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    fetchMealCategories,
    fetchMeals,
    fetchMealById,
  };
};

export default useMealApi;
