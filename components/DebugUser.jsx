"use client";

import { useUser } from "@/context/UserContext";

export default function DebugUser() {
  const { user, loading } = useUser();

  if (loading) {
    return <div className="p-4 bg-yellow-100 text-yellow-800">Loading user...</div>;
  }

  if (!user) {
    return <div className="p-4 bg-red-100 text-red-800">No user logged in</div>;
  }

  return (
    <div className="p-4 bg-blue-100 text-blue-800 rounded-lg">
      <h3 className="font-bold mb-2">Debug User Info:</h3>
      <div className="text-sm space-y-1">
        <p><strong>Name:</strong> {user.name || "N/A"}</p>
        <p><strong>Email:</strong> {user.email || "N/A"}</p>
        <p><strong>UID:</strong> {user.uid || "N/A"}</p>
        <p><strong>Is Premium:</strong> {user.isPremium ? "Yes" : "No"}</p>
        <p><strong>Package Details:</strong></p>
        {user.packageDetails ? (
          <div className="ml-4 text-xs">
            <p>• Package: {user.packageDetails.packageName || "N/A"}</p>
            <p>• Status: {user.packageDetails.planStatus || "N/A"}</p>
            <p>• Price: JMD ${user.packageDetails.price || "N/A"}</p>
            <p>• Days Left: {user.packageDetails.daysLeft || "N/A"}</p>
            <p>• Subscription ID: {user.packageDetails.subscriptionId || "N/A"}</p>
            <p>• Payment ID: {user.packageDetails.paymentId || "N/A"}</p>
          </div>
        ) : (
          <p className="ml-4 text-xs">No package details</p>
        )}
      </div>
    </div>
  );
}
