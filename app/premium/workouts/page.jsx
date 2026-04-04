/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/click-events-have-key-events */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Input } from "@heroui/input";
import { Pagination } from "@heroui/pagination";
import { Skeleton } from "@heroui/skeleton";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import {
  Search,
  Play,
  Heart,
  MessageSquare,
  ThumbsUp,
  Eye,
  MoreVertical,
  Video,
} from "lucide-react";

import useWorkoutApi from "@/hooks/useWorkoutApi";

export default function WorkoutsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");
  const { user } = useSelector((state) => state.auth);
  const { fetchWorkouts, toggleFavorite } = useWorkoutApi();

  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadWorkouts(page, searchQuery, categoryId);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, page, categoryId]);

  const loadWorkouts = async (currentPage, search, catId) => {
    setLoading(true);
    let query = `?page=${currentPage}&limit=${limit}`;

    if (search) {
      query += `&search=${encodeURIComponent(search)}`;
    }

    if (catId) {
      query += `&category=${catId}`;
    }

    const res = await fetchWorkouts(query);

    if (res?.data?.workouts) {
      setWorkouts(res.data.workouts);
      setTotalPages(res.data.pages || 1);
    }
    setLoading(false);
  };

  const handleFavorite = async (id) => {
    await toggleFavorite(id);
    loadWorkouts(page, searchQuery);
  };

  return (
    <div className="min-h-screen bg-[#FCF6F5] pt-28 pb-12 font-poppins">
      <div className="container mx-auto px-4 sm:px-6 lg:px-16">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-poppins font-semibold text-[#4A3B4C] mb-2">
              All Workouts
            </h1>
            <p className="text-gray-500 text-sm md:text-base">
              Browse, search, and continue your wellness journey.
            </p>
          </div>
          <div className="w-full md:w-72">
            <Input
              isClearable
              placeholder="Search workouts..."
              startContent={<Search className="text-gray-400 mr-2" size={20} />}
              value={searchQuery}
              variant="faded"
              onValueChange={(val) => {
                setSearchQuery(val);
                setPage(1); // Reset to first page on new search
              }}
            />
          </div>
        </div>

        {user?.subscriptionStatus !== "free" &&
          user?.subscriptionStatus !== "active" && (
            <div className="mb-10">
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
                      href="/dashboard/subscription"
                      className="font-bold underline decoration-2 underline-offset-2 hover:text-orange-900 transition-colors"
                    >
                      renew your subscription
                    </Link>{" "}
                    to view and filter premium workouts.
                  </p>
                </div>
              </div>
            </div>
          )}

        {user?.subscriptionStatus === "active" &&
          (loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col gap-4 w-full">
                  <Skeleton className="aspect-video rounded-3xl" />
                  <div className="flex gap-3 px-1 mt-2">
                    <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                    <div className="flex flex-col gap-2 flex-1 pt-1">
                      <Skeleton className="h-4 w-[85%] rounded-lg" />
                      <Skeleton className="h-3 w-[60%] rounded-lg" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {!workouts || workouts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[40px] shadow-sm border border-gray-100 mt-8">
                  <div className="p-6 bg-[#FCF6F5] rounded-full mb-6">
                    <Video className="text-[#A78AB7]" size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#4A3B4C] mb-2 font-poppins">
                    No workouts found
                  </h3>
                  <p className="text-gray-500 max-w-sm text-center">
                    We couldn&apos;t find any workouts matching your criteria. Try adjusting your filters.
                  </p>
                  {(searchQuery || categoryId) && (
                    <Button
                      className="mt-6 bg-[#C0A9CE] hover:bg-[#B399C3] text-white rounded-xl shadow-sm"
                      onPress={() => {
                        setSearchQuery("");
                        router.push("/premium/workouts");
                      }}
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-12">
                  {workouts.map((workout) => (
                    <div key={workout._id} className="group cursor-pointer">
                      {/* Thumbnail Container */}
                      <div
                        className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 mb-4 shadow-sm border border-gray-100"
                        role="button"
                        tabIndex={0}
                        onClick={() =>
                          router.push(`/premium/workouts/${workout._id}`)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            router.push(`/premium/workouts/${workout._id}`);
                          }
                        }}
                      >
                        <img
                          alt={workout.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          src={workout.thumbnailUrl || "/img/placeholder.png"}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                        {/* Duration Overlay */}
                        <div className="absolute font-poppins bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-1 rounded-lg">
                          {workout.duration || "00:00"}
                        </div>

                        {/* Hover Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-14 h-14 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center ring-1 ring-white/30 transform group-hover:scale-110 transition-transform shadow-xl">
                            <Play
                              className="text-white fill-current translate-x-0.5"
                              size={24}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="flex gap-3 px-2">
                        {/* Text Info */}
                        <div className="flex-1 min-w-0 pr-1">
                          <h3
                            className="text-base font-bold text-[#4A3B4C] line-clamp-2 leading-snug mb-1.5 group-hover:text-[#764979] transition-colors"
                            onClick={() =>
                              router.push(`/premium/workouts/${workout._id}`)
                            }
                          >
                            {workout.title}
                          </h3>
                          <div className="flex flex-col text-sm text-gray-500">
                            <span className="font-medium hover:text-[#764979] transition-colors text-[13px] uppercase tracking-wide">
                              {workout.category?.name || "Workout"}
                            </span>

                            <div className="flex items-center gap-4 mt-2.5">
                              <div className="flex items-center gap-1.5 hover:text-[#764979] transition-colors">
                                <ThumbsUp
                                  className={
                                    workout.likeCount > 0
                                      ? "text-[#764979] fill-[#764979]/10"
                                      : ""
                                  }
                                  size={15}
                                />
                                <span className="text-xs font-semibold">
                                  {workout.likeCount || 0}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 hover:text-[#764979] transition-colors">
                                <MessageSquare
                                  className={
                                    workout.commentCount > 0
                                      ? "text-[#764979] fill-[#764979]/10"
                                      : ""
                                  }
                                  size={15}
                                />
                                <span className="text-xs font-semibold">
                                  {workout.commentCount || 0}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
                                <Heart
                                  className={
                                    workout.favoriteCount > 0
                                      ? "text-red-500 fill-red-500"
                                      : ""
                                  }
                                  size={15}
                                />
                                <span className="text-xs font-semibold">
                                  {workout.favoriteCount || 0}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 mt-2.5 opacity-70">
                              <Eye size={14} />
                              <span className="text-[11px] font-medium">
                                {workout.views || 0} views
                              </span>
                              <span className="w-1 h-1 bg-gray-300 rounded-full mx-0.5" />
                              <span className="text-[11px] font-medium">
                                {new Date(workout.createdAt).toLocaleDateString(
                                  undefined,
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  },
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions Menu */}
                        <div className="flex-shrink-0">
                          <Dropdown
                            classNames={{
                              content:
                                "rounded-xl border-none shadow-xl py-2 min-w-[150px]",
                            }}
                            placement="bottom-end"
                          >
                            <DropdownTrigger>
                              <Button
                                isIconOnly
                                className="text-gray-400 hover:text-[#4A3B4C] hover:bg-white h-8 w-8 min-w-0 mt-[-2px] rounded-full transition-colors"
                                variant="light"
                              >
                                <MoreVertical size={18} />
                              </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Workout Actions">
                              <DropdownItem
                                key="view"
                                className="py-2.5"
                                startContent={<Eye size={16} />}
                                onPress={() =>
                                  router.push(
                                    `/premium/workouts/${workout._id}`,
                                  )
                                }
                              >
                                View Workout
                              </DropdownItem>
                              <DropdownItem
                                key="favorite"
                                className="py-2.5"
                                onPress={() => handleFavorite(workout._id)}
                                startContent={
                                  <Heart
                                    className={
                                      workout.favoriteCount > 0
                                        ? "text-red-500"
                                        : ""
                                    }
                                    size={16}
                                  />
                                }
                              >
                                {workout.favoriteCount > 0
                                  ? "Remove Favorite"
                                  : "Add to Favorites"}
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && !loading && (
                <div className="flex justify-center mt-16 pb-8">
                  <Pagination
                    showControls
                    classNames={{
                      wrapper:
                        "gap-2 shadow-sm rounded-2xl bg-white p-2 border border-gray-100",
                      item: "w-10 h-10 text-base rounded-xl font-medium bg-transparent hover:bg-gray-100",
                      cursor:
                        "bg-[#764979] rounded-xl text-white font-medium shadow-md",
                    }}
                    color="secondary"
                    page={page}
                    total={totalPages}
                    onChange={(newPage) => setPage(newPage)}
                  />
                </div>
              )}
            </>
          ))}
      </div>
    </div>
  );
}
