/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
"use client";
import { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Progress } from "@heroui/progress";
import { toast } from "sonner";
import { Upload, Video, X, Clock, Activity, HardDrive } from "lucide-react";

import { useSocket } from "@/context/SocketProvider";
import ApiFunction from "@/components/api/apiFuntions";

export default function UploadWorkoutModal({
  isOpen,
  onClose,
  onUploadSuccess,
  categories,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    videoUrl: "",
    thumbnailUrl: "",
    duration: "0:00",
  });

  const formatETA = (seconds) => {
    if (!seconds) return "0s";
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);

    if (m > 0) return `${m}m ${s}s`;

    return `${s}s`;
  };

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const socket = useSocket();
  const { post } = ApiFunction();
  const fileInputRef = useRef(null);
  const thumbInputRef = useRef(null);

  useEffect(() => {
    if (socket) {
      socket.on("upload_progress", (data) => {
        setUploadProgress(data);
      });

      socket.on("upload_success", (data) => {
        if (data.resourceType === "video") {
          setFormData((prev) => ({
            ...prev,
            videoUrl: data.url,
            duration: data.duration || "0:00",
          }));
          toast.success("Video uploaded successfully!");
        } else if (data.resourceType === "image") {
          setFormData((prev) => ({ ...prev, thumbnailUrl: data.url }));
          toast.success("Thumbnail uploaded successfully!");
        }
        setUploading(false);
        setUploadProgress(null);
      });

      socket.on("upload_error", (data) => {
        toast.error(data.message);
        setUploading(false);
        setUploadProgress(null);
      });

      return () => {
        socket.off("upload_progress");
        socket.off("upload_success");
        socket.off("upload_error");
      };
    }
  }, [socket]);

  const handleFileUpload = (file, type) => {
    if (!file || !socket) return;

    setUploading(true);
    setUploadProgress({ progress: 0, stage: "starting" });

    const reader = new FileReader();
    const CHUNK_SIZE = 1024 * 512; // 512KB chunks
    let offset = 0;

    socket.emit("upload_start", {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });

    socket.once("upload_request_id", ({ uploadId }) => {
      const uploadNextChunk = () => {
        if (offset < file.size) {
          const chunk = file.slice(offset, offset + CHUNK_SIZE);

          reader.readAsArrayBuffer(chunk);
          reader.onload = (e) => {
            socket.emit("upload_chunk", { uploadId, chunk: e.target.result });
            offset += CHUNK_SIZE;
            uploadNextChunk();
          };
        }
      };

      uploadNextChunk();
    });
  };

  const handleSubmit = async () => {
    if (!formData.videoUrl || !formData.thumbnailUrl) {
      toast.error("Please upload both video and thumbnail first");

      return;
    }

    try {
      const response = await post("/workouts", formData);

      if (response.success) {
        toast.success("Workout published successfully!");
        onUploadSuccess();
        onClose();
        setFormData({
          title: "",
          description: "",
          category: "",
          videoUrl: "",
          thumbnailUrl: "",
          duration: "0:00",
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to publish workout");
    }
  };

  return (
    <Modal isOpen={isOpen} scrollBehavior="inside" size="3xl" onClose={onClose}>
      <ModalContent className="font-poppins">
        <ModalHeader className="flex flex-col gap-1 text-2xl font-bold text-[#4A3B4C]">
          Upload New Workout
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <Input
                label="Workout Title"
                placeholder="e.g. Advanced Pilates Flow"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <Select
                label="Category"
                placeholder="Select a category"
                selectedKeys={formData.category ? [formData.category] : []}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </Select>
              <Textarea
                label="Description"
                placeholder="Describe the workout exercises and benefits..."
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col gap-6">
              {/* Video Upload */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Workout Video
                </label>
                {formData.videoUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-green-500 bg-black aspect-video flex items-center justify-center">
                    <Video className="text-green-500" size={40} />
                    <button
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          videoUrl: "",
                          duration: "0:00",
                        })
                      }
                    >
                      <X size={16} />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white flex items-center gap-1">
                      <Clock size={12} /> {formData.duration}
                    </div>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-[#A78AB7]/30 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-[#FCF6F5] hover:bg-[#F4EDF5] transition-colors cursor-pointer group"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <div className="p-4 rounded-full bg-white text-[#764979] group-hover:scale-110 transition-transform">
                      <Video size={32} />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-[#4A3B4C]">
                        Click to upload video
                      </p>
                      <p className="text-xs text-gray-500">
                        MP4, MOV up to 100MB
                      </p>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  accept="video/*"
                  className="hidden"
                  disabled={uploading}
                  type="file"
                  onChange={(e) => handleFileUpload(e.target.files[0], "video")}
                />
              </div>

              {/* Thumbnail Upload */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Thumbnail Image
                </label>
                {formData.thumbnailUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-green-500 aspect-video">
                    <img
                      className="w-full h-full object-cover"
                      src={formData.thumbnailUrl}
                    />
                    <button
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                      onClick={() =>
                        setFormData({ ...formData, thumbnailUrl: "" })
                      }
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-[#A78AB7]/30 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 bg-[#FCF6F5] hover:bg-[#F4EDF5] transition-colors cursor-pointer group"
                    onClick={() => thumbInputRef.current.click()}
                  >
                    <div className="p-3 rounded-full bg-white text-[#764979] group-hover:scale-110 transition-transform">
                      <Upload size={24} />
                    </div>
                    <p className="font-semibold text-[#4A3B4C] text-sm">
                      Upload Thumbnail
                    </p>
                  </div>
                )}
                <input
                  ref={thumbInputRef}
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  type="file"
                  onChange={(e) => handleFileUpload(e.target.files[0], "image")}
                />
              </div>
            </div>
          </div>

          {/* Progress Indicators */}
          {uploadProgress && (
            <div className="mt-8 p-6 bg-[#4A3B4C] rounded-[32px] text-white shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <Activity className="text-[#A78AB7]" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Uploading Assets...</h4>
                    <p className="text-[10px] text-white/60 uppercase tracking-widest">
                      {uploadProgress.stage.replace("_", " ")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black">
                    {uploadProgress.progress}%
                  </span>
                </div>
              </div>

              <Progress
                className="h-2"
                classNames={{
                  indicator: "bg-gradient-to-r from-[#A78AB7] to-[#764979]",
                  track: "bg-white/10",
                }}
                value={uploadProgress.progress}
              />

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-white/60">
                    <Activity size={12} />
                    <span className="text-[10px] uppercase font-bold tracking-tighter">
                      Speed
                    </span>
                  </div>
                  <span className="text-sm font-bold">
                    {uploadProgress.formattedSpeed || "0.00 MB/s"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-white/60">
                    <Clock size={12} />
                    <span className="text-[10px] uppercase font-bold tracking-tighter">
                      ETA
                    </span>
                  </div>
                  <span className="text-sm font-bold">
                    {formatETA(uploadProgress.eta)} remaining
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-white/60">
                    <HardDrive size={12} />
                    <span className="text-[10px] uppercase font-bold tracking-tighter">
                      Size
                    </span>
                  </div>
                  <span className="text-sm font-bold">
                    {uploadProgress.remainingMB || 0} MB left
                  </span>
                </div>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter className="border-t border-gray-100">
          <Button disabled={uploading} variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-[#764979] text-white font-bold px-8"
            disabled={uploading || !formData.videoUrl || !formData.thumbnailUrl}
            onPress={handleSubmit}
          >
            Publish Workout
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
