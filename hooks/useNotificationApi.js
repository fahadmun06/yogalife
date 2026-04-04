import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import ApiFunction from "../components/api/apiFuntions";
import {
  setNotifications,
  appendNotifications,
  setUnreadCount,
  setPagination,
  setLoading,
  setError,
  markAsRead as markAsReadAction,
} from "../store/slices/notificationSlice";

import { useAuth } from "./useAuth";

const useNotificationApi = () => {
  const dispatch = useDispatch();
  const { get, put } = ApiFunction();
  const { user } = useAuth();

  const { filter, search, page } = useSelector((state) => state.notification);

  // Fetch notifications with filters
  const fetchNotifications = useCallback(
    async (customParams = {}) => {
      if (!user) return;
      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        const params = new URLSearchParams({
          page: customParams.page || page.toString(),
          limit: customParams.limit || "10",
          ...(customParams.filter || (filter !== "all" && { filter })),
          ...(customParams.search || (search && { search })),
        });

        const response = await get(`notifications?${params.toString()}`);

        if (response.success) {
          if (customParams.append) {
            dispatch(appendNotifications(response.data.notifications));
          } else {
            dispatch(setNotifications(response.data.notifications));
          }
          dispatch(setPagination(response.data.pagination));
          dispatch(setUnreadCount(response.data.unreadCount));
        }

        return response;
      } catch (error) {
        console.error("Error fetching notifications:", error);
        dispatch(setError(error.message || "Failed to fetch notifications"));
        toast.error("Failed to load notifications");
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, filter, search, page],
  );

  // Fetch only unread count
  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;
    try {
      const response = await get("notifications?limit=1");

      if (response.success) {
        dispatch(setUnreadCount(response.data.unreadCount));
      }

      return response.data.unreadCount;
    } catch (error) {
      console.error("Error fetching unread count:", error);

      return 0;
    }
  }, [dispatch]);

  // Mark notification as read
  const markAsRead = useCallback(
    async (notificationId) => {
      if (!user) return;
      try {
        const response = await put(`notifications/${notificationId}/read`);

        if (response.success) {
          dispatch(markAsReadAction(notificationId));

          return response;
        }
      } catch (error) {
        console.error("Error marking notification as read:", error);
        toast.error("Failed to mark notification as read");
        throw error;
      }
    },
    [dispatch],
  );

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user) return;
    try {
      const response = await put("notifications/mark-all-read");

      if (response.success) {
        // Refresh notifications
        await fetchNotifications();
        toast.success("All notifications marked as read");

        return response;
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to mark all as read");
      throw error;
    }
  }, [dispatch]);

  return {
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
  };
};

export default useNotificationApi;
