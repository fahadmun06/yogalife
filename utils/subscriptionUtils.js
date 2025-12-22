// Utility functions for subscription management

export const calculateSubscriptionStatus = (packageDetails) => {
  if (!packageDetails) {
    return {
      status: "inactive",
      trialStatus: "inactive",
      trialDaysLeft: 0,
      daysLeft: 0,
      isExpired: true,
      isActive: false,
      isTrial: false,
    };
  }

  const now = new Date();
  const endDate = new Date(packageDetails.endDate);
  const trialEndDate = packageDetails.trialEndDate ? new Date(packageDetails.trialEndDate) : null;
  
  const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
  const trialDaysLeft = trialEndDate ? Math.ceil((trialEndDate - now) / (1000 * 60 * 60 * 24)) : 0;

  const isExpired = daysLeft <= 0;
  const isTrialExpired = trialDaysLeft <= 0;
  const isActive = !isExpired && packageDetails.subStatus === "active";
  const isTrial = packageDetails.planStatus === "trial" && !isTrialExpired;

  let status = "inactive";

  if (isExpired) {
    status = "expired";
  } else if (isTrial) {
    status = "trial";
  } else if (isActive && (packageDetails.planStatus === "active" || (packageDetails.planStatus === "trial" && isTrialExpired))) {
    status = "active";
  } else if (packageDetails.subStatus === "cancelled") {
    status = "cancelled";
  }

  return {
    status,
    trialStatus: isTrial ? "active" : "inactive",
    trialDaysLeft: Math.max(0, trialDaysLeft),
    daysLeft: Math.max(0, daysLeft),
    isExpired,
    isActive: isActive || (isTrial && !isTrialExpired),
    isTrial,
  };
};

export const updateSubscriptionStatus = async (user, packageDetails) => {
  if (!user?.uid || !packageDetails) return null;

  const subscriptionStatus = calculateSubscriptionStatus(packageDetails);

  // Check if trial has expired and should transition to active
  let newPlanStatus = packageDetails.planStatus;
  if (packageDetails.planStatus === "trial" && subscriptionStatus.status === "active") {
    newPlanStatus = "active";
    console.log("Trial expired, transitioning to active status");
  }

  // Update package details with current status
  const updatedPackageDetails = {
    ...packageDetails,
    trialStatus: subscriptionStatus.trialStatus,
    trialDaysLeft: subscriptionStatus.trialDaysLeft,
    daysLeft: subscriptionStatus.daysLeft,
    planStatus: newPlanStatus,
    subStatus: subscriptionStatus.isActive ? "active" : "inactive",
    lastChecked: new Date().toISOString(),
  };

  return updatedPackageDetails;
};

export const formatSubscriptionInfo = (packageDetails) => {
  if (!packageDetails) {
    return {
      packageName: "No Package",
      status: "Inactive",
      daysLeft: 0,
      price: 0,
      duration: 0,
    };
  }

  const subscriptionStatus = calculateSubscriptionStatus(packageDetails);

  return {
    packageName: packageDetails.packageName || "Unknown Package",
    status:
      subscriptionStatus.status.charAt(0).toUpperCase() +
      subscriptionStatus.status.slice(1),
    trialStatus: subscriptionStatus.trialStatus,
    daysLeft: subscriptionStatus.daysLeft,
    price: packageDetails.price || 0,
    trialDaysLeft: subscriptionStatus.trialDaysLeft,
    duration: packageDetails.duration || 0,
    startDate: packageDetails.startDate,
    endDate: packageDetails.endDate,
    isPremium: packageDetails.isPremium || false,
  };
};
