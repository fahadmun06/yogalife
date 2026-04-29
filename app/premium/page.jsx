/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
"use client";
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect } from "react";
import { Tabs, Tab } from "@heroui/tabs";
import {
  Heart,
  Play,
  Video,
  Search,
  Send,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Pin,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Skeleton } from "@heroui/skeleton";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Avatar } from "@heroui/avatar";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

import useWorkoutApi from "@/hooks/useWorkoutApi";
import useMealApi from "@/hooks/useMealApi";
import PremiumHero from "@/components/premium-user-componenets/Hero";

export default function PremiumLandingPage() {
  const router = useRouter();
  const {
    fetchWorkouts,
    fetchCategories,
    fetchWorkoutById,
    toggleLike,
    toggleFavorite,
    addComment,
    replyToComment,
    pinComment,
  } = useWorkoutApi();
  const { fetchMealCategories } = useMealApi();

  const { user } = useSelector((state) => state.auth);

  const [workouts, setWorkouts] = useState([]);
  const [workoutCategories, setWorkoutCategories] = useState([]);
  const [mealCategories, setMealCategories] = useState([]);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Interaction States
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [replyText, setReplyText] = useState({});
  const [replyLoading, setReplyLoading] = useState({});
  const [showReplyFor, setShowReplyFor] = useState({});

  useEffect(() => {
    loadWorkouts();
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const res = await fetchCategories();

    if (
      res?.success &&
      res?.data?.categories &&
      Array.isArray(res.data.categories)
    ) {
      setWorkoutCategories(
        res.data.categories.filter((c) => c.type === "workout"),
      );
    }

    const mealRes = await fetchMealCategories();

    if (
      mealRes?.success &&
      mealRes?.data?.categories &&
      Array.isArray(mealRes.data.categories)
    ) {
      setMealCategories(mealRes.data.categories);
    }
  };

  const loadWorkouts = async () => {
    setLoading(true);
    try {
      const res = await fetchWorkouts();

      if (
        res?.success &&
        res?.data?.workouts &&
        Array.isArray(res.data.workouts)
      ) {
        setWorkouts(res.data.workouts);
        if (res.data.workouts.length > 0 && !activeWorkout) {
          setActiveWorkout(res.data.workouts[0]);
          loadWorkoutDetails(res.data.workouts[0]._id);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const loadWorkoutDetails = async (id) => {
    const res = await fetchWorkoutById(id);

    if (res?.data) {
      setActiveWorkout(res.data);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !activeWorkout) return;
    if (!user) return toast.error("Please login to comment");

    setCommentLoading(true);
    try {
      await addComment(activeWorkout._id, newComment);
      setNewComment("");
      // Refresh to get updated comments with user details
      loadWorkoutDetails(activeWorkout._id);
    } catch (error) {
      // Error is already toasted in the hook
    } finally {
      setCommentLoading(false);
    }
  };

  const handleReply = async (commentId) => {
    if (!replyText[commentId]?.trim() || !activeWorkout) return;
    if (!user) return toast.error("Please login to reply");

    setReplyLoading((prev) => ({ ...prev, [commentId]: true }));
    try {
      await replyToComment(activeWorkout._id, commentId, replyText[commentId]);
      setReplyText((prev) => ({ ...prev, [commentId]: "" }));
      setShowReplyFor((prev) => ({ ...prev, [commentId]: false }));
      loadWorkoutDetails(activeWorkout._id);
    } catch (error) {
      // Error is already toasted in the hook
    } finally {
      setReplyLoading((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  const handlePin = async (commentId) => {
    if (!activeWorkout) return;
    try {
      await pinComment(activeWorkout._id, commentId);
      loadWorkoutDetails(activeWorkout._id);
    } catch (error) {
      toast.error("Failed to pin comment");
    }
  };

  const handleLike = async (status) => {
    if (!user) return toast.error("Please login to like/dislike");
    if (!activeWorkout || likeLoading) return;

    setLikeLoading(true);

    // Optimistic Update
    const previousWorkout = { ...activeWorkout };
    const userId = user?._id;
    const currentLike = activeWorkout.likes?.find((l) => l.user === userId);

    let newLikes = [...(activeWorkout.likes || [])];
    let newLikeCount = activeWorkout.likeCount || 0;
    let newDislikeCount = activeWorkout.dislikeCount || 0;

    if (currentLike) {
      if (currentLike.status === status) {
        // Toggle off
        newLikes = newLikes.filter((l) => l.user !== userId);
        if (status === true) newLikeCount--;
        else newDislikeCount--;
      } else {
        // Switch status
        newLikes = newLikes.map((l) =>
          l.user === userId ? { ...l, status } : l,
        );
        if (status === true) {
          newLikeCount++;
          newDislikeCount--;
        } else {
          newLikeCount--;
          newDislikeCount++;
        }
      }
    } else {
      // New like/dislike
      newLikes.push({ user: userId, status });
      if (status === true) newLikeCount++;
      else newDislikeCount++;
    }

    setActiveWorkout({
      ...activeWorkout,
      likes: newLikes,
      likeCount: Math.max(0, newLikeCount),
      dislikeCount: Math.max(0, newDislikeCount),
    });

    try {
      await toggleLike(activeWorkout._id, status);
      // Background re-fetch to sync with server
      const res = await fetchWorkoutById(activeWorkout._id);

      if (res?.data) {
        setActiveWorkout(res.data);
      }
    } catch (error) {
      setActiveWorkout(previousWorkout);
      toast.error("Action failed");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!user) return toast.error("Please login to save workouts");
    if (!activeWorkout) return;

    setFavLoading(true);
    try {
      await toggleFavorite(activeWorkout._id);
      loadWorkoutDetails(activeWorkout._id);
      toast.success(
        activeWorkout.favorites?.includes(user?._id)
          ? "Removed from favorites"
          : "Added to favorites",
      );
    } catch (error) {
      toast.error("Action failed");
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <PremiumHero />

      {["free", "expired", "cancel", "canceled"].includes(
        user?.subscriptionStatus,
      ) && (
          <div className="container mx-auto px-4 md:px-8 lg:px-16 mt-8">
            <div className="bg-orange-50 border-l-4 border-orange-400 p-5 rounded-r-2xl shadow-sm flex items-center gap-4">
              <div className="bg-orange-100 p-2 rounded-full">
                <AlertCircle className="text-orange-600" size={24} />
              </div>
              <div>
                <h4 className="text-orange-800 font-bold text-lg mb-0.5">
                  Subscription Inactive
                </h4>
                <p className="text-orange-700 text-sm md:text-base">
                  Your premium access is currently{" "}
                  <span className="font-bold uppercase underline underline-offset-4 decoration-orange-300">
                    {user?.subscriptionStatus}
                  </span>
                  . Please{" "}
                  <Link
                    className="font-bold underline decoration-2 underline-offset-2 hover:text-orange-900 transition-colors"
                    href="/dashboard/subscription"
                  >
                    renew your subscription
                  </Link>{" "}
                  to unlock workouts, nutrition plans, and coaching.
                </p>
              </div>
            </div>
          </div>
        )}

      {/* Tabs Section */}
      <div
        className={`container mx-auto px-4 md:px-8 lg:px-16 pb-24 ${
          ["free", "expired", "cancel", "canceled"].includes(
            user?.subscriptionStatus,
          )
            ? "hidden"
            : ""
        }`}
      >
        <Tabs
          aria-label="Premium Content"
          className="font-poppins"
          classNames={{
            base: "w-full flex justify-center mt-3 mb-3",
            tabList:
              "gap-12 w-full justify-center relative rounded-none p-0 pb-2",
            cursor: "w-[150%] bg-[#6D735C]",
            tab: "max-w-fit px-0 h-14",
            tabContent:
              "font-poppins text-lg font-medium text-[#4A3B4C]/60 group-data-[selected=true]:text-[#6D735C] uppercase",
          }}
          variant="underlined"
        >
          <Tab key="workouts" title="Workouts">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 mt-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex flex-col gap-4 w-full">
                    <Skeleton className="aspect-video rounded-2xl" />
                    <div className="flex gap-3 px-1">
                      <Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
                      <div className="flex flex-col gap-2 flex-1">
                        <Skeleton className="h-4 w-3/4 rounded-lg" />
                        <Skeleton className="h-3 w-1/2 rounded-lg" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {!workouts || workouts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 bg-slate-50 rounded-[48px] border-2 border-dashed border-slate-200 mt-8">
                    <div className="p-6 bg-white rounded-full shadow-sm mb-6">
                      <Video className="text-slate-300" size={48} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">
                      No data found
                    </h3>
                    <p className="text-slate-500 max-w-xs text-center">
                      We couldn&apos;t find any workouts matching your criteria.
                      Please check back later.
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#FAF8FB] rounded-xl p-5  mt-8 border border-[#F4EDF5]">
                    {/* Header: Library Title & Search */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 px-2">
                      <div className="flex items-center gap-4">
                        <h2 className="text-xl md:text-2xl font-semibold text-[#4A3B4C] font-poppins">
                          Workout Library
                        </h2>
                      </div>
                      <div className="w-full md:w-72">
                        <Input
                          className="font-poppins"
                          classNames={{
                            inputWrapper:
                              "bg-white border-[#F4EDF5] rounded-xl shadow-sm h-10",
                          }}
                          placeholder="Search workouts..."
                          startContent={
                            <Search className="text-gray-400" size={16} />
                          }
                          value={searchQuery}
                          onValueChange={setSearchQuery}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6 ">
                      {/* Left Side: Player & Actions */}
                      <div className="w-full lg:w-[65%] flex flex-col gap-5">
                        {/* Visual Player */}
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-white shadow-lg border border-[#F4EDF5] group">
                          {activeWorkout ? (
                            <>
                              <img
                                alt={activeWorkout.title}
                                className="w-full h-full object-cover"
                                src={activeWorkout.thumbnailUrl}
                              />
                              {/* Simple Play Overlay */}
                              <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                                <Button
                                  isIconOnly
                                  className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md hover:scale-105 transition-transform"
                                  onPress={() =>
                                    router.push(
                                      `/premium/workouts/${activeWorkout._id}?autoplay=true`,
                                    )
                                  }
                                >
                                  <Play
                                    className="text-[#764979] fill-[#764979] ml-1"
                                    size={20}
                                  />
                                </Button>
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <Video size={40} />
                            </div>
                          )}
                        </div>

                        {/* Interaction Bar (Likes/Dislikes/Views) */}
                        <div className="flex items-center gap-6 px-1 border-b border-[#F4EDF5] pb-4">
                          <div className="flex items-center gap-6">
                            <button
                              className={`flex items-center cursor-pointer gap-2 transition-colors ${
                                likeLoading
                                  ? "opacity-70 cursor-not-allowed"
                                  : ""
                              } ${
                                activeWorkout?.likes?.find(
                                  (l) =>
                                    l.user === user?._id && l.status === true,
                                )
                                  ? "text-[#764979]"
                                  : "text-gray-400 hover:text-[#764979]"
                              }`}
                              disabled={likeLoading}
                              onClick={() => handleLike(true)}
                            >
                              <ThumbsUp
                                fill={
                                  activeWorkout?.likes?.find(
                                    (l) =>
                                      l.user === user?._id && l.status === true,
                                  )
                                    ? "currentColor"
                                    : "none"
                                }
                                size={20}
                              />
                              <span className="font-semibold text-sm">
                                {activeWorkout?.likeCount || 0}
                              </span>
                            </button>
                            <button
                              className={`flex items-center cursor-pointer gap-2 transition-colors ${
                                likeLoading
                                  ? "opacity-70 cursor-not-allowed"
                                  : ""
                              } ${
                                activeWorkout?.likes?.find(
                                  (l) =>
                                    l.user === user?._id && l.status === false,
                                )
                                  ? "text-orange-500"
                                  : "text-gray-400 hover:text-orange-500"
                              }`}
                              disabled={likeLoading}
                              onClick={() => handleLike(false)}
                            >
                              <ThumbsDown
                                fill={
                                  activeWorkout?.likes?.find(
                                    (l) =>
                                      l.user === user?._id &&
                                      l.status === false,
                                  )
                                    ? "currentColor"
                                    : "none"
                                }
                                size={20}
                              />
                              <span className="font-bold text-sm">
                                {activeWorkout?.dislikeCount || 0}
                              </span>
                            </button>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400 ml-auto">
                            <Eye size={18} />
                            <span className="font-semibold text-sm">
                              {activeWorkout?.views || 0} views
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 mt-2">
                          <Button
                            className={`rounded-lg capitalize text-sm font-medium flex-1 md:flex-none shadow-sm transition-all ${
                              activeWorkout?.favorites?.includes(user?._id)
                                ? "bg-red-50 text-red-500 border border-red-100"
                                : "bg-primary hover:bg-primary/80 text-white"
                            }`}
                            isLoading={favLoading}
                            onPress={handleFavorite}
                          >
                            {!favLoading && (
                              <Heart
                                className="mr-2"
                                fill={
                                  activeWorkout?.favorites?.includes(user?._id)
                                    ? "currentColor"
                                    : "none"
                                }
                                size={18}
                              />
                            )}
                            {activeWorkout?.favorites?.includes(user?._id)
                              ? "Saved to favorites"
                              : "Add to favorites"}
                          </Button>
                        </div>

                        {/* Comment Box */}
                        <div className="mt-4">
                          <div className="flex gap-2 p-1.5 bg-white rounded-xl border border-[#F4EDF5] shadow-sm">
                            <Input
                              isClearable
                              className="flex-1 font-poppins text-xs"
                              classNames={{
                                inputWrapper: "bg-transparent shadow-none",
                              }}
                              placeholder="Drop a comment..."
                              size="sm"
                              value={newComment}
                              variant="flat"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleAddComment();
                                }
                              }}
                              onValueChange={setNewComment}
                            />
                            <Button
                              isIconOnly
                              color="primary"
                              isDisabled={!newComment}
                              isLoading={commentLoading}
                              size="sm"
                              onPress={handleAddComment}
                            >
                              <Send className="rotate-[15deg]" size={14} />
                            </Button>
                          </div>

                          {/* Comment List (Brief) */}
                          {activeWorkout?.comments?.length > 0 && (
                            <div className="mt-8 flex flex-col gap-6 max-h-[400px] overflow-y-auto scrollbar-hide pr-2">
                              {activeWorkout.comments.map((comment) => (
                                <div
                                  key={comment._id}
                                  className="flex flex-col gap-3"
                                >
                                  <div className="flex gap-3 items-start">
                                    <Avatar
                                      className="flex-shrink-0"
                                      name={comment.user?.firstName}
                                      size="sm"
                                      src={comment.user?.profile}
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold text-[#4A3B4C]">
                                          {comment.user?.firstName}{" "}
                                          {comment.user?.lastName}
                                        </span>
                                        <span className="text-[10px] text-gray-400 ml-1">
                                          •{" "}
                                          {comment.createdAt
                                            ? formatDistanceToNow(
                                                new Date(comment.createdAt),
                                                { addSuffix: true },
                                              )
                                            : "just now"}
                                        </span>
                                        {comment.isPinned && (
                                          <span className="text-[9px] bg-[#764979]/10 text-[#764979] px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                                            <Pin fill="currentColor" size={8} />{" "}
                                            PINNED
                                          </span>
                                        )}
                                        {user?.role === "admin" && (
                                          <Button
                                            isIconOnly
                                            className={`h-5 w-5 min-w-0 rounded-full ml-auto ${comment.isPinned ? "text-[#764979]" : "text-gray-300"}`}
                                            size="sm"
                                            variant="light"
                                            onPress={() =>
                                              handlePin(comment._id)
                                            }
                                          >
                                            <Pin
                                              fill={
                                                comment.isPinned
                                                  ? "currentColor"
                                                  : "none"
                                              }
                                              size={10}
                                            />
                                          </Button>
                                        )}
                                      </div>
                                      <p
                                        className={`text-xs p-3 rounded-2xl rounded-tl-none border shadow-sm leading-relaxed ${
                                          comment.isPinned
                                            ? "bg-[#764979] text-white border-[#764979]"
                                            : "bg-white text-gray-600 border-[#F4EDF5]"
                                        }`}
                                      >
                                        {comment.text}
                                      </p>
                                      <button
                                        className="text-[10px] font-semibold text-gray-400 hover:text-[#764979] mt-1 ml-1 transition-colors uppercase cursor-pointer"
                                        onClick={() =>
                                          setShowReplyFor((prev) => ({
                                            ...prev,
                                            [comment._id]: !prev[comment._id],
                                          }))
                                        }
                                      >
                                        {showReplyFor[comment._id]
                                          ? "Cancel"
                                          : "Reply"}
                                      </button>
                                    </div>
                                  </div>

                                  {/* Replies */}
                                  {comment.replies?.length > 0 && (
                                    <div className="ml-10 flex flex-col gap-3">
                                      {comment.replies.map((reply) => (
                                        <div
                                          key={reply._id}
                                          className="flex gap-3 items-start"
                                        >
                                          <Avatar
                                            className="w-6 h-6 min-w-6 flex-shrink-0"
                                            name={reply.user?.firstName}
                                            size="sm"
                                            src={reply.user?.profile}
                                          />
                                          <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-bold text-[#4A3B4C] mb-1">
                                              {reply.user?.role === "admin"
                                                ? `Admin ${reply.user?.firstName}`
                                                : reply.user?.firstName}
                                              <span className="font-normal text-gray-400 ml-2">
                                                {reply.createdAt
                                                  ? formatDistanceToNow(
                                                      new Date(reply.createdAt),
                                                      { addSuffix: true },
                                                    )
                                                  : "just now"}
                                              </span>
                                            </p>
                                            <p
                                              className={`text-[11px] p-2.5 rounded-xl rounded-tl-none border shadow-sm ${
                                                reply.user?.role === "admin"
                                                  ? "bg-[#4A3B4C] text-white border-[#4A3B4C]"
                                                  : "bg-white text-gray-600 border-[#F4EDF5]"
                                              }`}
                                            >
                                              {reply.text}
                                            </p>
                                            <button
                                              className="text-[9px] font-semibold text-gray-400 hover:text-[#764979] mt-1 ml-1 transition-colors uppercase cursor-pointer"
                                              onClick={() => {
                                                setShowReplyFor((prev) => ({
                                                  ...prev,
                                                  [comment._id]: true,
                                                }));
                                                setReplyText((prev) => ({
                                                  ...prev,
                                                  [comment._id]: `@${reply.user?.firstName} `,
                                                }));
                                              }}
                                            >
                                              Reply
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* Reply Input */}
                                  {showReplyFor[comment._id] && (
                                    <div className="ml-10 flex gap-2 mt-2">
                                      <Input
                                        classNames={{
                                          inputWrapper:
                                            "bg-white/50 border-none h-8 rounded-lg",
                                        }}
                                        placeholder="Reply..."
                                        size="sm"
                                        value={replyText[comment._id] || ""}
                                        variant="flat"
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                            handleReply(comment._id);
                                          }
                                        }}
                                        onValueChange={(val) =>
                                          setReplyText({
                                            ...replyText,
                                            [comment._id]: val,
                                          })
                                        }
                                      />
                                      <Button
                                        isIconOnly
                                        className="bg-[#B89AB7]/40 text-[#4A3B4C] rounded-lg h-8 w-8 min-w-0"
                                        isLoading={replyLoading[comment._id]}
                                        size="sm"
                                        onPress={() => handleReply(comment._id)}
                                      >
                                        <Send size={12} />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Side: Next Sidebar */}
                      <div className="w-full lg:w-[35%] flex flex-col h-full">
                        <div className="bg-white rounded-xl border border-[#F4EDF5] shadow-md flex flex-col h-full overflow-hidden">
                          {/* Sidebar Header */}

                          {/* Sidebar List */}
                          <div className="p-3 flex flex-col gap-2 overflow-y-auto max-h-[600px] scrollbar-hide py-4">
                            {(searchQuery
                              ? workouts.filter((w) =>
                                  w.title
                                    .toLowerCase()
                                    .includes(searchQuery.toLowerCase()),
                                )
                              : workouts
                            ).map((workout) => (
                              <div
                                key={workout._id}
                                className={`group cursor-pointer flex gap-3 p-2 rounded-xl border-2 transition-all ${
                                  activeWorkout?._id === workout._id
                                    ? "bg-[#F9F5FA] border-[#B89AB7]/20"
                                    : "bg-white border-transparent hover:border-[#F4EDF5] hover:bg-slate-50"
                                }`}
                                role="button"
                                tabIndex={0}
                                onClick={() => loadWorkoutDetails(workout._id)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    loadWorkoutDetails(workout._id);
                                  }
                                }}
                              >
                                <div className="relative w-20 md:w-28 aspect-[1.4] rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                                  <img
                                    alt={workout.title}
                                    className="w-full h-full object-cover"
                                    src={workout.thumbnailUrl}
                                  />
                                </div>

                                <div className="flex flex-col justify-center min-w-0 flex-1 py-0.5">
                                  <h4 className="text-[13px] font-bold text-[#4A3B4C] line-clamp-1 leading-tight group-hover:text-[#764979] transition-colors mb-0.5">
                                    {workout.title}
                                  </h4>
                                  <p className="text-[10px] text-gray-400 font-medium leading-[1.3] line-clamp-2">
                                    {workout.duration || "29min"} •{" "}
                                    {workout.category?.name || "Intermediate"},
                                    Advanced, Core, Follicular, Luteal
                                  </p>
                                </div>

                                <div className="flex items-center justify-center pr-1">
                                  <ChevronRight
                                    className="text-gray-200 group-hover:text-[#B89AB7] transition-colors"
                                    size={14}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </Tab>

          <Tab key="nutrition" title="Nutrition">
            <div className="max-w-6xl mx-auto  text-center font-poppins w-full">
              <h2 className="text-2xl md:text-[32px] mb-12  tracking-[0.15em] uppercase text-[#64566A]">
                Holistic Nutrition Hub
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 px-4">
                {mealCategories.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center py-16 bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-100">
                    <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                      <AlertCircle className="text-slate-300" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 mb-1">
                      No Nutrition categories found
                    </h3>
                    <p className="text-slate-400 text-sm max-w-xs text-center">
                      We&apos;re currently updating our food hub. Please check
                      back soon for holistic recipes.
                    </p>
                  </div>
                ) : Array.isArray(mealCategories) &&
                  mealCategories.length > 0 ? (
                  mealCategories.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col bg-white rounded-[24px] overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer group border border-gray-100/50 max-w-[280px] mx-auto w-full"
                      onClick={() =>
                        router.push(`/premium/nutritions/${item._id}`)
                      }
                    >
                      <div className="relative aspect-square overflow-hidden bg-slate-100">
                        <img
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          src={
                            item.image ||
                            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800"
                          }
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                      <div className="p-6 flex flex-col items-center justify-center">
                        <h3 className="text-[#64566A] text-lg tracking-[0.1em] uppercase group-hover:text-[#6D735C] transition-colors mb-1">
                          {item.name}
                        </h3>
                        {item.desc && (
                          <p className="text-[10px] text-slate-400 line-clamp-1 italic">
                            {item.desc}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : null}
              </div>

              <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
                <Button
                  className="bg-zinc-100 hover:bg-zinc-200 text-[#64566A] rounded-2xl transition-all shadow-sm font-poppins font-semibold px-8 py-6"
                  onPress={() => router.push("/premium/nutritions")}
                >
                  Explore Internal Food Hub
                </Button>
                <a
                  className="bg-[#6D735C] hover:bg-[#5a604b] text-white rounded-2xl cursor-pointer transition-all shadow-sm font-poppins font-medium px-4 py-3"
                  href="https://circular-jute-e96.notion.site/Holistic-Nutrition-Hub-291005a59c8181a492cacf3953e2d45f?source=copy_link"
                  rel="noreferrer"
                  target="_blank"
                >
                  Explore Holistic Nutrition Hub
                </a>
              </div>
            </div>
          </Tab>

          <Tab key="health-coaching" title="Health Coaching">
            <div className="max-w-[1400px] mx-auto  text-center w-full">
              <h2 className="text-2xl md:text-[32px] font-bold text-[#554A4D] mb-4 uppercase tracking-widest">
                Find Your Class Style
              </h2>
              <p className="text-gray-500 text-sm md:text-base mb-12">
                Small, consistent movement — Pilates, strength, stretch, and
                reset sessions for Beginner • Intermediate • Advanced.
              </p>

              <div className="px-4">
                <Swiper
                  autoplay={{ delay: 3000, disableOnInteraction: false }}
                  breakpoints={{
                    320: { slidesPerView: 1 },
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                    1280: { slidesPerView: 4 },
                  }}
                  className="w-full text-center !pb-12"
                  loop={
                    Array.isArray(workoutCategories) &&
                    workoutCategories.length > 4
                  }
                  modules={[Autoplay]}
                  spaceBetween={24}
                >
                  {Array.isArray(workoutCategories) &&
                    workoutCategories.map((item, index) => (
                      <SwiperSlide key={item._id || index} className="h-auto">
                        <div className="flex flex-col bg-[#FDFBFB] rounded-3xl overflow-hidden border border-[#EDE0E7] shadow-sm hover:shadow-xl transition-all duration-300 group h-full">
                          <div className="relative h-[260px] overflow-hidden bg-slate-100 shrink-0">
                            <img
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              src={
                                item.image ||
                                "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800"
                              }
                            />
                          </div>
                          <div className="p-6 flex flex-col flex-grow items-center">
                            <h3 className="text-[#554A4D] font-poppins font-medium tracking-widest text-lg mb-4 uppercase whitespace-nowrap">
                              {item.name}
                            </h3>
                            <p className="text-[13px] sm:text-sm text-gray-500 mb-8 flex-grow leading-relaxed">
                              {item.desc ||
                                "Learn more about our " +
                                  item.name +
                                  " classes designed for your wellness journey."}
                            </p>
                            <Button
                              className="w-full bg-[#B89AB7] hover:bg-[#a68aa5] text-white font-medium rounded-xl py-6 tracking-wide text-sm transition-all shadow-sm shrink-0"
                              onPress={() =>
                                router.push(
                                  `/premium/workouts?category=${item._id}`,
                                )
                              }
                            >
                              {item.buttonText || `View ${item.name}`}
                            </Button>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  {(!Array.isArray(workoutCategories) ||
                    workoutCategories.length === 0) && (
                    <div className="w-full flex flex-col items-center justify-center py-16 bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-100">
                      <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                        <AlertCircle className="text-slate-300" size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-700 mb-1">
                        No Class Styles found
                      </h3>
                      <p className="text-slate-400 text-sm max-w-xs text-center">
                        We&apos;re refining our training styles. Check back soon
                        for Beginner, Intermediate and Advanced sessions.
                      </p>
                    </div>
                  )}
                </Swiper>
              </div>

              <div className="flex justify-center mt-12 pb-8">
                <Button
                  className="bg-[#B89AB7] hover:bg-[#a68aa5] text-white px-10 py-7 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-lg font-poppins tracking-wide"
                  onPress={() =>
                    window.open(
                      "https://calendly.com/your-calendar-link",
                      "_blank",
                    )
                  }
                >
                  Schedule Monthly Check-In
                </Button>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
