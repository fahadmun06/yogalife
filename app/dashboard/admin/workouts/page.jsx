"use client";
import { useState, useEffect } from "react";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { Pagination } from "@heroui/pagination";
import { Card, CardBody } from "@heroui/card";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import {
  Plus,
  Search,
  Trash2,
  Edit,
  MoreVertical,
  Play,
  Clock,
  MessageSquare,
  Heart,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import ApiFunction from "@/components/api/apiFuntions";
import UploadWorkoutModal from "@/components/admin/UploadWorkoutModal";

export default function AdminWorkoutsPage() {
  const [workouts, setWorkouts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const { get, delete: del } = ApiFunction();

  const fetchData = async () => {
    setLoading(true);
    try {
      const query = `?page=${page}&limit=9${search ? `&search=${search}` : ""}${category ? `&category=${category}` : ""}`;
      const [workoutRes, categoryRes] = await Promise.all([
        get(`/workouts${query}`),
        get("/categories"),
      ]);

      if (workoutRes.success) {
        setWorkouts(workoutRes.data.workouts);
        setTotalPages(workoutRes.data.pages);
      }
      if (categoryRes.success) {
        setCategories(categoryRes.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, category]);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setPage(1);
      fetchData();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this workout?")) return;
    try {
      const res = await del(`/workouts/${id}`);
      if (res.success) {
        toast.success("Workout deleted");
        fetchData();
      }
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="flex flex-col gap-8 min-h-screen font-poppins">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#4A3B4C]">Workout Library</h1>
          <p className="text-gray-500">
            Manage and upload premium workout videos
          </p>
        </div>
        <Button
          className="bg-[#764979] text-white font-bold h-12 px-6 rounded-2xl shadow-premium hover:shadow-xl transition-all"
          startContent={<Plus size={20} />}
          onPress={() => setIsUploadModalOpen(true)}
        >
          Upload New Video
        </Button>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
        <Input
          className="md:col-span-2"
          placeholder="Search videos by title or description..."
          startContent={<Search className="text-gray-400" size={18} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearch}
          classNames={{
            inputWrapper: "bg-[#FCF6F5] border-none rounded-2xl h-12",
          }}
        />
        <Select
          placeholder="Filter by Category"
          selectedKeys={category ? [category] : []}
          onChange={(e) => setCategory(e.target.value)}
          classNames={{
            trigger: "bg-[#FCF6F5] border-none rounded-2xl h-12",
          }}
        >
          {/* Use a clear option for categories */}
          <SelectItem key="all" value="">
            All categories
          </SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat._id} value={cat._id}>
              {cat.name}
            </SelectItem>
          ))}
        </Select>
      </div>

      {/* Grid Section */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" color="secondary" />
        </div>
      ) : workouts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {workouts.map((workout) => (
            <Card
              key={workout._id}
              className="border-none bg-white rounded-[32px] overflow-hidden group hover:shadow-2xl transition-all duration-500"
            >
              <CardBody className="p-0">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={workout.thumbnailUrl}
                    alt={workout.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center ring-4 ring-white/30">
                      <Play className="text-white fill-current" size={32} />
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                    <Clock size={12} /> {workout.duration}
                  </div>
                </div>

                <div className="p-6 flex flex-col gap-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-3 py-1 bg-[#EFE6F5] text-[#764979] text-[10px] font-bold rounded-full uppercase tracking-widest">
                          {workout.category?.name}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-[#4A3B4C] line-clamp-1">
                        {workout.title}
                      </h3>
                    </div>
                    <Dropdown placement="bottom-end">
                      <DropdownTrigger>
                        <Button
                          isIconOnly
                          variant="light"
                          className="text-gray-400"
                        >
                          <MoreVertical size={20} />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Actions">
                        <DropdownItem
                          key="edit"
                          startContent={<Edit size={16} />}
                        >
                          Edit Workout
                        </DropdownItem>
                        <DropdownItem
                          key="delete"
                          className="text-danger"
                          color="danger"
                          startContent={<Trash2 size={16} />}
                          onPress={() => handleDelete(workout._id)}
                        >
                          Delete Video
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>

                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed h-10">
                    {workout.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-4 text-gray-400">
                      <div className="flex items-center gap-1">
                        <Heart
                          size={16}
                          className={
                            workout.favorites?.length > 0
                              ? "text-pink-500 fill-current"
                              : ""
                          }
                        />
                        <span className="text-xs font-bold">
                          {workout.favorites?.length || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare size={16} />
                        <span className="text-xs font-bold">
                          {workout.comments?.length || 0}
                        </span>
                      </div>
                    </div>
                    <div className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">
                      {new Date(workout.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-20 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
          <Video size={64} className="mb-4 opacity-20" />
          <p className="text-xl font-semibold">No workouts found</p>
          <p className="text-sm">
            Try changing your search or category filters
          </p>
        </div>
      )}

      {/* Pagination Section */}
      {totalPages > 1 && (
        <div className="flex justify-center pb-10">
          <Pagination
            total={totalPages}
            initialPage={page}
            onChange={setPage}
            classNames={{
              cursor: "bg-[#764979] text-white",
            }}
          />
        </div>
      )}

      {/* Modals */}
      <UploadWorkoutModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={fetchData}
        categories={categories}
      />
    </div>
  );
}
