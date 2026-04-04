import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Calendar, Clock, CreditCard, ShieldCheck } from "lucide-react";
import { useState } from "react";

const StatItem = ({ label, value, icon: Icon, subValue }) => (
  <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700/30">
    <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-700/50 shadow-sm">
      <Icon size={20} className="text-[#764979]" />
    </div>
    <div className="flex flex-col gap-0.5">
      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1">
        {label}
      </p>
      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-none">
        {value}
      </p>
      {subValue && (
        <p className="text-[11px] font-medium text-zinc-500 mt-1">{subValue}</p>
      )}
    </div>
  </div>
);

export default function SubscriptionStats({ user }) {
  if (!user?.subscription) return null;

  const { status, trial, billing } = user.subscription;
  const isTrial = status === "trialing" || status === "paused";

  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "success";
      case "trialing":
        return "secondary";
      case "paused":
        return "warning";
      case "expired":
        return "danger";
      default:
        return "default";
    }
  };

  const daysLeft =
    Math.round(
      status === "trialing"
        ? trial?.remainingDays
        : (new Date(billing?.endDate) - new Date()) / (1000 * 60 * 60 * 24),
    ) || 0;

  return (
    <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
      <CardBody className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-50 dark:bg-zinc-800">
              <ShieldCheck className="text-[#764979]" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Subscription Status</h3>
              <p className="text-xs text-zinc-500">
                Manage your active plans and trials
              </p>
            </div>
          </div>
          <Chip
            color={getStatusColor()}
            variant="flat"
            className="font-bold uppercase tracking-wider text-[10px] px-3 py-1"
          >
            {status}
          </Chip>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatItem
            label={isTrial ? "Trial Started" : "Cycle Started"}
            value={new Date(
              isTrial ? trial.startDate : billing.startDate,
            ).toLocaleDateString()}
            icon={Calendar}
          />
          <StatItem
            label={isTrial ? "Trial Ends" : "Next Expiry"}
            value={
              status === "paused"
                ? "Paused"
                : new Date(
                    isTrial ? trial.endDate : billing.endDate,
                  ).toLocaleDateString()
            }
            icon={Clock}
            subValue={
              status === "paused"
                ? "Resume to continue"
                : `${daysLeft} days remaining`
            }
          />
          <StatItem
            label="Current Plan"
            value={
              status === "trialing" || status === "paused"
                ? "7-Day Trial"
                : billing.planId?.name || "Active Plan"
            }
            icon={CreditCard}
            subValue={
              status === "trialing" ? "Standard Features" : "Premium Unlocked"
            }
          />
          <StatItem
            label="Next Payment"
            value={
              billing.nextPaymentDate
                ? new Date(billing.nextPaymentDate).toLocaleDateString()
                : "N/A"
            }
            icon={Calendar}
            subValue={
              billing.nextPaymentDate
                ? "Automated recharge"
                : "Payment required"
            }
          />
        </div>
      </CardBody>
    </Card>
  );
}
