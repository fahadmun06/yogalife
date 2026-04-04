"use client";
import React, { useState, useEffect, useRef } from "react";
import { Card, CardBody } from "@heroui/card";
import { Progress } from "@heroui/progress";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import {
  Upload,
  Video,
  X,
  Clock,
  Activity,
  HardDrive,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { useSocket } from "@/context/SocketProvider";
import ApiFunction from "@/components/api/apiFuntions";

export default function BannerManagementPage() {
  const [formData, setFormData] = useState({
    title: "Intro Video",
    videoUrl: "",
    thumbnailUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);

  const socket = useSocket();
  const { get, post } = ApiFunction();
  const fileInputRef = useRef(null);
  const thumbInputRef = useRef(null);

  const formatETA = (seconds) => {
    if (!seconds) return "0s";
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    setLoading(true);
    try {
      const res = await get("/banner");
      if (res.success && res.data) {
        setFormData({
          title: res.data.title || "Intro Video",
          videoUrl: res.data.videoUrl || "",
          thumbnailUrl: res.data.thumbnailUrl || "",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
      const response = await post("/banner", formData);
      if (response.success) {
        toast.success("Banner updated successfully!");
        fetchBanner();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update banner");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" color="secondary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 min-h-screen font-poppins">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-[#4A3B4C]">
          Intro Banner Management
        </h1>
        <p className="text-gray-500">
          Update the main intro video and thumbnail for the premium hero section
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-premium rounded-[32px] p-6">
          <CardBody className="flex flex-col gap-6">
            <Input
              label="Banner Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="font-bold"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Video Upload */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Intro Video
                </label>
                {formData.videoUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-[#764979] bg-black aspect-video flex items-center justify-center">
                    <Video className="text-[#A78AB7]" size={40} />
                    <button
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      onClick={() => setFormData({ ...formData, videoUrl: "" })}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-[#A78AB7]/30 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-[#FCF6F5] hover:bg-[#F4EDF5] transition-colors cursor-pointer group h-full min-h-[160px]"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <div className="p-4 rounded-full bg-white text-[#764979] group-hover:scale-110 transition-transform">
                      <Video size={32} />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-[#4A3B4C]">
                        Upload Video
                      </p>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="video/*"
                  onChange={(e) => handleFileUpload(e.target.files[0], "video")}
                  disabled={uploading}
                />
              </div>

              {/* Thumbnail Upload */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Banner Thumbnail
                </label>
                {formData.thumbnailUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-[#764979] aspect-video">
                    <img
                      src={formData.thumbnailUrl}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <button
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      onClick={() =>
                        setFormData({ ...formData, thumbnailUrl: "" })
                      }
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-[#A78AB7]/30 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-[#FCF6F5] hover:bg-[#F4EDF5] transition-colors cursor-pointer group h-full min-h-[160px]"
                    onClick={() => thumbInputRef.current.click()}
                  >
                    <div className="p-4 rounded-full bg-white text-[#764979] group-hover:scale-110 transition-transform">
                      <Upload size={32} />
                    </div>
                    <p className="font-semibold text-[#4A3B4C] text-sm">
                      Upload Thumbnail
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  ref={thumbInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e.target.files[0], "image")}
                  disabled={uploading}
                />
              </div>
            </div>

            <Button
              className="bg-[#764979] text-white font-bold h-14 rounded-2xl shadow-premium mt-4"
              startContent={<Save size={20} />}
              onPress={handleSubmit}
              disabled={
                uploading || !formData.videoUrl || !formData.thumbnailUrl
              }
            >
              Update Banner
            </Button>
          </CardBody>
        </Card>

        {/* Progress Card */}
        <div className="flex flex-col gap-6">
          {uploadProgress ? (
            <Card className="border-none bg-[#4A3B4C] rounded-[32px] text-white p-8 shadow-2xl">
              <CardBody className="p-0 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/10 rounded-2xl">
                      <Activity size={24} className="text-[#A78AB7]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Uploading Assets...</h4>
                      <p className="text-xs text-white/60 uppercase tracking-widest">
                        {uploadProgress.stage.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black">
                      {uploadProgress.progress}%
                    </span>
                  </div>
                </div>

                <Progress
                  value={uploadProgress.progress}
                  className="h-3"
                  classNames={{
                    indicator: "bg-gradient-to-r from-[#A78AB7] to-[#764979]",
                    track: "bg-white/10 shadow-inner",
                  }}
                />

                <div className="grid grid-cols-3 gap-6">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-white/60">
                      <Activity size={14} />
                      <span className="text-xs uppercase font-bold tracking-tighter">
                        Speed
                      </span>
                    </div>
                    <span className="text-base font-bold">
                      {uploadProgress.formattedSpeed || "0.00 MB/s"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-white/60">
                      <Clock size={14} />
                      <span className="text-xs uppercase font-bold tracking-tighter">
                        ETA
                      </span>
                    </div>
                    <span className="text-base font-bold">
                      {formatETA(uploadProgress.eta)} left
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-white/60">
                      <HardDrive size={14} />
                      <span className="text-xs uppercase font-bold tracking-tighter">
                        Size
                      </span>
                    </div>
                    <span className="text-base font-bold">
                      {uploadProgress.remainingMB || 0} MB left
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          ) : (
            <Card className="border-none shadow-premium rounded-[32px] bg-slate-50 border border-slate-100 flex items-center justify-center p-12 text-center text-slate-400">
              <div className="flex flex-col items-center gap-4">
                <Activity size={48} className="opacity-20" />
                <p className="font-medium">Upload progress will appear here</p>
              </div>
            </Card>
          )}

          {/* Tips Card */}
          <Card className="border-none bg-gradient-to-br from-[#764979] to-[#4A3B4C] text-white rounded-[32px] p-6 shadow-premium">
            <CardBody className="p-0">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <Video size={18} /> Optimization Tips
              </h4>
              <ul className="text-sm text-white/80 space-y-2 list-disc list-inside">
                <li>Recommended aspect ratio: 16:9</li>
                <li>Keep videos under 1 minute for better loading</li>
                <li>Use high-quality thumbnails (1280x720px)</li>
                <li>Supported formats: MP4, MOV, WEBM</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
