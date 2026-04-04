/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable jsx-a11y/no-static-element-interactions */
"use client";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Spinner } from "@heroui/spinner";
import { Button } from "@heroui/button";
import { Skeleton } from "@heroui/skeleton";
import {
  Heart,
  ThumbsUp,
  ThumbsDown,
  ChevronLeft,
  Send,
  Play,
  Pin,
  Search,
} from "lucide-react";
import { Input } from "@heroui/input";
import { Avatar } from "@heroui/avatar";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

import useWorkoutApi from "@/hooks/useWorkoutApi";

export default function WorkoutDetails() {
  const { id } = useParams();
  const router = useRouter();
  const {
    fetchWorkoutById,
    toggleLike,
    toggleFavorite,
    replyToComment,
    addComment,
    pinComment,
    incrementView,
    loading,
    fetchWorkouts,
  } = useWorkoutApi();

  const { user } = useSelector((state) => state.auth);

  const [workout, setWorkout] = useState(null);
  const [nextWorkouts, setNextWorkouts] = useState([]);
  const [sidebarPage, setSidebarPage] = useState(1);
  const [hasMoreSidebar, setHasMoreSidebar] = useState(true);
  const [sidebarFetching, setSidebarFetching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [replyText, setReplyText] = useState({});
  const [replyLoading, setReplyLoading] = useState({});
  const [showReplyFor, setShowReplyFor] = useState({});
  const [favLoading, setFavLoading] = useState(false);

  const videoRef = useRef(null);
  const searchParams = useSearchParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasIncrementedView, setHasIncrementedView] = useState(false);

  useEffect(() => {
    loadWorkout();
  }, [id]);

  useEffect(() => {
    if (
      workout &&
      searchParams.get("autoplay") === "true" &&
      videoRef.current
    ) {
      const playVideo = async () => {
        try {
          await videoRef.current.play();
          setIsPlaying(true);
          if (!hasIncrementedView) {
            incrementView(id);
            setHasIncrementedView(true);
          }
        } catch (error) {
          console.error("Autoplay failed:", error);
        }
      };
      playVideo();
    }
  }, [workout]);

  useEffect(() => {
    setSidebarPage(1);
    setNextWorkouts([]);
    setHasMoreSidebar(true);
  }, [searchQuery, id]);

  useEffect(() => {
    const timer = setTimeout(
      () => {
        loadNextWorkouts(searchQuery, sidebarPage);
      },
      sidebarPage === 1 ? 500 : 0,
    );

    return () => clearTimeout(timer);
  }, [searchQuery, id, sidebarPage]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
        if (!hasIncrementedView) {
          incrementView(id);
          setHasIncrementedView(true);
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const loadWorkout = async () => {
    const res = await fetchWorkoutById(id);

    if (res?.data) setWorkout(res.data);
  };

  const loadNextWorkouts = async (query = "", pageNum = 1) => {
    const queryParams = new URLSearchParams({
      page: pageNum,
      limit: 6,
      excludeId: id,
    });

    if (query) queryParams.append("search", query);

    setSidebarFetching(true);
    try {
      const res = await fetchWorkouts(`?${queryParams.toString()}`);

      if (res?.data) {
        const newWorkouts = res.data.workouts || [];

        if (pageNum === 1) {
          setNextWorkouts(newWorkouts);
        } else {
          setNextWorkouts((prev) => [...prev, ...newWorkouts]);
        }
        setHasMoreSidebar(pageNum < (res.data.pages || 1));
      }
    } finally {
      setSidebarFetching(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment) return;
    setCommentLoading(true);
    try {
      await addComment(id, newComment);
      setNewComment("");
      loadWorkout();
    } finally {
      setCommentLoading(false);
    }
  };

  const handleReply = async (commentId) => {
    if (!replyText[commentId]) return;
    setReplyLoading((prev) => ({ ...prev, [commentId]: true }));
    try {
      await replyToComment(id, commentId, replyText[commentId]);
      setReplyText((prev) => ({ ...prev, [commentId]: "" }));
      setShowReplyFor((prev) => ({ ...prev, [commentId]: false }));
      loadWorkout();
    } finally {
      setReplyLoading((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  const handleLike = async (status) => {
    if (!user) return toast.error("Please login to like/dislike");
    await toggleLike(id, status);
    loadWorkout();
  };

  const handleFavorite = async () => {
    if (!user) return toast.error("Please login to save workouts");
    setFavLoading(true);
    try {
      await toggleFavorite(id);
      loadWorkout();
    } finally {
      setFavLoading(false);
    }
  };

  const handlePin = async (commentId) => {
    await pinComment(id, commentId);
    loadWorkout();
  };

  if (loading && !workout) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner color="primary" label="Loading workout..." size="lg" />
      </div>
    );
  }

  if (!workout) return null;

  return (
    <div className="min-h-screen bg-white font-poppins pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-16 space-y-8">
        <Button
          as={Link}
          className="font-semibold text-[#764979]"
          href="/premium/workouts"
          prefetch={false}
          startContent={<ChevronLeft size={20} />}
          variant="light"
        >
          Back to Library
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Area: Video, Stats, Comments */}
          <div className="lg:col-span-8 space-y-8">
            {/* Video Player */}
            <div
              className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl group cursor-pointer"
              onClick={togglePlay}
            >
              <video
                ref={videoRef}
                className="w-full h-full object-contain"
                controls={isPlaying}
                poster={workout.thumbnailUrl}
                src={workout.videoUrl}
                style={{ aspectRatio: "16/9" }}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
              />
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-all">
                  <Button
                    isIconOnly
                    className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-xl ring-8 ring-white/10 shadow-2xl transform group-hover:scale-110 transition-transform"
                  >
                    <Play
                      className="text-white fill-current translate-x-1"
                      size={40}
                    />
                  </Button>
                </div>
              )}
            </div>

            {/* Title and Meta Section */}
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-[#4A3B4C]">
                {workout.title}
              </h1>
              <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                <span>{workout.views || 0} views</span>
                <span>•</span>
                <span>
                  {workout.createdAt
                    ? formatDistanceToNow(new Date(workout.createdAt), {
                        addSuffix: true,
                      })
                    : "recently"}
                </span>
              </div>
            </div>

            {/* Interaction Bar & Description Section */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-6 items-center border-b border-gray-100 pb-4">
                <div className="flex items-center gap-6">
                  <button
                    className={`flex items-center cursor-pointer gap-2 transition-colors ${
                      workout.likes?.find(
                        (l) => l.user === user?._id && l.status === true,
                      )
                        ? "text-[#764979]"
                        : "text-gray-400 hover:text-[#764979]"
                    }`}
                    onClick={() => handleLike(true)}
                  >
                    <ThumbsUp
                      fill={
                        workout.likes?.find(
                          (l) => l.user === user?._id && l.status === true,
                        )
                          ? "currentColor"
                          : "none"
                      }
                      size={20}
                    />
                    <span className="font-bold text-sm">
                      {workout.likeCount}
                    </span>
                  </button>
                  <button
                    className={`flex items-center cursor-pointer gap-2 transition-colors ${
                      workout.likes?.find(
                        (l) => l.user === user?._id && l.status === false,
                      )
                        ? "text-orange-500"
                        : "text-gray-400 hover:text-orange-500"
                    }`}
                    onClick={() => handleLike(false)}
                  >
                    <ThumbsDown
                      fill={
                        workout.likes?.find(
                          (l) => l.user === user?._id && l.status === false,
                        )
                          ? "currentColor"
                          : "none"
                      }
                      size={20}
                    />
                    <span className="font-bold text-sm">
                      {workout.dislikeCount}
                    </span>
                  </button>
                </div>

                <div className="ml-auto">
                  <Button
                    className={`rounded-xl capitalize  text-sm font-medium transition-all ${
                      workout.favorites?.includes(user?._id)
                        ? "bg-red-50 text-red-500 border border-red-100"
                        : "bg-primary hover:bg-[#B89AB7] text-white"
                    }`}
                    isLoading={favLoading}
                    onPress={handleFavorite}
                  >
                    {!favLoading && (
                      <Heart
                        fill={
                          workout.favorites?.includes(user?._id)
                            ? "currentColor"
                            : "none"
                        }
                        size={16}
                      />
                    )}
                    {workout.favorites?.includes(user?._id)
                      ? "Saved"
                      : "Add to favorites"}
                  </Button>
                </div>
              </div>

              <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100/50">
                <p className="text-gray-600 leading-relaxed text-sm">
                  {workout.description}
                </p>
              </div>
            </div>

            <Divider className="opacity-50" />

            {/* Comments Section */}
            <div className="space-y-6">
              <div className="rounded-xl p-6 lg:p-0">
                <div className="flex gap-4 items-center mb-6">
                  <Avatar
                    className="flex-shrink-0"
                    name={user?.firstName}
                    size="md"
                    src={user?.profile}
                  />
                  <Input
                    classNames={{
                      input: "text-gray-600 font-poppins text-sm",
                      inputWrapper: "bg-white border-none shadow-sm h-10",
                    }}
                    placeholder="Drop a comment..."
                    value={newComment}
                    onValueChange={setNewComment}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddComment();
                      }
                    }}
                  />
                  <Button
                    color="primary"
                    isDisabled={
                      !newComment ||
                      commentLoading ||
                      newComment?.trim()?.length === 0
                    }
                    isLoading={commentLoading}
                    variant="shadow"
                    onPress={handleAddComment}
                  >
                    Post
                  </Button>
                </div>

                <div className="space-y-6">
                  {workout.comments?.map((comment) => (
                    <div key={comment._id} className="space-y-3">
                      <div className="flex gap-3">
                        <Avatar
                          name={comment.user?.firstName}
                          size="sm"
                          src={comment.user?.profile}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-[#4A3B4C] flex items-center gap-2">
                            {comment.user?.firstName} {comment.user?.lastName}
                            <span className="text-[10px] text-gray-400 ml-1 font-normal">
                              •{" "}
                              {comment.createdAt
                                ? formatDistanceToNow(
                                    new Date(comment.createdAt),
                                    { addSuffix: true },
                                  )
                                : "just now"}
                            </span>
                            {comment.isPinned && (
                              <span className="text-[10px] bg-[#764979]/10 text-[#764979] px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Pin fill="currentColor" size={10} /> PINNED
                              </span>
                            )}
                            {user?.role === "admin" && (
                              <Button
                                isIconOnly
                                className={`h-6 w-6 rounded-full ml-auto ${comment.isPinned ? "text-[#764979]" : "text-gray-300"}`}
                                size="sm"
                                variant="light"
                                onPress={() => handlePin(comment._id)}
                              >
                                <Pin
                                  fill={
                                    comment.isPinned ? "currentColor" : "none"
                                  }
                                  size={14}
                                />
                              </Button>
                            )}
                          </p>
                          <p
                            className={`text-sm p-3 rounded-2xl rounded-tl-none mt-1 shadow-sm leading-relaxed ${
                              comment.isPinned
                                ? "bg-[#764979] text-white"
                                : "bg-white text-gray-600 border border-[#EFE6F5]"
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
                            {showReplyFor[comment._id] ? "Cancel" : "Reply"}
                          </button>
                        </div>
                      </div>

                      {/* Replies */}
                      {comment.replies?.length > 0 && (
                        <div className="ml-10 space-y-4">
                          {comment.replies.map((reply) => (
                            <div key={reply._id} className="flex gap-3">
                              <Avatar
                                name={reply.user?.firstName}
                                size="sm"
                                src={reply.user?.profile}
                              />
                              <div className="flex-1">
                                <p className="text-xs font-bold text-[#4A3B4C] flex items-center gap-2">
                                  {reply.user?.role === "admin"
                                    ? `Admin ${reply.user?.firstName}`
                                    : `${reply.user?.firstName} ${reply.user?.lastName}`}
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
                                  className={`text-sm p-3 rounded-2xl rounded-tl-none mt-1 shadow-sm leading-relaxed ${
                                    reply.user?.role === "admin"
                                      ? "bg-[#4A3B4C] text-white"
                                      : "bg-white text-gray-600 border border-[#EFE6F5]"
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
                              inputWrapper: "bg-white/70 border-none h-10",
                            }}
                            placeholder="Reply..."
                            size="sm"
                            value={replyText[comment?._id] || ""}
                            variant="flat"
                            onValueChange={(val) =>
                              setReplyText({
                                ...replyText,
                                [comment?._id]: val,
                              })
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleReply(comment._id);
                              }
                            }}
                          />
                          <Button
                            isIconOnly
                            className="w-10 h-10 min-w-0"
                            color="primary"
                            isDisabled={
                              !replyText[comment?._id] ||
                              replyLoading[comment?._id] ||
                              replyText[comment?._id]?.trim()?.length === 0
                            }
                            isLoading={replyLoading[comment?._id]}
                            variant="shadow"
                            onPress={() => handleReply(comment?._id)}
                          >
                            <Send size={14} />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar Area */}
          <div className="lg:col-span-4 space-y-6">
            <Input
              placeholder="Search workouts"
              startContent={<Search className="text-gray-400" size={20} />}
              value={searchQuery}
              isClearable
              variant="faded"
              onValueChange={setSearchQuery}
            />

            <Card className="rounded-xl border-none shadow-sm bg-white overflow-hidden">
              <CardBody className="p-0">
                {/* <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#4A3B4C] font-bold">
                  <ChevronLeft className="rotate-90" size={20} />
                  <span>Next</span>
                </div>
                <div className="w-5 h-5 border-2 border-gray-200 rounded flex items-center justify-center transform rotate-45">
                  <div className="w-1 h-1 bg-gray-200 rounded-full" />
                </div>
              </div> */}

                <div className="max-h-[800px] overflow-y-auto custom-scrollbar p-2 space-y-2">
                  {sidebarFetching && sidebarPage === 1 ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex gap-4 p-3 rounded-xl">
                        <Skeleton className="w-32 aspect-[4/3] rounded-xl flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4 rounded-lg" />
                          <Skeleton className="h-3 w-full rounded-lg" />
                          <Skeleton className="h-3 w-1/2 rounded-lg" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      {nextWorkouts.map((item) => (
                        <div
                          key={item._id}
                          className="flex gap-4 p-3 rounded-xl hover:bg-[#FCF6F5] transition-all group cursor-pointer"
                          onClick={() =>
                            router.push(`/premium/workouts/${item._id}`)
                          }
                        >
                          <div className="relative w-32 aspect-[4/3] rounded-xl overflow-hidden flex-shrink-0 shadow-sm border border-gray-100">
                            <img
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              src={item.thumbnailUrl}
                            />
                            <div className="absolute right-2 bottom-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm font-medium">
                              {item.duration || "24:00"}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0 pr-4">
                            <h3 className="font-bold text-[#4A3B4C] text-[13px] leading-tight line-clamp-2">
                              {item.title}
                            </h3>
                            <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <ChevronLeft
                              className="rotate-180 text-gray-300 group-hover:text-primary transition-colors"
                              size={16}
                            />
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {hasMoreSidebar && nextWorkouts.length > 0 && (
                    <div className="p-4 flex justify-center">
                      <Button
                        className="text-[#764979] font-bold"
                        isLoading={sidebarFetching}
                        variant="light"
                        onPress={() => setSidebarPage((p) => p + 1)}
                      >
                        See More
                      </Button>
                    </div>
                  )}

                  {nextWorkouts.length === 0 && !sidebarFetching && (
                    <div className="p-10 text-center text-gray-400 italic text-sm">
                      {searchQuery
                        ? "No matches found."
                        : "No more workouts available."}
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
