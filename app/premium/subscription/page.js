"use client";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Skeleton } from "@heroui/skeleton";
import {
  Trash2,
  Download,
  CheckCircle2,
  AlertTriangle,
  History,
  Archive,
  AlertCircle,
  Pencil,
  CreditCard,
} from "lucide-react";
import { Tabs, Tab } from "@heroui/tabs";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";

import { useAuth } from "@/hooks/useAuth";
import {
  AddCardModal,
  EditCardModal,
} from "@/components/dashboard/PaymentMethodModals";
import TrialPlanModal from "@/components/dashboard/TrialPlanModal";
import {
  packageApi,
  stripeApi,
  transactionsApi,
} from "@/components/api/ApiRoutesFile";
import ApiFunction from "@/components/api/apiFuntions";

export default function SubscriptionPage() {
  const { user, refreshSession } = useAuth();
  const { get, post } = ApiFunction();
  const [packages, setPackages] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDeleteCardModalOpen, setIsDeleteCardModalOpen] = useState(false);
  const [selectedPkgId, setSelectedPkgId] = useState(null);
  const [selectedCardToEdit, setSelectedCardToEdit] = useState(null);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [defaultCardId, setDefaultCardId] = useState(null);

  const fetchPackages = async () => {
    try {
      const res = await get(packageApi.getAll);
      setPackages(res.data || []);
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast.error("Failed to load packages");
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pmRes, histRes] = await Promise.all([
        get(stripeApi.getPaymentMethods),
        get(transactionsApi.myHistory),
      ]);

      const fetchedPms = pmRes.data?.data || pmRes.data || [];
      const defaultId = pmRes.data?.defaultId || null;

      setPaymentMethods(fetchedPms);
      setHistory(histRes.data || []);

      if (defaultId) {
        setDefaultCardId(defaultId);
      } else if (fetchedPms.length > 0 && !defaultCardId) {
        setDefaultCardId(fetchedPms[0].id);
      } else if (fetchedPms.length === 0) {
        setDefaultCardId(null);
      }
    } catch (error) {
      console.error("Error fetching subscription data:", error);
      // toast.error("Failed to load subscription details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchPackages();
  }, []);
  console.log("packages", packages);
  const handleCancel = async () => {
    try {
      setActionLoading(true);
      await post(stripeApi.cancelSubscription);
      toast.success("Subscription canceled successfully");
      setIsCancelModalOpen(false);
      await refreshSession();
      await fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to cancel subscription",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDetachCard = async () => {
    if (!cardToDelete) return;

    if (paymentMethods.length <= 1) {
      toast.error(
        "You must have at least one payment method to remove this card. Please add a new one first.",
      );

      return;
    }
    try {
      setActionLoading(true);
      await post(stripeApi.detachPaymentMethod(cardToDelete.id));
      toast.success("Payment method removed");
      setIsDeleteCardModalOpen(false);
      setCardToDelete(null);
      await fetchData();
    } catch {
      toast.error("Failed to remove payment method");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditCard = (pm) => {
    if (paymentMethods.length <= 1) {
      toast.error(
        "You only have one payment method active. Editing via Stripe UI requires you to add a new card first.",
      );

      return;
    }
    setSelectedCardToEdit(pm);
    setIsEditModalOpen(true);
  };

  const handleSetDefaultCard = async (pmId) => {
    // Optimistic UI Update
    const prevId = defaultCardId;
    setDefaultCardId(pmId);

    try {
      if (prevId !== pmId) {
        await post(stripeApi.setDefaultPaymentMethod, {
          paymentMethodId: pmId,
        });
      }
    } catch {
      setDefaultCardId(prevId);
      toast.error("Failed to sync default payment method");
    }
  };

  const handleUpgrade = async (pkgId, trialEnabled = false) => {
    // If not a trial and user has saved cards, show confirmation modal
    if (!trialEnabled && paymentMethods.length > 0 && defaultCardId) {
      setSelectedPkgId(pkgId);
      setIsConfirmModalOpen(true);

      return;
    }

    try {
      setActionLoading(true);
      const api = trialEnabled
        ? stripeApi.createSubscriptionSession
        : stripeApi.createCheckoutSession;

      const res = await post(api, {
        packageId: pkgId,
        trialEnabled,
      });

      if (res.success) {
        window.location.href = res.url || `/checkout/${res.id}`;
      }
    } catch (error) {
      toast.error(error.message || "Failed to initiate upgrade");
    } finally {
      setActionLoading(false);
      setIsTrialModalOpen(false);
    }
  };

  const handleConfirmUpgrade = async () => {
    if (!defaultCardId) return;

    try {
      setActionLoading(true);
      const res = await post(stripeApi.upgradeWithSavedCard, {
        packageId: selectedPkgId,
        paymentMethodId: defaultCardId,
      });

      if (res.success) {
        toast.success("Upgrade successful!");
        setIsConfirmModalOpen(false);
        await refreshSession();
        await fetchData();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Payment failed");
    } finally {
      setActionLoading(false);
    }
  };

  const scrollToPaymentMethods = () => {
    setIsConfirmModalOpen(false);
    setTimeout(() => {
      const el = document.getElementById("payment-methods-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <Skeleton className="h-48 w-full rounded-3xl" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-64 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl" />
        </div>
      </div>
    );
  }

  const activePackage = packages.find(
    (p) =>
      p._id === user?.subscription?.billing?.planId?._id ||
      p._id === user?.subscription?.billing?.planId,
  );

  const lastPackage =
    user?.recentPlans && user.recentPlans.length > 0
      ? user.recentPlans[user.recentPlans.length - 1]
      : null;

  return (
    <div className="space-y-6 mb-20">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
          Subscription & Billing
        </h1>
        <p className="text-zinc-600 font-medium text-sm mt-1">
          Manage your plan, payment methods, and billing history.
        </p>
      </div>

      {/* Current Plan Card */}
      <Card className="border-none shadow-premium bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden">
        <CardBody className="p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-3 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white">
                {activePackage ? activePackage.name : "Free Trial"}
              </h2>
              <Chip
                color={
                  user?.subscriptionStatus === "active"
                    ? "success"
                    : user?.subscriptionStatus === "trialing"
                      ? "warning"
                      : user?.subscriptionStatus === "expired"
                        ? "danger"
                        : "primary"
                }
                size="sm"
                variant="flat"
              >
                {user?.subscriptionStatus === "active"
                  ? "ACTIVE PLAN"
                  : user?.subscriptionStatus === "trialing"
                    ? "ON TRIAL"
                    : user?.subscriptionStatus === "expired"
                      ? "EXPIRED"
                      : "LIMITED ACCESS"}
              </Chip>
            </div>
            {activePackage ? (
              <div className="space-y-2 mt-2">
                <p className="text-zinc-500 max-w-md text-sm">
                  You are currently enjoying the {activePackage.name} benefits.
                </p>
                <div className="flex flex-col gap-1 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  <p>
                    Status:{" "}
                    <span className="uppercase text-[#764979] font-bold">
                      {user?.subscriptionStatus === "trialing"
                        ? "TRIAL"
                        : user?.subscriptionStatus || "Free"}
                    </span>
                  </p>
                  {user?.subscriptionStatus === "trialing" && (
                    <p>
                      Trial Remaining:{" "}
                      <span className="text-orange-500 font-bold">
                        {user?.subscription?.trial?.remainingDays || 0} Days
                      </span>
                    </p>
                  )}
                  {(user?.subscriptionStatus === "active" ||
                    user?.subscriptionStatus === "trialing") && (
                    <>
                      <p>
                        Start Date:{" "}
                        {user?.subscription?.billing?.startDate
                          ? new Date(
                              user.subscription.billing.startDate,
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                      <p>
                        Next Billing:{" "}
                        {user?.subscription?.billing?.nextPaymentDate
                          ? new Date(
                              user.subscription.billing.nextPaymentDate,
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ) : user?.subscription?.trial?.remainingDays > 0 ? (
              <div className="space-y-4 mt-4">
                <p className="text-zinc-500 max-w-md text-lg">
                  {user?.subscriptionStatus === "canceled" && lastPackage
                    ? `You canceled your ${lastPackage.name} plan, but still have ${user.subscription.trial.remainingDays} days of Free Trial remaining. Continue your subscription to keep your benefits seamlessly when the trial ends!`
                    : "You are currently exploring KostKord on a Free Trial."}
                </p>
                <div className="flex flex-col gap-1 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  <p>
                    Status:{" "}
                    <span className="uppercase text-orange-500 font-bold">
                      {user?.subscriptionStatus === "canceled"
                        ? "Canceled (On Trial)"
                        : "On Trial"}
                    </span>
                  </p>
                  <p>
                    Trial Remaining:{" "}
                    <span className="text-orange-500 font-bold">
                      {user.subscription.trial.remainingDays} Days
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-zinc-500 max-w-md text-lg mt-4">
                Unlock full power by upgrading to a pro plan today.
              </p>
            )}
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            {activePackage && user?.subscriptionStatus !== "canceled" ? (
              <Button
                className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300  rounded-2xl flex-1 md:flex-none border border-zinc-200 dark:border-zinc-700"
                onClick={() => setIsCancelModalOpen(true)}
              >
                Cancel Subscription
              </Button>
            ) : user?.subscription?.trial?.remainingDays > 0 &&
              user?.subscriptionStatus === "canceled" &&
              lastPackage ? (
              <Button
                className="bg-[#764979] te rounded-2xl shadow-xl shadow-purple-500/20 flex-1 md:flex-none"
                isLoading={actionLoading}
                onClick={() => handleUpgrade(lastPackage._id, false)}
              >
                Continue Subscription
              </Button>
            ) : (
              <Button
                className="bg-[#764979] text-white  rounded-2xl shadow-xl shadow-purple-500/20 flex-1 md:flex-none"
                onClick={() => setIsTrialModalOpen(true)}
              >
                {!user?.subscription?.trial?.isClaimed
                  ? "Start 7-Day Free Trial"
                  : "Upgrade Now"}
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      <div className="flex flex-col gap-6">
        {/* Available Plans */}
        <div className="w-full">
          <Card className="border-none shadow-premium bg-white dark:bg-zinc-900 rounded-[1.5rem] h-full">
            <CardHeader className="p-6 pb-0">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">
                Available Plans
              </h3>
            </CardHeader>
            <CardBody className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => {
                const planIdStr =
                  user?.subscription?.billing?.planId?._id ||
                  user?.subscription?.billing?.planId;
                const isCurrent = pkg._id === planIdStr;

                return (
                  <div
                    key={pkg._id}
                    className={`p-6 rounded-[1.5rem] border-3 transition-all ${isCurrent ? "border-[#764979] bg-[#764979]/5" : "border-zinc-100 dark:border-zinc-800"}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-black text-2xl text-zinc-900 dark:text-white">
                          {pkg.name}
                        </h4>
                        <p className="text-3xl font-black mt-2 text-[#764979]">
                          ${pkg.price}
                          <span className="text-sm text-zinc-500 font-medium">
                            {" "}
                            /month
                          </span>
                        </p>
                      </div>
                      {isCurrent && (
                        <CheckCircle2 className="text-[#764979]" size={28} />
                      )}
                    </div>
                    <ul className="space-y-4 mb-8">
                      {pkg.features.slice(0, 3).map((f, i) => (
                        <li
                          key={i}
                          className="text-sm font-medium text-zinc-600 flex items-center gap-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#764979]" />{" "}
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button
                      fullWidth
                      className={
                        isCurrent
                          ? "font-semibold py-6 rounded-xl text-md"
                          : "bg-[#764979] font-semibold py-6 rounded-xl text-md text-white shadow-lg shadow-purple-900/20"
                      }
                      color={isCurrent ? "default" : "primary"}
                      isDisabled={isCurrent}
                      onClick={() => handleUpgrade(pkg._id)}
                    >
                      {isCurrent ? "Current Plan" : "Upgrade"}
                    </Button>
                  </div>
                );
              })}
            </CardBody>
          </Card>
        </div>

        <div className="w-full mt-4 flex flex-col">
          <Tabs
            aria-label="Subscription Options"
            classNames={{
              tabList:
                "gap-4 w-full relative rounded-2xl p-1 bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800",
              cursor: "w-full bg-primary rounded-xl",
              tab: "max-w-fit px-5 h-10 text-sm font-regular text-zinc-500",
              tabContent: "group-data-[selected=true]:text-white",
            }}
            variant="light"
          >
            {/* Tab 1: Payment Methods */}
            <Tab
              key="payment-methods"
              title={
                <div className="flex items-center space-x-2">
                  <CreditCard size={18} />
                  <span>Payment Methods</span>
                </div>
              }
            >
              <div className="w-full mt-4" id="payment-methods-section">
                <Card className="border-none shadow-premium bg-white dark:bg-zinc-900 rounded-[1.5rem] flex flex-col">
                  <CardBody className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                        Your Cards
                      </h3>
                      <Button
                        className="px-6 py-4 bg-primary dark:bg-white text-white dark:text-zinc-900 font-bold text-sm rounded-xl hover:opacity-90 shadow-md"
                        onClick={() => setIsAddModalOpen(true)}
                      >
                        Add Card
                      </Button>
                    </div>

                    <div className="flex-1">
                      {paymentMethods.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-2">
                          {paymentMethods.map((pm) => {
                            const isDefault = pm.id === defaultCardId;

                            return (
                              <div
                                key={pm.id}
                                aria-checked={isDefault}
                                className={`group flex items-center justify-between gap-4 p-3 rounded-[1.25rem] bg-zinc-50 dark:bg-zinc-800/80 border-2 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#764979] ${
                                  isDefault
                                    ? "border-[#764979]"
                                    : "border-zinc-100 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-500"
                                }`}
                                role="radio"
                                tabIndex={0}
                                onClick={() => handleSetDefaultCard(pm.id)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    handleSetDefaultCard(pm.id);
                                  }
                                }}
                              >
                                <div className="flex items-center gap-4">
                                  <div className="flex-shrink-0">
                                    <div
                                      className={`flex items-center justify-center w-[24px] h-[24px] rounded-full border-2 ${isDefault ? "border-[#764979]" : "border-zinc-300 dark:border-zinc-600"} p-[3px]`}
                                    >
                                      {isDefault && (
                                        <div className="w-full h-full rounded-full bg-[#764979]" />
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-zinc-900 dark:text-zinc-100 font-medium text-lg leading-tight">
                                      {pm.card.brand} •••• {pm.card.last4}
                                    </p>
                                    <p className="text-zinc-500 font-medium text-sm mt-0.5">
                                      Exp: {pm.card.exp_month}/
                                      {pm.card.exp_year}
                                    </p>
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1">
                                  {paymentMethods.length > 1 && !isDefault && (
                                    <Button
                                      isIconOnly
                                      color="danger"
                                      size="sm"
                                      variant="light"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setCardToDelete(pm);
                                        setIsDeleteCardModalOpen(true);
                                      }}
                                    >
                                      <Trash2 size={18} />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8 mb-2 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[1.5rem]">
                          <AlertTriangle
                            className="mx-auto text-zinc-300 mb-3"
                            size={32}
                          />
                          <p className="text-sm text-zinc-500 font-bold">
                            No payment methods found
                          </p>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </div>
            </Tab>

            {/* Tab 2: Recent Purchases */}
            <Tab
              key="recent-purchases"
              title={
                <div className="flex items-center space-x-2">
                  <Archive size={18} />
                  <span>Recent Purchases</span>
                </div>
              }
            >
              <div className="w-full mt-4">
                {user?.recentPlans && user.recentPlans.length > 0 ? (
                  <Card className="border-none shadow-premium bg-white dark:bg-zinc-900 rounded-[1.5rem] w-full">
                    <CardBody className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {user.recentPlans.map((pkg, idx) => (
                        <div
                          key={`${pkg._id}-${idx}`}
                          className="p-6 rounded-[1.5rem] border-3 border-zinc-100 dark:border-zinc-800 opacity-70 hover:opacity-100 transition-opacity bg-zinc-50 dark:bg-zinc-800/50"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-xl text-zinc-700 dark:text-zinc-300">
                                {pkg.name}
                              </h4>
                              <p className="text-2xl font-black mt-2 text-zinc-400">
                                ${pkg.price}
                                <span className="text-sm text-zinc-400 font-bold">
                                  {" "}
                                  /month
                                </span>
                              </p>
                            </div>
                            <Chip
                              className="text-[10px] font-black uppercase tracking-widest text-zinc-500"
                              color="default"
                              size="sm"
                              variant="flat"
                            >
                              Canceled
                            </Chip>
                          </div>
                        </div>
                      ))}
                    </CardBody>
                  </Card>
                ) : (
                  <Card className="border-none shadow-premium bg-white dark:bg-zinc-900 rounded-[1.5rem] w-full">
                    <CardBody className="p-12 text-center flex flex-col items-center justify-center">
                      <Archive
                        className="text-zinc-300 dark:text-zinc-600 mb-4"
                        size={48}
                      />
                      <p className="text-zinc-500 font-semibold text-lg">
                        No recent purchases found
                      </p>
                      <p className="text-sm text-zinc-400 mt-2">
                        Any previously purchased plans will appear here.
                      </p>
                    </CardBody>
                  </Card>
                )}
              </div>
            </Tab>

            {/* Tab 3: Billing History */}
            <Tab
              key="billing-history"
              title={
                <div className="flex items-center space-x-2">
                  <History size={18} />
                  <span>Billing History</span>
                </div>
              }
            >
              <div className="w-full mt-4">
                <Card className="border-none shadow-premium bg-white dark:bg-zinc-900 rounded-[1.5rem]">
                  <CardBody className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-xs font-black text-zinc-500 uppercase tracking-widest border-b-2 border-zinc-100 dark:border-zinc-800">
                            <th className="pb-4 px-4">Date</th>
                            <th className="pb-4 px-4">Plan</th>
                            <th className="pb-4 px-4">Amount</th>
                            <th className="pb-4 px-4">Status</th>
                            <th className="pb-4 px-4 text-right">Invoice</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-zinc-50 dark:divide-zinc-800/50">
                          {history.length > 0 ? (
                            history.map((tx) => (
                              <tr
                                key={tx._id}
                                className="text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                              >
                                <td className="py-6 px-4 font-bold text-zinc-600 dark:text-zinc-400">
                                  {new Date(tx.createdAt).toLocaleDateString(
                                    undefined,
                                    {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    },
                                  )}
                                </td>
                                <td className="py-6 px-4 font-black">
                                  {tx.plan}
                                </td>
                                <td className="py-6 px-4 font-black text-[#764979]">
                                  ${tx.amount}
                                </td>
                                <td className="py-6 px-4">
                                  <Chip
                                    className="font-black text-[10px] uppercase tracking-widest"
                                    color={
                                      tx.status === "succeeded"
                                        ? "success"
                                        : "danger"
                                    }
                                    size="sm"
                                    variant="flat"
                                  >
                                    {tx.status}
                                  </Chip>
                                </td>
                                <td className="py-6 px-4 text-right">
                                  <Button
                                    isIconOnly
                                    className="border-2 border-zinc-200 dark:border-zinc-700 rounded-lg"
                                    isDisabled={!tx.invoiceUrl}
                                    size="sm"
                                    variant="faded"
                                    onClick={() => {
                                      if (tx.invoiceUrl) {
                                        window.open(tx.invoiceUrl, "_blank");
                                      } else {
                                        toast.error(
                                          "Invoice not available for this transaction",
                                        );
                                      }
                                    }}
                                  >
                                    <Download
                                      className={
                                        tx.invoiceUrl
                                          ? "text-zinc-700 dark:text-zinc-300"
                                          : "text-zinc-300"
                                      }
                                      size={18}
                                    />
                                  </Button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td className="py-24 text-center" colSpan="5">
                                <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center mx-auto mb-4">
                                  <History
                                    className="text-zinc-300 dark:text-zinc-600"
                                    size={32}
                                  />
                                </div>
                                <p className="text-zinc-500 font-bold">
                                  No transactions found
                                </p>
                                <p className="text-zinc-400 text-sm mt-1">
                                  Your billing receipts will appear here.
                                </p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
      <AddCardModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchData}
      />
      <TrialPlanModal
        isEligibleForTrial={!user?.subscription?.trial?.isClaimed}
        isOpen={isTrialModalOpen}
        packages={packages}
        onClose={() => setIsTrialModalOpen(false)}
        onSelect={handleUpgrade}
      />
      <Modal
        backdrop="blur"
        isOpen={isConfirmModalOpen}
        size="md"
        className="font-poppins"
        onClose={() => setIsConfirmModalOpen(false)}
      >
        <ModalContent className="rounded-[2.5rem] p-4">
          <ModalHeader className="flex flex-col gap-1 items-center text-center">
            <h2 className="text-2xl font-black">Confirm Upgrade</h2>
            <p className="text-zinc-500 font-medium text-sm mt-1">
              Are you sure you want to upgrade with this card?
            </p>
          </ModalHeader>
          <ModalBody className="py-2 space-y-4">
            {paymentMethods.find((pm) => pm.id === defaultCardId) && (
              <div className="p-5 rounded-2xl border-2 border-[#764979] bg-[#764979]/5 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[#764979] text-white">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className="font-black capitalize text-lg text-zinc-900 dark:text-white">
                    {
                      paymentMethods.find((pm) => pm.id === defaultCardId).card
                        .brand
                    }{" "}
                    ••••{" "}
                    {
                      paymentMethods.find((pm) => pm.id === defaultCardId).card
                        .last4
                    }
                  </p>
                  <p className="text-sm font-semibold text-zinc-500">
                    Expires{" "}
                    {
                      paymentMethods.find((pm) => pm.id === defaultCardId).card
                        .exp_month
                    }
                    /
                    {
                      paymentMethods.find((pm) => pm.id === defaultCardId).card
                        .exp_year
                    }
                  </p>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter className="flex-col gap-3 mt-4">
            <Button
              fullWidth
              className="bg-[#764979] text-white font-bold rounded-xl py-6"
              isLoading={actionLoading}
              onPress={handleConfirmUpgrade}
            >
              Confirm & Pay
            </Button>
            <Button
              fullWidth
              className="font-bold rounded-xl py-6 text-zinc-500 bg-zinc-100 dark:bg-zinc-800"
              isDisabled={actionLoading}
              variant="light"
              onPress={scrollToPaymentMethods}
            >
              Change Card
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <EditCardModal
        isOpen={isEditModalOpen}
        pm={selectedCardToEdit}
        onClose={() => setIsEditModalOpen(false)}
      />

      {/* Delete Card Confirmation Modal */}
      <Modal
        backdrop="blur"
        isOpen={isDeleteCardModalOpen}
        size="md"
        className="font-poppins"
        onClose={() => setIsDeleteCardModalOpen(false)}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 items-center text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-2">
              <Trash2 className="text-red-500" size={28} />
            </div>
            <h2 className="text-xl font-bold">Remove Card</h2>
          </ModalHeader>
          <ModalBody className="text-center space-y-2">
            <p className="text-zinc-500 font-medium text-sm">
              Are you sure you want to remove this payment method? This action
              cannot be undone.
            </p>
            {cardToDelete && (
              <div className="p-4 rounded-xl border-2 border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex flex-col items-center">
                <p className="font-bold text-zinc-900 dark:text-zinc-100 uppercase">
                  {cardToDelete.card.brand} •••• {cardToDelete.card.last4}
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  Expires {cardToDelete.card.exp_month}/
                  {cardToDelete.card.exp_year}
                </p>
              </div>
            )}
          </ModalBody>
          <ModalFooter className="flex-col gap-3 mt-2">
            <Button
              fullWidth
              className="bg-red-500 text-white font-bold rounded-xl py-6"
              isLoading={actionLoading}
              onPress={handleDetachCard}
            >
              Yes, Remove Card
            </Button>
            <Button
              fullWidth
              className="font-bold rounded-xl py-6 text-zinc-500 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200"
              isDisabled={actionLoading}
              variant="light"
              onPress={() => setIsDeleteCardModalOpen(false)}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal
        backdrop="blur"
        isOpen={isCancelModalOpen}
        size="md"
        className="font-poppins"
        onClose={() => setIsCancelModalOpen(false)}
      >
        <ModalContent className="rounded-[2rem] p-4">
          <ModalHeader className="flex flex-col gap-1 items-center text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-2">
              <AlertCircle className="text-red-500" size={28} />
            </div>
            <h2 className="text-xl font-bold">Cancel Subscription</h2>
          </ModalHeader>
          <ModalBody className="text-center">
            <p className="text-zinc-500 font-medium">
              Are you sure you want to cancel your active subscription? You will
              lose access to premium features immediately.
            </p>
          </ModalBody>
          <ModalFooter className="flex-col gap-3 mt-4">
            <Button
              fullWidth
              className="bg-red-500 text-white font-bold rounded-xl py-6"
              isLoading={actionLoading}
              onPress={handleCancel}
            >
              Yes, Cancel Subscription
            </Button>
            <Button
              fullWidth
              className="font-bold rounded-xl py-6 text-zinc-500 bg-zinc-100 dark:bg-zinc-800"
              isDisabled={actionLoading}
              variant="light"
              onPress={() => setIsCancelModalOpen(false)}
            >
              Nevermind, Keep It
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
