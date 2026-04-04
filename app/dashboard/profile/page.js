"use client";
import { useState, useEffect } from "react";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { Tabs, Tab } from "@heroui/tabs";
import { Select, SelectItem } from "@heroui/select";
import {
  Mail,
  User as UserIcon,
  Shield,
  Camera,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "../../../hooks/useAuth";
import ApiFunction from "../../../components/api/apiFuntions";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { put, post } = ApiFunction();

  const [activeTab, setActiveTab] = useState("account");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isNewVisible, setIsNewVisible] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    profile: "",
    dob: "",
    age: "",
    gender: "",
    weight: "",
    weightUnit: "kg",
    height: "",
    heightUnit: "cm",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        profile: user.profile || "",
        dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
        age: user.age || "",
        gender: user.gender || "",
        weight: user.weight || "",
        weightUnit: user.weightUnit || "kg",
        height: user.height || "",
        heightUnit: user.heightUnit || "cm",
      });
    }
  }, [user]);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleNewVisibility = () => setIsNewVisible(!isNewVisible);

  const calculateAge = (dobString) => {
    if (!dobString) return "";
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return age;
  };

  const handleProfileUpdate = async () => {
    try {
      setIsLoading(true);
      const res = await put("/auth/update-profile", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        profile: formData.profile,
        dob: formData.dob,
        age: formData.age,
        gender: formData.gender,
        weight: formData.weight,
        weightUnit: formData.weightUnit,
        height: formData.height,
        heightUnit: formData.heightUnit,
      });

      if (res) {
        toast.success("Profile updated successfully");

        refreshUser();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");

      return;
    }
    try {
      setIsLoading(true);
      await put("/auth/update-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password updated successfully");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update password",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const uploadData = new FormData();

    uploadData.append("file", file);

    try {
      setIsUploadingImage(true);
      const res = await post("/upload", uploadData, true);

      if (res?.image) {
        setFormData((prev) => ({ ...prev, profile: res.image }));

        // Also update profile immediately
        await put("/auth/update-profile", { profile: res.image });
        toast.success("Profile image uploaded");

        refreshUser();
      }
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <div className=" mx-auto space-y-6">
      {/* Upper Card */}
      <Card className="border-none rounded-3xl bg-white text-white overflow-hidden">
        <CardBody className="p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="relative group">
              <Avatar
                className={`h-32 w-32 bg-[#764979] text-4xl font-bold text-white border-4 border-zinc-800 transition-all duration-300 ${isUploadingImage ? "blur-sm" : ""}`}
                name={user?.firstName}
                src={formData.profile}
              />
              {isUploadingImage && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <Spinner color="white" size="lg" />
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 rounded-full bg-[#764979] p-2 shadow-lg cursor-pointer transition-transform hover:scale-110">
              <Camera size={18} />
              <input
                accept="image/*"
                className="hidden"
                type="file"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <h1 className="text-3xl font-bold text-black tracking-tight">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-zinc-400 font-medium flex items-center justify-center md:justify-start gap-2">
              <Mail size={16} /> {user?.email}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
              <Chip
                className="px-4 py-1 font-bold capitalize bg-[#764979]/20 text-[#764979] border border-[#764979]/30"
                startContent={<Shield className="mr-1" size={14} />}
                variant="flat"
              >
                {user?.subscriptionStatus || "Free Member"}
              </Chip>
              {/* <Chip
                className="border-none text-zinc-700"
                color={getStatusColor(user?.subscriptionStatus)}
                variant="dot"
              >
                {user?.subscriptionStatus === "pro"
                  ? "Verified Account"
                  : "Standard User"}
              </Chip> */}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tabs Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-2 shadow-sm">
        <Tabs
          aria-label="Profile Options"
          classNames={{
            tabList:
              "gap-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-[#764979]",
            tab: "max-w-fit px-4 h-12",
            tabContent: "group-data-[selected=true]:text-[#764979] font-bold",
          }}
          color="secondary"
          selectedKey={activeTab}
          variant="underlined"
          onSelectionChange={setActiveTab}
        >
          <Tab
            key="account"
            title={
              <div className="flex items-center space-x-2">
                <UserIcon size={18} />
                <span>Account</span>
              </div>
            }
          >
            <Card className="border-none bg-transparent shadow-none mt-4">
              <CardBody className="space-y-6 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    classNames={{ inputWrapper: "rounded-2xl h-12" }}
                    label="First Name"
                    labelPlacement="outside"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    variant="bordered"
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                  />
                  <Input
                    classNames={{ inputWrapper: "rounded-2xl h-12" }}
                    label="Last Name"
                    labelPlacement="outside"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    variant="bordered"
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                  />
                </div>

                <Input
                  isReadOnly
                  classNames={{
                    inputWrapper:
                      "rounded-2xl h-12 bg-zinc-50 dark:bg-zinc-800/50",
                  }}
                  label="Email Address"
                  labelPlacement="outside"
                  startContent={<Mail className="text-zinc-400" size={18} />}
                  value={user?.email || ""}
                  variant="bordered"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    classNames={{ inputWrapper: "rounded-2xl h-12" }}
                    label="Date of Birth"
                    labelPlacement="outside"
                    type="date"
                    value={formData.dob}
                    variant="bordered"
                    onChange={(e) => {
                      const dobVal = e.target.value;

                      setFormData({
                        ...formData,
                        dob: dobVal,
                        age: calculateAge(dobVal),
                      });
                    }}
                  />
                  <Input
                    classNames={{ inputWrapper: "rounded-2xl h-12" }}
                    label="Age"
                    labelPlacement="outside"
                    placeholder="Enter your age"
                    type="number"
                    value={formData.age}
                    variant="bordered"
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Select
                    classNames={{
                      trigger: "rounded-2xl h-12",
                    }}
                    label="Gender"
                    labelPlacement="outside"
                    placeholder="Select gender"
                    selectedKeys={formData.gender ? [formData.gender] : []}
                    variant="bordered"
                    onSelectionChange={(keys) =>
                      setFormData({
                        ...formData,
                        gender: Array.from(keys)[0],
                      })
                    }
                  >
                    <SelectItem key="male" value="male">
                      Male
                    </SelectItem>
                    <SelectItem key="female" value="female">
                      Female
                    </SelectItem>
                    <SelectItem key="other" value="other">
                      Other
                    </SelectItem>
                  </Select>

                  <Input
                    classNames={{ inputWrapper: "rounded-2xl h-12" }}
                    endContent={
                      <Select
                        aria-label="Weight Unit"
                        className="min-w-18 max-w-18"
                        classNames={{
                          trigger: "border-0 bg-transparent shadow-none h-8",
                          value: "text-xs font-bold text-[#764979]",
                        }}
                        id="weightUnit"
                        selectedKeys={[formData.weightUnit]}
                        onSelectionChange={(keys) =>
                          setFormData({
                            ...formData,
                            weightUnit: Array.from(keys)[0],
                          })
                        }
                      >
                        <SelectItem key="kg" value="kg">
                          kg
                        </SelectItem>
                        <SelectItem key="lbs" value="lbs">
                          lbs
                        </SelectItem>
                      </Select>
                    }
                    label="Weight"
                    labelPlacement="outside"
                    placeholder="0.0"
                    type="number"
                    value={formData.weight}
                    variant="bordered"
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                  />

                  <Input
                    classNames={{ inputWrapper: "rounded-2xl h-12" }}
                    endContent={
                      <Select
                        aria-label="Height Unit"
                        className="min-w-20 max-w-20"
                        classNames={{
                          trigger: "border-0 bg-transparent shadow-none h-8",
                          value: "text-xs font-bold text-[#764979]",
                        }}
                        id="heightUnit"
                        selectedKeys={[formData.heightUnit]}
                        onSelectionChange={(keys) =>
                          setFormData({
                            ...formData,
                            heightUnit: Array.from(keys)[0],
                          })
                        }
                      >
                        <SelectItem key="cm" value="cm">
                          cm
                        </SelectItem>
                        <SelectItem key="ft" value="ft">
                          ft
                        </SelectItem>
                      </Select>
                    }
                    label="Height"
                    labelPlacement="outside"
                    placeholder="0.0"
                    type="number"
                    value={formData.height}
                    variant="bordered"
                    onChange={(e) =>
                      setFormData({ ...formData, height: e.target.value })
                    }
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    className="bg-[#764979] text-white font-bold px-12 h-12 rounded-2xl shadow-lg shadow-purple-500/20"
                    isLoading={isLoading}
                    onPress={handleProfileUpdate}
                  >
                    Save Changes
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Tab>

          <Tab
            key="password"
            title={
              <div className="flex items-center space-x-2">
                <Lock size={18} />
                <span>Change Password</span>
              </div>
            }
          >
            <Card className="border-none bg-transparent shadow-none mt-4">
              <CardBody className="space-y-6 p-4">
                <Input
                  classNames={{ inputWrapper: "rounded-2xl h-12" }}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? (
                        <EyeOff className="text-zinc-400" size={18} />
                      ) : (
                        <Eye className="text-zinc-400" size={18} />
                      )}
                    </button>
                  }
                  label="Current Password"
                  labelPlacement="outside"
                  placeholder="Enter current password"
                  type={isVisible ? "text" : "password"}
                  value={passwordData.currentPassword}
                  variant="bordered"
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    classNames={{ inputWrapper: "rounded-2xl h-12" }}
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleNewVisibility}
                      >
                        {isNewVisible ? (
                          <EyeOff className="text-zinc-400" size={18} />
                        ) : (
                          <Eye className="text-zinc-400" size={18} />
                        )}
                      </button>
                    }
                    label="New Password"
                    labelPlacement="outside"
                    placeholder="Enter new password"
                    type={isNewVisible ? "text" : "password"}
                    value={passwordData.newPassword}
                    variant="bordered"
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                  />
                  <Input
                    classNames={{ inputWrapper: "rounded-2xl h-12" }}
                    label="Confirm New Password"
                    labelPlacement="outside"
                    placeholder="Confirm new password"
                    type={isNewVisible ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    variant="bordered"
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    className="bg-[#764979] text-white font-bold px-12 h-12 rounded-2xl shadow-lg shadow-purple-500/20"
                    isLoading={isLoading}
                    onPress={handlePasswordUpdate}
                  >
                    Update Password
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
