"use client";
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Search,
  Clock,
  Utensils,
  AlertCircle,
} from "lucide-react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import PaginationComponent from "../../components/common/Pagination";

import useMealApi from "@/hooks/useMealApi";

export default function NutritionsByCategoryPage() {
  const { categoryId } = useParams();
  const router = useRouter();
  const { loading, fetchMeals, fetchMealCategories } = useMealApi();

  const [meals, setMeals] = useState([]);
  const [category, setCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const mealTypes = ["all", "Breakfast", "Lunch", "Dinner", "Snacks"];
  const timeframes = [
    { key: "all", label: "All Time" },
    { key: "today", label: "Today" },
    { key: "week", label: "This Week" },
    { key: "month", label: "This Month" },
  ];

  useEffect(() => {
    loadCategory();
  }, [categoryId]);

  useEffect(() => {
    loadMeals();
  }, [categoryId, selectedType, selectedTimeframe, currentPage]);

  const loadCategory = async () => {
    const res = await fetchMealCategories();

    if (res?.success && res?.data?.categories && Array.isArray(res.data.categories)) {
      const found = res.data.categories.find((c) => c._id === categoryId);

      if (found) setCategory(found);
    }
  };

  const loadMeals = async () => {
    const query = {
      category: categoryId,
      page: currentPage,
      limit: 12,
    };

    if (selectedType !== "all") query.type = selectedType;
    if (selectedTimeframe !== "all") query.timeframe = selectedTimeframe;

    const res = await fetchMeals(query);

    if (res?.success && res?.data && Array.isArray(res.data)) {
      setMeals(res.data);
      setTotalPages(res.pages || 1);
    }
  };

  const filteredMeals = useMemo(() => {
    if (!search) return meals;

    return meals.filter(
      (m) =>
        m.mealName.toLowerCase().includes(search.toLowerCase()) ||
        (Array.isArray(m.ingredients) &&
          m.ingredients.some((ing) =>
            ing.toLowerCase().includes(search.toLowerCase()),
          )),
    );
  }, [meals, search]);

  return (
    <div className="min-h-screen bg-[#FAF8FB] pb-24 font-poppins">
      {/* Header Section */}
      <div className="bg-white border-b border-[#F4EDF5] sticky top-0 z-30 pt-16">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 py-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <Button
                className="bg-slate-50 hover:bg-slate-100 rounded-xl"
                isIconOnly
                variant="flat"
                onPress={() => router.back()}
              >
                <ChevronLeft className="text-[#4A3B4C]" size={20} />
              </Button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#4A3B4C] flex items-center gap-3">
                  {category?.name || "Loading..."}
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Explore holistic nutrition plans and recipes
                </p>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-5">
                <Input
                  classNames={{
                    inputWrapper:
                      "bg-slate-50 border-none rounded-2xl h-12 shadow-sm",
                  }}
                  placeholder="Search recipes or ingredients..."
                  startContent={<Search className="text-slate-400" size={18} />}
                  value={search}
                  onValueChange={setSearch}
                />
              </div>

              <div className="md:col-span-3">
                <Select
                  className="md:col-span-3"
                  classNames={{
                    trigger:
                      "bg-slate-50 border-none rounded-2xl h-12 shadow-sm",
                  }}
                  placeholder="Meal Type"
                  selectedKeys={[selectedType]}
                  startContent={
                    <Utensils className="text-slate-400" size={18} />
                  }
                  onSelectionChange={(keys) =>
                    setSelectedType(Array.from(keys)[0])
                  }
                >
                  {mealTypes.map((type) => (
                    <SelectItem
                      key={type}
                      className="capitalize"
                      textValue={type}
                    >
                      {type === "all" ? "All Types" : type}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div className="md:col-span-4">
                <Select
                  className="md:col-span-4"
                  classNames={{
                    trigger:
                      "bg-slate-50 border-none rounded-2xl h-12 shadow-sm",
                  }}
                  placeholder="Timeframe"
                  selectedKeys={[selectedTimeframe]}
                  startContent={<Clock className="text-slate-400" size={18} />}
                  onSelectionChange={(keys) =>
                    setSelectedTimeframe(Array.from(keys)[0])
                  }
                >
                  {timeframes.map((tf) => (
                    <SelectItem key={tf.key} textValue={tf.label}>
                      {tf.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Meals Grid */}
      <div className="container mx-auto px-4 md:px-8 lg:px-16 mt-12">
        {loading && meals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Spinner
              color="primary"
              label="Finding your next meal..."
              size="lg"
            />
          </div>
        ) : (
          <>
            {filteredMeals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[48px] border-2 border-dashed border-slate-100 shadow-sm">
                <div className="p-6 bg-slate-50 rounded-full mb-6">
                  <AlertCircle className="text-slate-300" size={48} />
                </div>
                <h3 className="text-2xl font-bold text-[#4A3B4C] mb-2 uppercase tracking-wide">
                  No meals found
                </h3>
                <p className="text-slate-500 max-w-xs text-center border-t border-slate-50 pt-4 mt-2">
                  Try adjusting your filters or check back later for new
                  holistic recipes.
                </p>
                <Button
                  className="mt-8 bg-[#6D735C] text-white rounded-xl px-8"
                  onPress={() => {
                    setSelectedType("all");
                    setSelectedTimeframe("all");
                    setSearch("");
                  }}
                >
                  Reset All Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredMeals.map((meal) => (
                    <Card
                      key={meal._id}
                      isPressable
                      className="group border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden bg-white"
                      onPress={() =>
                        router.push(`/premium/nutritions/meal/${meal._id}`)
                      }
                    >
                      <CardBody className="p-0">
                        <div className="flex flex-col h-full">
                          {/* Image Section */}
                          <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
                            {meal.image ? (
                              <img
                                alt={meal.mealName}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                src={meal.image}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-200">
                                <Utensils size={48} strokeWidth={1} />
                              </div>
                            )}

                            {/* Badges */}
                            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                              <Chip
                                className="bg-white/90 backdrop-blur-md text-[#6D735C] font-semibold uppercase text-[9px] tracking-wider border-none shadow-sm h-6"
                                size="sm"
                              >
                                {meal.type}
                              </Chip>
                            </div>
                          </div>

                          {/* Content Section */}
                          <div className="p-4 flex flex-col flex-1">
                            <h3 className="text-base font-medium text-[#4A3B4C] line-clamp-1 group-hover:text-[#6D735C] transition-colors leading-tight">
                              {meal.mealName}
                            </h3>
                            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                              <span>{meal.category?.name || "Recipe"}</span>
                              <span className="w-1 h-1 bg-slate-200 rounded-full" />
                              <span>
                                {meal.date
                                  ? new Date(meal.date).toLocaleDateString(
                                      undefined,
                                      { month: "short", day: "numeric" },
                                    )
                                  : "Soon"}
                              </span>
                              {meal.day && (
                                <>
                                  <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                  <span>{meal.day}</span>
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
                <PaginationComponent
                  className="mt-16"
                  page={currentPage}
                  total={totalPages}
                  onChange={setCurrentPage}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
