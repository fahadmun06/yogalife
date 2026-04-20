/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Bell, CheckCheck, Search } from "lucide-react";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@heroui/dropdown";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
// frontend has skeleton, maybe not spinner? Let's use skeleton or check heroui/react
// In frontend package.json, I see heroui/skeleton but not heroui/react.
// actually, I'll use a generic spinner or check if there's a Spinner in heroui/system?

import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

import useNotificationApi from "../../../hooks/useNotificationApi";
import {
  setFilter,
  setSearch,
  setPage,
  addNotification,
  incrementUnreadCount,
} from "../../../store/slices/notificationSlice";
import { useSocket } from "../../../context/SocketProvider";
import { useAuth } from "@/hooks/useAuth";

const NotificationBell = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const socket = useSocket();
  const { userData } = useAuth();

  const { notifications, unreadCount, filter, pagination, loading } =
    useSelector((state) => state.notification);

  const { fetchNotifications, fetchUnreadCount, markAsRead, markAllAsRead } =
    useNotificationApi();

  // Socket listener for new notifications
  useEffect(() => {
    if (socket) {
      const handleNewNotification = (notification) => {
        dispatch(addNotification(notification));
        dispatch(incrementUnreadCount());
      };

      socket.on("new_notification", handleNewNotification);

      return () => {
        socket.off("new_notification", handleNewNotification);
      };
    }
  }, [socket, dispatch]);

  // Fetch initial unread count
  useEffect(() => {
    if (userData) {
      fetchUnreadCount();
    }
  }, [userData]);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen && userData) {
      fetchNotifications();
    }
  }, [isOpen, filter]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== undefined) {
        dispatch(setSearch(searchInput));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }

    // Auto-close dropdown when clicked
    setIsOpen(false);

    if (
      notification.type === "success" ||
      notification.type === "workout" ||
      notification?.data?.type === "workout"
    ) {
      const workoutId = notification.data?.workoutId;

      if (workoutId) {
        router.push(`/premium/workouts/${workoutId}`);

        return;
      }
    }
  };

  const handleFilterChange = (newFilter) => {
    dispatch(setFilter(newFilter));
  };

  return (
    <div className="font-poppins">
      <Dropdown
        classNames={{
          content: "w-[95vw] sm:w-[400px] max-w-[400px] p-0 overflow-hidden",
        }}
        isOpen={isOpen}
        placement="bottom"
        onOpenChange={setIsOpen}
      >
        <DropdownTrigger>
          <Button
            isIconOnly
            aria-label="Notifications"
            className="rounded-full overflow-visible relative"
            variant="faded"
          >
            <Bell
              className={`w-5 h-5 ${unreadCount > 0 ? "animate-bell-ring" : ""}`}
            />
            {unreadCount > 0 && (
              <span className="absolute z-10 -top-1 -right-1 bg-danger text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 animate-pulse">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Button>
        </DropdownTrigger>

        <DropdownMenu
          aria-label="Notifications"
          className="max-h-[500px] overflow-hidden p-0"
          closeOnSelect={false}
        >
          <DropdownSection className="p-0 m-0">
            <DropdownItem
              key="notification-container"
              isReadOnly
              className="p-0 cursor-default hover:bg-transparent"
            >
              <div className="relative w-full overflow-hidden">
                {/* Notification List View */}
                <div className="transition-transform duration-300 ease-in-out">
                  {/* Header */}
                  <div className="px-5 py-4 space-y-4 font-poppins bg-content1 border-b border-divider">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-foreground">
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <Button
                          color="primary"
                          size="sm"
                          startContent={<CheckCheck className="w-4 h-4" />}
                          variant="light"
                          onPress={() => {
                            markAllAsRead();
                          }}
                        >
                          Mark all read
                        </Button>
                      )}
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Chip
                        className="cursor-pointer"
                        color={filter === "all" ? "primary" : "default"}
                        size="sm"
                        variant={filter === "all" ? "solid" : "flat"}
                        onClick={() => handleFilterChange("all")}
                      >
                        All
                      </Chip>
                      <Chip
                        className="cursor-pointer"
                        color={filter === "unread" ? "primary" : "default"}
                        size="sm"
                        variant={filter === "unread" ? "solid" : "flat"}
                        onClick={() => handleFilterChange("unread")}
                      >
                        Unread ({unreadCount})
                      </Chip>
                      <Chip
                        className="cursor-pointer"
                        color={filter === "read" ? "primary" : "default"}
                        size="sm"
                        variant={filter === "read" ? "solid" : "flat"}
                        onClick={() => handleFilterChange("read")}
                      >
                        Read
                      </Chip>
                    </div>

                    {/* Search */}
                    <Input
                      classNames={{
                        input: "text-sm text-foreground",
                      }}
                      placeholder="Search notifications..."
                      size="sm"
                      startContent={
                        <Search className="w-4 h-4 text-default-400" />
                      }
                      value={searchInput}
                      variant="bordered"
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                  </div>

                  {/* Notification List */}
                  <div className="max-h-[350px] font-poppins overflow-y-auto">
                    {loading && notifications.length === 0 ? (
                      <div className="flex items-center justify-center py-10 text-foreground">
                        Loading...
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-default-400">
                        <Bell className="w-12 h-12 mb-2 opacity-50" />
                        <p className="text-sm">No notifications found</p>
                      </div>
                    ) : (
                      <div>
                        {notifications.map((notification) => (
                          <div
                            key={notification._id}
                            className={`py-4 px-5 cursor-pointer ${
                              !notification.isRead
                                ? "bg-primary-50 dark:bg-primary-900/20"
                                : ""
                            } hover:bg-default-100 transition-colors border-b border-divider last:border-b-0`}
                            onClick={() =>
                              handleNotificationClick(notification)
                            }
                          >
                            <div className="flex items-start gap-3">
                              {/* Thumbnail Image (if exists) */}
                              {notification.data?.thumbnailUrl && (
                                <div className="flex-shrink-0">
                                  <img
                                    alt="Thumbnail"
                                    className="w-16 h-12 object-cover rounded-md"
                                    src={notification.data.thumbnailUrl}
                                  />
                                </div>
                              )}

                              <div className="flex-1 min-w-0 text-foreground">
                                <div className="flex items-start justify-between gap-2">
                                  <span className="font-semibold text-sm">
                                    {notification.title}
                                  </span>
                                  {!notification.isRead && (
                                    <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                                  )}
                                </div>
                                <div className="space-y-1.5 mt-1.5">
                                  <p className="text-sm text-default-600 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  <span className="text-xs text-default-400">
                                    {notification.createdAt
                                      ? formatDistanceToNow(
                                          new Date(notification.createdAt),
                                          {
                                            addSuffix: true,
                                          },
                                        )
                                      : ""}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {loading && notifications.length > 0 && (
                          <div className="flex items-center justify-center py-4 text-foreground">
                            Loading...
                          </div>
                        )}
                        {!loading && pagination?.page < pagination?.pages && (
                          <div className="px-5 py-3 flex justify-center border-t border-divider">
                            <Button
                              color="primary"
                              size="sm"
                              variant="flat"
                              onPress={() => {
                                const nextPage = pagination.page + 1;

                                dispatch(setPage(nextPage));
                                fetchNotifications({
                                  page: nextPage,
                                  append: true,
                                });
                              }}
                            >
                              See More
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default NotificationBell;
