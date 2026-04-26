"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Input,
  Card,
  Spinner,
  Skeleton,
  Select,
  SelectItem,
  Progress,
  Textarea,
} from "@heroui/react";
import {
  Save,
  Mail,
  Phone,
  MapPin,
  Share2,
  Info,
  Globe,
  Plus,
  Trash2,
  Image as ImageIcon,
  Upload,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import ApiFunction from "@/components/api/apiFuntions";
import { footerApi } from "@/components/api/ApiRoutesFile";
import { useSocket } from "@/context/SocketProvider";

const ICON_OPTIONS = [
  { label: "Instagram", value: "Instagram" },
  { label: "Email / Mail", value: "Mail" },
  { label: "WhatsApp", value: "MessageCircle" },
  { label: "TikTok", value: "Music2" },
  { label: "Facebook", value: "Facebook" },
  { label: "Twitter", value: "Twitter" },
  { label: "YouTube", value: "Youtube" },
  { label: "LinkedIn", value: "Linkedin" },
];

const PAGE_OPTIONS = [
  { label: "Home", value: "/" },
  { label: "About", value: "/about" },
  { label: "Services", value: "/services" },
  { label: "Testimonials", value: "/testimonials" },
  { label: "Pricing", value: "/pricing" },
  { label: "FAQ", value: "/faq" },
  { label: "Contact", value: "/contact" },
];

export default function AdminFooterPage() {
  const [data, setData] = useState({
    brand: { logo: "", aboutTitle: "About Us", tagline: "" },
    contactInfo: { phone: "", email: "" },
    address: { line1: "", city: "", country: "" },
    socialLinks: [],
    supportLinks: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);

  const { get, put: post } = ApiFunction();
  const socket = useSocket();
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await get(footerApi.get);
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load footer settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (socket) {
      const handleUploadSuccess = (uploadData) => {
        setData((prev) => ({
          ...prev,
          brand: { ...prev.brand, logo: uploadData.url },
        }));
        toast.success("Logo uploaded!");
        setUploading(false);
        setUploadProgress(null);
      };

      const handleUploadError = (errData) => {
        toast.error(errData.message);
        setUploading(false);
        setUploadProgress(null);
      };

      const handleUploadProgress = (progData) => {
        setUploadProgress(progData);
      };

      socket.on("upload_success", handleUploadSuccess);
      socket.on("upload_error", handleUploadError);
      socket.on("upload_progress", handleUploadProgress);

      return () => {
        socket.off("upload_success", handleUploadSuccess);
        socket.off("upload_error", handleUploadError);
        socket.off("upload_progress", handleUploadProgress);
      };
    }
  }, [socket]);

  const handleFileUpload = (file) => {
    if (!file || !socket) return;
    setUploading(true);

    const reader = new FileReader();
    const CHUNK_SIZE = 1024 * 512;
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

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await post(footerApi.update, data);
      if (res.success) {
        toast.success("Footer updated successfully");
      }
    } catch (err) {
      toast.error("Failed to update footer");
    } finally {
      setSaving(false);
    }
  };

  const addSocialLink = () => {
    setData({
      ...data,
      socialLinks: [
        ...data.socialLinks,
        { label: "", href: "", iconName: "Instagram" },
      ],
    });
  };

  const removeSocialLink = (index) => {
    const newLinks = [...data.socialLinks];
    newLinks.splice(index, 1);
    setData({ ...data, socialLinks: newLinks });
  };

  const addSupportLink = () => {
    setData({
      ...data,
      supportLinks: [...data.supportLinks, { name: "", href: "/" }],
    });
  };

  const removeSupportLink = (index) => {
    const newLinks = [...data.supportLinks];
    newLinks.splice(index, 1);
    setData({ ...data, supportLinks: newLinks });
  };

  if (loading) {
    return (
      <div className="space-y-6 p-4">
        <Skeleton className="h-10 w-1/4 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-60 w-full rounded-3xl" />
          <Skeleton className="h-60 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-poppins pb-10 px-0 md:px-4 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50 p-4 sm:p-6 rounded-[30px] backdrop-blur-sm border border-white/20 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Footer Management</h1>
          <p className="text-gray-500 text-xs sm:text-sm">
            Customize your website&apos;s footer content
          </p>
        </div>
        <Button
          className="font-bold rounded-xl w-full sm:w-auto"
          color="primary"
          isLoading={saving}
          size="md"
          startContent={!saving && <Save size={20} />}
          variant="shadow"
          onPress={handleSave}
        >
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
        {/* Brand & Logo */}
        <Card className="p-4 sm:p-6 space-y-6 border-none shadow-md rounded-[30px]">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
              <ImageIcon size={20} />
            </div>
            <h2 className="text-lg font-bold">Business Logo</h2>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 p-4 sm:p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <div className="w-32 h-32 rounded-full bg-white overflow-hidden border shadow-inner flex-shrink-0 relative">
              {uploading && (
                <div className="absolute inset-0 z-50 backdrop-blur-md bg-black/60 flex flex-col items-center justify-center p-4 text-white">
                  <Activity
                    className="text-[#24b47e] animate-pulse mb-2"
                    size={24}
                  />
                  <Progress
                    aria-label="Upload Progress"
                    className="h-1"
                    color="success"
                    size="sm"
                    value={uploadProgress?.progress || 0}
                  />
                </div>
              )}
              {data.brand?.logo ? (
                <img
                  alt="Logo"
                  className="w-full h-full object-cover"
                  src={data.brand.logo}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <ImageIcon size={32} />
                </div>
              )}
            </div>
            <div className="space-y-3 text-center md:text-left flex-1">
              <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">
                Best: Square PNG with transparent background. This logo will
                appear in the footer circle.
              </p>
              <Button
                className="font-bold rounded-xl w-full sm:w-auto"
                color="secondary"
                isLoading={uploading}
                size="sm"
                startContent={<Upload size={18} />}
                variant="shadow"
                onPress={() => fileInputRef.current.click()}
              >
                {data.brand?.logo ? "Change Logo" : "Upload Logo"}
              </Button>
              <input
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) handleFileUpload(file);
                }}
              />
            </div>
          </div>
        </Card>

        {/* About Section */}
        <Card className="p-4 sm:p-6 space-y-6 border-none shadow-md rounded-[30px]">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Info size={20} />
            </div>
            <h2 className="text-lg font-bold">About Us Content</h2>
          </div>

          <Input
            classNames={{
              inputWrapper: "bg-gray-50 border-none h-12 rounded-xl",
            }}
            label="Section Heading"
            labelPlacement="outside"
            placeholder="e.g., About Us"
            value={data.brand?.aboutTitle}
            onChange={(e) =>
              setData({
                ...data,
                brand: { ...data.brand, aboutTitle: e.target.value },
              })
            }
          />

          <Textarea
            classNames={{ inputWrapper: "bg-gray-50 border-none rounded-xl" }}
            label="Description"
            labelPlacement="outside"
            minRows={4}
            placeholder="I can't wait for you to join me..."
            value={data.brand?.tagline}
            onChange={(e) =>
              setData({
                ...data,
                brand: { ...data.brand, tagline: e.target.value },
              })
            }
          />
        </Card>

        {/* Contact & Address */}
        <Card className="p-4 sm:p-6 space-y-6 border-none shadow-md rounded-[30px]">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <MapPin size={20} />
            </div>
            <h2 className="text-lg font-bold">Contact & Address</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              classNames={{
                inputWrapper: "bg-gray-50 border-none h-12 rounded-xl",
              }}
              label="Email"
              labelPlacement="outside"
              startContent={<Mail className="text-gray-400" size={16} />}
              value={data.contactInfo?.email}
              onChange={(e) =>
                setData({
                  ...data,
                  contactInfo: { ...data.contactInfo, email: e.target.value },
                })
              }
            />
            <Input
              classNames={{
                inputWrapper: "bg-gray-50 border-none h-12 rounded-xl",
              }}
              label="Phone"
              labelPlacement="outside"
              startContent={<Phone className="text-gray-400" size={16} />}
              value={data.contactInfo?.phone}
              onChange={(e) =>
                setData({
                  ...data,
                  contactInfo: { ...data.contactInfo, phone: e.target.value },
                })
              }
            />
          </div>

          <Input
            classNames={{
              inputWrapper: "bg-gray-50 border-none h-12 rounded-xl",
            }}
            label="Address"
            labelPlacement="outside"
            value={data.address?.line1}
            onChange={(e) =>
              setData({
                ...data,
                address: { ...data.address, line1: e.target.value },
              })
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              classNames={{
                inputWrapper: "bg-gray-50 border-none h-12 rounded-xl",
              }}
              label="City"
              labelPlacement="outside"
              value={data.address?.city}
              onChange={(e) =>
                setData({
                  ...data,
                  address: { ...data.address, city: e.target.value },
                })
              }
            />
            <Input
              classNames={{
                inputWrapper: "bg-gray-50 border-none h-12 rounded-xl",
              }}
              label="Country"
              labelPlacement="outside"
              value={data.address?.country}
              onChange={(e) =>
                setData({
                  ...data,
                  address: { ...data.address, country: e.target.value },
                })
              }
            />
          </div>
        </Card>

        {/* Social Links */}
        <Card className="p-4 sm:p-6 space-y-4 border-none shadow-md rounded-[30px]">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-pink-100 rounded-lg text-pink-600">
                <Share2 size={20} />
              </div>
              <h2 className="text-lg font-bold">Social Links</h2>
            </div>
            <Button
              className="rounded-xl font-bold"
              color="secondary"
              size="sm"
              startContent={<Plus size={16} />}
              onPress={addSocialLink}
            >
              Add Link
            </Button>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {data.socialLinks?.map((link, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row gap-3 items-start sm:items-end bg-gray-50 p-4 rounded-2xl border border-gray-100 group relative"
              >
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                  <Input
                    classNames={{ inputWrapper: "bg-white" }}
                    label="Label"
                    labelPlacement="outside"
                    placeholder="Instagram"
                    size="sm"
                    value={link.label}
                    onChange={(e) => {
                      const newLinks = [...data.socialLinks];
                      newLinks[index].label = e.target.value;
                      setData({ ...data, socialLinks: newLinks });
                    }}
                  />
                  <Input
                    classNames={{ inputWrapper: "bg-white" }}
                    label="URL"
                    labelPlacement="outside"
                    placeholder="https://..."
                    size="sm"
                    value={link.href}
                    onChange={(e) => {
                      const newLinks = [...data.socialLinks];
                      newLinks[index].href = e.target.value;
                      setData({ ...data, socialLinks: newLinks });
                    }}
                  />
                  <Select
                    classNames={{ trigger: "bg-white" }}
                    label="Icon"
                    labelPlacement="outside"
                    placeholder="Icon"
                    selectedKeys={link.iconName ? [link.iconName] : []}
                    size="sm"
                    onSelectionChange={(keys) => {
                      const newLinks = [...data.socialLinks];
                      newLinks[index].iconName = Array.from(keys)[0];
                      setData({ ...data, socialLinks: newLinks });
                    }}
                  >
                    {ICON_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <Button
                  isIconOnly
                  className="rounded-xl shrink-0 absolute top-2 right-2 sm:static"
                  color="danger"
                  size="sm"
                  variant="flat"
                  onPress={() => removeSocialLink(index)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Support Links */}
        <Card className="p-4 sm:p-6 xl:col-span-2 space-y-4 border-none shadow-md rounded-[30px]">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg text-green-600">
                <Globe size={20} />
              </div>
              <h2 className="text-lg font-bold">Support Links</h2>
            </div>
            <Button
              className="rounded-xl font-bold"
              color="secondary"
              size="sm"
              startContent={<Plus size={16} />}
              onPress={addSupportLink}
            >
              Add Link
            </Button>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {data.supportLinks?.map((link, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row gap-3 items-start sm:items-end bg-gray-50 p-4 rounded-2xl border border-gray-100 group relative"
              >
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  <Input
                    classNames={{ inputWrapper: "bg-white h-12" }}
                    label="Link Name"
                    labelPlacement="outside"
                    placeholder="Contact Us"
                    size="md"
                    value={link.name}
                    onChange={(e) => {
                      const newLinks = [...data.supportLinks];
                      newLinks[index].name = e.target.value;
                      setData({ ...data, supportLinks: newLinks });
                    }}
                  />
                  <Select
                    classNames={{ trigger: "bg-white h-12" }}
                    label="Select Page"
                    labelPlacement="outside"
                    placeholder="Choose Page"
                    selectedKeys={link.href ? [link.href] : []}
                    size="md"
                    onSelectionChange={(keys) => {
                      const newLinks = [...data.supportLinks];
                      newLinks[index].href = Array.from(keys)[0];
                      setData({ ...data, supportLinks: newLinks });
                    }}
                  >
                    {PAGE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <Button
                  isIconOnly
                  className="rounded-xl shrink-0 absolute top-2 right-2 sm:static"
                  color="danger"
                  size="md"
                  variant="flat"
                  onPress={() => removeSupportLink(index)}
                >
                  <Trash2 size={20} />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
