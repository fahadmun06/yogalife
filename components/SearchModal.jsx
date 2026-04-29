"use client";
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useRef, useMemo } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { Skeleton } from "@heroui/skeleton";
import {
  Search,
  X,
  Activity,
  User,
  Book,
  Star,
  Settings,
  ChevronRight,
  Play,
  Utensils,
  Flower2,
  Apple,
} from "lucide-react";
import { useRouter } from "next/navigation";
import useWorkoutApi from "@/hooks/useWorkoutApi";
import useMealApi from "@/hooks/useMealApi";

const staticPages = [
  {
    title: "Home",
    path: "/premium",
    icon: <Activity className="w-4 h-4" />,
    category: "Navigation",
  },
  {
    title: "Your Studio",
    path: "/premium/workouts",
    icon: <Play className="w-4 h-4" />,
    category: "Workouts",
  },
  {
    title: "Nutrition",
    path: "/premium/nutritions",
    icon: <Utensils className="w-4 h-4" />,
    category: "Nutrition",
  },
  {
    title: "Profile Settings",
    path: "/premium/profile",
    icon: <User className="w-4 h-4" />,
    category: "Settings",
  },
  {
    title: "Account",
    path: "/premium/account",
    icon: <Settings className="w-4 h-4" />,
    category: "Settings",
  },
  {
    title: "Subscription",
    path: "/premium/subscription",
    icon: <Star className="w-4 h-4" />,
    category: "Settings",
  },
  {
    title: "Health Coaching",
    path: "/premium/health-coaching",
    icon: <Book className="w-4 h-4" />,
    category: "Coaching",
  },
];

const HighlightMatch = ({ text, match }) => {
  if (!match) return <span>{text}</span>;

  const parts = text?.split(new RegExp(`(${match})`, "gi"));

  return (
    <span>
      {parts?.map((part, i) =>
        part?.toLowerCase() === match?.toLowerCase() ? (
          <span
            key={i}
            className="text-[#6D735C] font-bold bg-[#6D735C]/10 rounded-sm italic"
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
};

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const [meals, setMeals] = useState([]);
  const [workoutCategories, setWorkoutCategories] = useState([]);
  const [mealCategories, setMealCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const { fetchWorkouts, fetchCategories } = useWorkoutApi();
  const { fetchMeals, fetchMealCategories } = useMealApi();

  const searchInputRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
      // Prefetch categories when modal opens
      loadAllCategories();
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const loadAllCategories = async () => {
    try {
      const [workoutCatRes, mealCatRes] = await Promise.all([
        fetchCategories(),
        fetchMealCategories(),
      ]);

      if (
        workoutCatRes?.success &&
        Array.isArray(workoutCatRes.data.categories)
      ) {
        setWorkoutCategories(workoutCatRes.data.categories);
      }
      if (mealCatRes?.success && Array.isArray(mealCatRes.data.categories)) {
        setMealCategories(mealCatRes.data.categories);
      }
    } catch {
      // Ignore
    }
  };

  // Handle Search Fetching
  useEffect(() => {
    const fetchData = async () => {
      if (query.trim().length < 2) {
        setWorkouts([]);
        setMeals([]);

        return;
      }
      setLoading(true);

      try {
        const [workoutRes, mealRes] = await Promise.all([
          fetchWorkouts(`?search=${query}`),
          fetchMeals({ search: query }),
        ]);

        // Handle cases where data might be an object containing the array (e.g., { workouts: [...] }) or the array itself
        setWorkouts(
          workoutRes?.data?.workouts ||
            (Array.isArray(workoutRes?.data) ? workoutRes.data : []),
        );
        setMeals(
          mealRes?.data?.meals ||
            (Array.isArray(mealRes?.data) ? mealRes.data : []),
        );

        setSelectedIndex(0);
      } catch {
        // Silently fail search errors
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchData, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const filteredPages = useMemo(() => {
    if (!query) return staticPages;

    return staticPages.filter(
      (page) =>
        page.title.toLowerCase().includes(query.toLowerCase()) ||
        page.category.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query]);

  const filteredWorkoutCategories = useMemo(() => {
    if (!query) return [];

    return workoutCategories.filter((cat) =>
      cat.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, workoutCategories]);

  const filteredMealCategories = useMemo(() => {
    if (!query) return [];

    return mealCategories.filter((cat) =>
      cat.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, mealCategories]);

  const allResults = useMemo(() => {
    const results = [];

    // 1. Pages
    filteredPages.forEach((p) => results.push({ type: "page", ...p }));

    // 2. Health Coaching / Workout Categories
    filteredWorkoutCategories.forEach((cat) =>
      results.push({
        type: "style",
        title: cat.name,
        description: cat.desc || "Training style",
        path: `/premium/workouts?category=${cat._id}`,
        icon: <Flower2 className="w-4 h-4" />,
        image: cat.image,
      }),
    );

    // 3. Nutrition Categories
    filteredMealCategories.forEach((cat) =>
      results.push({
        type: "nutrition-hub",
        title: cat.name,
        description: cat.desc || "Meal category",
        path: `/premium/nutritions/${cat._id}`,
        icon: <Apple className="w-4 h-4" />,
        image: cat.image,
      }),
    );

    // 4. Workouts
    const workoutsList = Array.isArray(workouts) ? workouts : [];
    workoutsList.forEach((w) =>
      results.push({
        type: "workout",
        ...w,
        title: w.title,
        path: `/premium/workouts/${w._id}`,
      }),
    );

    // 5. Meals
    const mealsList = Array.isArray(meals) ? meals : [];
    mealsList.forEach((m) =>
      results.push({
        type: "meal",
        ...m,
        title: m.title,
        path: `/premium/nutritions/${m._id}`,
      }),
    );

    return results;
  }, [
    filteredPages,
    filteredWorkoutCategories,
    filteredMealCategories,
    workouts,
    meals,
  ]);

  const handleNavigate = (path) => {
    if (!path) return;
    router.push(path);
    onClose();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(allResults.length, 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) =>
            (prev - 1 + allResults.length) % Math.max(allResults.length, 1),
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (allResults[selectedIndex]) {
          handleNavigate(allResults[selectedIndex].path);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, allResults]);

  useEffect(() => {
    // Scroll selected item into view
    const selectedElement = resultsRef.current?.querySelector(
      `[data-index="${selectedIndex}"]`,
    );

    if (selectedElement) {
      selectedElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selectedIndex]);

  return (
    <Modal
      backdrop="blur"
      hideCloseButton
      isOpen={isOpen}
      scrollBehavior="inside"
      size="2xl"
      onClose={onClose}
    >
      <ModalContent className="rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-zinc-950 font-poppins">
        <ModalHeader className="px-6 py-4 flex flex-col gap-1 border-b border-zinc-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-zinc-400" />
            <input
              ref={searchInputRef}
              className="flex-1 bg-transparent border-none outline-none text-lg text-zinc-900 dark:text-white placeholder-zinc-400 font-medium font-poppins"
              placeholder="Search pages, workouts, or meals..."
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                className="hover:bg-zinc-100 dark:hover:bg-white/10 p-1 rounded-full transition-colors"
                onClick={() => setQuery("")}
              >
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            )}
            <div className="bg-zinc-100 dark:bg-white/10 px-2 py-0.5 rounded text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
              ESC
            </div>
          </div>
        </ModalHeader>
        <ModalBody
          ref={resultsRef}
          className="p-0 max-h-[60vh] overflow-y-auto custom-scrollbar font-poppins"
        >
          {!query && (
            <div className="p-6">
              <p className="text-zinc-400 dark:text-zinc-500 text-sm font-semibold mb-4 px-2 uppercase tracking-wider">
                Quick Jump
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {staticPages.map((page, idx) => (
                  <button
                    key={page.path}
                    className={`flex items-center gap-3 p-3 rounded-2xl transition-all group border border-transparent hover:shadow-lg ${selectedIndex === idx ? "bg-zinc-100 dark:bg-white/10 text-zinc-900 dark:text-white border-zinc-200 dark:border-white/10 shadow-lg" : "hover:bg-zinc-50 dark:hover:bg-white/5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"}`}
                    data-index={idx}
                    onClick={() => handleNavigate(page.path)}
                  >
                    <div
                      className={`p-2 rounded-xl transition-colors ${selectedIndex === idx ? "bg-[#6D735C]/20 text-[#6D735C]" : "bg-zinc-100 dark:bg-white/5 group-hover:bg-[#6D735C]/10 group-hover:text-[#6D735C]"}`}
                    >
                      {page.icon}
                    </div>
                    <span className="font-medium">{page.title}</span>
                    <ChevronRight
                      className={`w-4 h-4 ml-auto transition-opacity ${selectedIndex === idx ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && (
            <div className="p-2 space-y-4">
              {/* Results */}
              {allResults.length > 0 ? (
                <div>
                  <div className="space-y-1">
                    {allResults.map((item, idx) => {
                      const isPage = item.type === "page";
                      const isWorkout = item.type === "workout";
                      const isMeal = item.type === "meal";
                      const isStyle = item.type === "style";
                      const isNutritionHub = item.type === "nutrition-hub";

                      return (
                        <button
                          key={`${item.type}-${item.path}-${idx}`}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group ${selectedIndex === idx ? "bg-zinc-100 dark:bg-white/10 text-zinc-900 dark:text-white" : "hover:bg-zinc-50 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"}`}
                          data-index={idx}
                          onClick={() => handleNavigate(item.path)}
                        >
                          <div
                            className={`p-2 rounded-lg transition-colors ${selectedIndex === idx ? "bg-[#6D735C]/20 text-[#6D735C]" : "bg-zinc-100 dark:bg-white/5 group-hover:bg-[#6D735C]/10 group-hover:text-[#6D735C]"}`}
                          >
                            {isPage ? (
                              item.icon
                            ) : isWorkout || isStyle ? (
                              <Play className="w-4 h-4" />
                            ) : (
                              <Utensils className="w-4 h-4" />
                            )}
                          </div>

                          {(isWorkout ||
                            isMeal ||
                            isStyle ||
                            isNutritionHub) && (
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5">
                              {(item.thumbnail || item.image) && (
                                <img
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                  src={item.thumbnail || item.image}
                                />
                              )}
                            </div>
                          )}

                          <div className="text-left flex-1">
                            <p className="font-medium text-sm line-clamp-1">
                              <HighlightMatch match={query} text={item.title} />
                            </p>
                            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 line-clamp-1">
                              {isPage ? (
                                item.category
                              ) : (
                                <HighlightMatch
                                  match={query}
                                  text={
                                    item.description || "Sanctuary Wellness Content"
                                  }
                                />
                              )}
                            </p>
                          </div>
                          <div className="text-[10px] text-zinc-400 dark:text-zinc-600 font-mono uppercase mr-2">
                            {item.type}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {loading && (
                <div className="space-y-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3">
                      <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
                      <div className="flex flex-col gap-2 flex-1">
                        <Skeleton className="h-4 w-2/3 rounded-lg" />
                        <Skeleton className="h-3 w-1/3 rounded-lg" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {!loading && allResults.length === 0 && query && (
                <div className="px-4 py-12 text-center text-zinc-400 dark:text-zinc-500">
                  <p className="text-lg mb-1 text-zinc-900 dark:text-white">
                    No results for &quot;{query}&quot;
                  </p>
                  <p className="text-sm">
                    Try searching for workouts, meals or page titles.
                  </p>
                </div>
              )}
            </div>
          )}
        </ModalBody>
        <div className="px-6 py-4 border-t border-zinc-100 dark:border-white/5 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between">
          <div className="flex gap-4 text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-bold font-poppins">
            <span className="flex items-center gap-1">
              <span className="bg-zinc-200 dark:bg-white/10 px-1 rounded text-zinc-600 dark:text-zinc-300">
                ⏎
              </span>{" "}
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <span className="bg-zinc-200 dark:bg-white/10 px-1 rounded text-zinc-600 dark:text-zinc-300">
                ↑↓
              </span>{" "}
              Select
            </span>
          </div>
          <div className="text-[10px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1 font-poppins">
            Sanctuary Wellness
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
