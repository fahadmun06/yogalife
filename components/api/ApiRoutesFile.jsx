// Auth APIs
const authApi = {
  login: "auth/login",
  register: "auth/register",
  verify: "auth/verify",
  refreshToken: "auth/refresh-token",
  resendCode: "auth/resend-verification-code",
  forgotPassword: "auth/forgotpassword",
  forgetVerify: "auth/forget-verify",
  resetPassword: "auth/resetpassword",
  updatePassword: "auth/update-password",
  me: "auth/me",
  updateProfile: "auth/update-profile",
};
const refreshTokenApi = "auth/refresh-token";

// Packages & Subscriptions
const packageApi = {
  getAll: "packages",
  getById: (id) => `packages/${id}`,
};

// Stripe
const stripeApi = {
  createSetupIntent: "stripe/create-setup-intent",
  getPaymentMethods: "stripe/payment-methods",
  createCheckoutSession: "stripe/create-checkout-session",
  createSubscriptionSession: "stripe/create-subscription-session",
  createTrialSession: "stripe/create-trial-session",
  confirmSubscription: "stripe/confirm-subscription",
  cancelSubscription: "stripe/cancel-subscription",
  startTrial: "stripe/start-trial",
  pauseTrial: "stripe/pause-trial",
  resumeTrial: "stripe/resume-trial",
  detachPaymentMethod: (id) => `stripe/detach-payment-method/${id}`,
  upgradeWithSavedCard: "stripe/upgrade-with-saved-card",
  setDefaultPaymentMethod: "stripe/set-default-payment-method",
};

// Transactions
const transactionsApi = {
  myHistory: "transactions/my-history",
};

// User Profile
const userProfileApi = {
  update: "auth/update-profile",
};

export {
  refreshTokenApi,
  packageApi,
  authApi,
  stripeApi,
  userProfileApi,
  transactionsApi,
};
