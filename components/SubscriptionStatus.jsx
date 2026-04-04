/* eslint-disable jsx-a11y/label-has-associated-control */
"use client";

import { useAuth } from "@/hooks/useAuth";
import { formatSubscriptionInfo } from "@/utils/subscriptionUtils";

export default function SubscriptionStatus() {
  const { user } = useAuth();

  if (!user?.packageDetails) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No Active Subscription
        </h3>
        <p className="text-gray-600">
          You don't have an active subscription. Choose a plan to get started!
        </p>
      </div>
    );
  }

  const subscriptionInfo = formatSubscriptionInfo(user.packageDetails);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "text-green-600 bg-green-100";
      case "trial":
        return "text-blue-600 bg-blue-100";
      case "expired":
        return "text-red-600 bg-red-100";
      case "cancelled":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Current Subscription
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-600">Package</label>
          <p className="text-lg font-semibold text-gray-800">
            {subscriptionInfo.packageName}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Status</label>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscriptionInfo.status)}`}
          >
            {subscriptionInfo.status}
          </span>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Price</label>
          <p className="text-lg font-semibold text-gray-800">
            JMD ${subscriptionInfo.price}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">
            Days Remaining
          </label>
          <p className="text-lg font-semibold text-gray-800">
            {subscriptionInfo.daysLeft} days
          </p>
        </div>

        {subscriptionInfo.trialStatus === "active" && (
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-600">
              Trial Days Left
            </label>
            <p className="text-lg font-semibold text-blue-600">
              {subscriptionInfo.trialDaysLeft} days
            </p>
            <p className="text-xs text-blue-500 mt-1">
              After trial ends, your subscription will become active
            </p>
          </div>
        )}

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-600">
            Subscription Period
          </label>
          <p className="text-sm text-gray-600">
            {new Date(subscriptionInfo.startDate).toLocaleDateString()} -{" "}
            {new Date(subscriptionInfo.endDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {subscriptionInfo.isPremium && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-green-600 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-green-800 font-medium">
              Premium Access Active
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
