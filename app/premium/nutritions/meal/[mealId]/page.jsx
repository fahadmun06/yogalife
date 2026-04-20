"use client";
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Clock,
  Calendar,
  Utensils,
  AlertCircle,
  Hash,
} from "lucide-react";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Card, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";

import useMealApi from "@/hooks/useMealApi";

export default function MealDetailsPage() {
  const { mealId } = useParams();
  const router = useRouter();
  const { loading, fetchMealById } = useMealApi();
  const [meal, setMeal] = useState(null);

  useEffect(() => {
    if (mealId) {
      loadMeal();
    }
  }, [mealId]);

  const loadMeal = async () => {
    const res = await fetchMealById(mealId);

    if (res?.success && res?.data) {
      setMeal(res.data);
    }
  };

  if (loading && !meal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8FB]">
        <Spinner color="primary" label="Loading recipe details..." size="lg" />
      </div>
    );
  }

  if (!meal && !loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF8FB] p-4 text-center">
        <div className="p-6 bg-white rounded-full shadow-sm mb-6">
          <AlertCircle className="text-slate-300" size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Recipe Not Found
        </h2>
        <p className="text-slate-500 mb-8 max-w-sm">
          The recipe you are looking for might have been moved or deleted.
        </p>
        <Button
          className="bg-[#6D735C] text-white rounded-xl px-8"
          onPress={() => router.back()}
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8FB] pb-24 font-poppins">
      {/* Header */}
      <div className="bg-white  border-b border-[#F4EDF5] sticky top-0 z-30 pt-20">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 py-4 flex items-center gap-4">
          <Button
            isIconOnly
            className="bg-slate-50 hover:bg-slate-100 rounded-xl"
            variant="flat"
            onPress={() => router.back()}
          >
            <ChevronLeft className="text-slate-600" size={20} />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-lg md:text-xl font-bold text-[#4A3B4C] line-clamp-1">
              {meal?.mealName}
            </h1>
            <span className="text-xs text-slate-400 font-medium">
              {meal?.category?.name || "Nutritional Guide"}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 lg:px-16 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Image */}
          <div className="lg:col-span-7">
            <Card className="border-none shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-[40px] overflow-hidden bg-white">
              <CardBody className="p-0">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
                  {meal?.image ? (
                    <img
                      alt={meal.mealName}
                      className="w-full h-full object-cover"
                      src={meal.image}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                      <Utensils size={120} strokeWidth={1} />
                    </div>
                  )}
                  {/* Overlay Badges */}
                  <div className="absolute top-6 left-6 z-10 flex flex-col gap-3">
                    <Chip
                      className="bg-white/90 backdrop-blur-md text-[#6D735C] font-bold uppercase text-xs tracking-wider border-none shadow-sm px-4 py-1 h-auto"
                      size="lg"
                    >
                      {meal?.category?.name || "Recipe"}
                    </Chip>
                    <Chip
                      className="bg-[#6D735C]/90 backdrop-blur-md text-white font-bold uppercase text-xs tracking-wider border-none shadow-sm px-4 py-1 h-auto"
                      size="lg"
                      startContent={<Clock size={14} />}
                    >
                      {meal?.type}
                    </Chip>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Right Column: Info */}
          <div className="lg:col-span-5 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[#F8F9F4] rounded-xl">
                    <Calendar className="text-[#6D735C]" size={20} />
                  </div>
                  <span className="text-sm font-medium text-slate-400">
                    Scheduled
                  </span>
                </div>
                <p className="text-lg font-bold text-[#4A3B4C]">{meal?.day}</p>
                <p className="text-xs text-slate-400">
                  {meal?.date
                    ? new Date(meal.date).toLocaleDateString(undefined, {
                        dateStyle: "long",
                      })
                    : "Recently Added"}
                </p>
              </div>

              <div className="bg-white p-6 rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[#F8F9F4] rounded-xl">
                    <Clock className="text-[#6D735C]" size={20} />
                  </div>
                  <span className="text-sm font-medium text-slate-400">
                    Time
                  </span>
                </div>
                <p className="text-lg font-bold text-[#4A3B4C]">{meal?.time}</p>
                <p className="text-xs text-slate-400">Planned Consumption</p>
              </div>
            </div>

            {/* Ingredients Section */}
            <div className="bg-white p-8 rounded-[40px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-[#F8F9F4] rounded-2xl">
                  <Utensils className="text-[#6D735C]" size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#4A3B4C]">
                  Ingredients
                </h3>
              </div>

              <div className="flex flex-wrap gap-3">
                {Array.isArray(meal?.ingredients) &&
                meal.ingredients.length > 0 ? (
                  meal.ingredients.map((ing, i) => (
                    <Chip
                      key={i}
                      className="bg-slate-50 capitalize rounded-xl text-slate-600 border-none px-4 py-2 h-auto text-sm font-medium max-w-full"
                      classNames={{
                        content: "whitespace-normal break-words",
                      }}
                      // startContent={
                      //   <Hash
                      //     className="text-[#6D735C]/50 shrink-0"
                      //     size={14}
                      //   />
                      // }
                      variant="flat"
                    >
                      {ing}
                    </Chip>
                  ))
                ) : (
                  <p className="text-slate-400 italic text-sm">
                    No ingredients specified for this recipe.
                  </p>
                )}
              </div>
            </div>

            {/* Preparation/Tip Suggestion */}
            <div className="bg-[#6D735C] p-8 rounded-[40px] shadow-lg text-white">
              <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                <AlertCircle size={20} />
                Holistic Tip
              </h4>
              <p className="text-white/80 text-sm leading-relaxed">
                Enjoy this meal mindfully. Try to chew slowly and appreciate the
                flavors. Consistent nourishment is key to your holistic wellness
                journey.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
