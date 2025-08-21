"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/services/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  User,
  Mail,
  Shield,
  Edit,
  Save,
  X,
  Camera,
  Settings,
  LogOut,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { updateUserDetails } from "@/services/auth/authServices";

export default function ProfilePage() {
  const { user, logout, refreshUser, isLoading: authLoading } = useAuth();
  const { success, error } = useToast();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin");
    } else if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user, router, authLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Redirecting...</div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);

    try {
      await updateUserDetails(formData, user.id);

      success("Profile Updated", "Your profile has been updated successfully!");
      setIsEditing(false);

      await refreshUser();
    } catch (err: any) {
      error("Update Failed", err.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
    });
    setIsEditing(false);
  };

  const getRoleDisplay = (roles?: Array<"user" | "admin" | "organizer">) => {
    if (!roles || roles.length === 0) return "User";
    return roles
      .map((role) => role.charAt(0).toUpperCase() + role.slice(1))
      .join(", ");
  };

  const getRoleColor = (roles?: Array<"user" | "admin" | "organizer">) => {
    if (!roles || roles.length === 0) return "text-blue-400";
    if (roles.includes("admin")) return "text-red-400";
    if (roles.includes("organizer")) return "text-blue-400";
    return "text-blue-400";
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-400">
            Manage your account settings and personal information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="p-6 bg-gray-900 border-gray-800">
              <div className="text-center">
                <div className="relative mx-auto w-24 h-24 mb-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {(user.name || user.email).charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors">
                    <Camera className="h-4 w-4 text-white" />
                  </button>
                </div>
                <h2 className="text-xl font-semibold text-white mb-1">
                  {user.name || "User"}
                </h2>
                <p className="text-gray-400 mb-2">{user.email}</p>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <span
                    className={`text-sm font-medium ${getRoleColor(user.role)}`}
                  >
                    {getRoleDisplay(user.role)}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2 mb-6">
                  {user.isVerified ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-green-400">
                        Verified Account
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-yellow-400">
                        Unverified Account
                      </span>
                    </>
                  )}
                </div>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? "Cancel Edit" : "Edit Profile"}
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full text-red-400 hover:text-red-300 hover:bg-red-950"
                    onClick={() => logout()}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </Card>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-gray-900 border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">
                  Personal Information
                </h3>
                {!isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">
                    <User className="h-4 w-4 inline mr-2" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  ) : (
                    <p className="text-gray-300 p-3 bg-gray-800 rounded-md">
                      {user.name || "Not provided"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">
                    <Mail className="h-4 w-4 inline mr-2" />
                    Email Address
                  </label>
                  {isEditing ? (
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="bg-gray-800 border-gray-700 text-white"
                      disabled
                    />
                  ) : (
                    <p className="text-gray-300 p-3 bg-gray-800 rounded-md">
                      {user.email}
                    </p>
                  )}
                  {isEditing && (
                    <p className="text-gray-400 text-xs mt-1">
                      Email changes require verification and are currently
                      disabled
                    </p>
                  )}
                </div>
                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6 bg-gray-900 border-gray-800">
              <h3 className="text-xl font-semibold text-white mb-6">
                Account Settings
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div>
                    <h4 className="font-medium text-white">Account Type</h4>
                    <p className="text-gray-400 text-sm">
                      Current account privileges
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(
                      user.role
                    )} bg-gray-700`}
                  >
                    {getRoleDisplay(user.role)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div>
                    <h4 className="font-medium text-white">
                      Email Verification
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Verify your email for full access
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {user.isVerified ? (
                      <span className="px-3 py-1 bg-green-900 text-green-300 rounded-full text-sm">
                        Verified
                      </span>
                    ) : (
                      <>
                        <span className="px-3 py-1 bg-yellow-900 text-yellow-300 rounded-full text-sm">
                          Unverified
                        </span>
                        <Button size="sm" variant="outline">
                          Verify Now
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div>
                    <h4 className="font-medium text-white">Password</h4>
                    <p className="text-gray-400 text-sm">
                      Change your account password
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </div>
            </Card>
            <Card className="p-6 bg-gray-900 border-gray-800">
              <h3 className="text-xl font-semibold text-white mb-6">
                Quick Actions
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => router.push("/events")}
                >
                  Browse Events
                </Button>

                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => router.push("/my-bookings")}
                >
                  My Bookings
                </Button>

                {user.role?.includes("organizer") && (
                  <>
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => router.push("/events/my-events")}
                    >
                      My Events
                    </Button>

                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => router.push("/events/create")}
                    >
                      Create Event
                    </Button>
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
