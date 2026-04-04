import { useState } from "react";
import { toast } from "sonner";

import ApiFunction from "../components/api/apiFuntions";

const useWorkoutApi = () => {
  const [loading, setLoading] = useState(false);
  const { get, post, userData } = ApiFunction();

  const fetchWorkouts = async (query = "") => {
    if (!userData) return;
    if (userData.subscriptionStatus === "free") return;

    setLoading(true);
    try {
      const response = await get(
        `workouts${query ? query + "&" : "?"}status=published`,
      );

      return response;
    } catch (error) {
      console.error("Error fetching workouts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await get(`categories`);

      return response;
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkoutById = async (id) => {
    setLoading(true);
    try {
      const response = await get(`workouts/${id}?status=published`);

      return response;
    } catch (error) {
      console.error("Error fetching workout:", error);
      toast.error("Failed to fetch workout details");
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (id, status) => {
    try {
      const response = await post(`workouts/${id}/like`, { status });

      return response;
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like status");
    }
  };

  const toggleFavorite = async (id) => {
    try {
      const response = await post(`workouts/${id}/favorite`, {});

      return response;
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorite status");
    }
  };

  const addComment = async (id, text) => {
    try {
      const response = await post(`workouts/${id}/comment`, { text });

      toast.success("Comment added");

      return response;
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
      throw error;
    }
  };

  const replyToComment = async (workoutId, commentId, text) => {
    try {
      const response = await post(
        `workouts/${workoutId}/comment/${commentId}/reply`,
        { text },
      );

      toast.success("Reply sent");

      return response;
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Failed to send reply");
      throw error;
    }
  };

  const incrementView = async (id) => {
    try {
      await post(`workouts/${id}/view`, {});
    } catch (error) {
      console.error("Error incrementing view:", error);
    }
  };

  const pinComment = async (workoutId, commentId) => {
    try {
      const response = await post(
        `workouts/${workoutId}/comment/${commentId}/pin`,
        {},
      );

      toast.success("Pin status updated");

      return response;
    } catch (error) {
      console.error("Error pinning comment:", error);
      toast.error("Failed to update pin status");
    }
  };

  return {
    loading,
    fetchWorkouts,
    fetchCategories,
    fetchWorkoutById,
    toggleLike,
    toggleFavorite,
    pinComment,
    addComment,
    replyToComment,
    incrementView,
  };
};

export default useWorkoutApi;
