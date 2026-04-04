import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  unreadCount: 0,
  filter: 'all', // 'all', 'read', 'unread'
  search: '',
  page: 1,
  pagination: {
    total: 0,
    pages: 1,
  },
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    appendNotifications: (state, action) => {
      const newNotifs = action.payload.filter(
        (n) => !state.notifications.some((exist) => exist._id === n._id)
      );
      state.notifications = [...state.notifications, ...newNotifs];
    },

    addNotification: (state, action) => {
      // Add new notification to the beginning of the list
      state.notifications = [action.payload, ...state.notifications];
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
    decrementUnreadCount: (state) => {
      state.unreadCount = Math.max(0, state.unreadCount - 1);
    },
    markAsRead: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find((n) => n._id === notificationId);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },

    setFilter: (state, action) => {
      state.filter = action.payload;
      state.page = 1; // Reset to first page when filter changes
    },
    setSearch: (state, action) => {
      state.search = action.payload;
      state.page = 1; // Reset to first page when search changes
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetNotifications: () => {
      return initialState;
    },
  },
});

export const {
  setNotifications,
  appendNotifications,
  addNotification,
  setUnreadCount,
  incrementUnreadCount,
  decrementUnreadCount,
  markAsRead,
  setFilter,
  setSearch,
  setPage,
  setPagination,
  setLoading,
  setError,
  resetNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
