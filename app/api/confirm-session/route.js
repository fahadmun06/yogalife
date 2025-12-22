export const runtime = "nodejs";
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { doc, setDoc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/config/firebase";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
const stripe = new Stripe(stripeSecretKey, { apiVersion: "2024-06-20" });

// Local plan map in JMD cents
const PLAN_AMOUNTS = {
  monthly: 7500,
  quarterly: 22500,
  yearly: 75500,
};

export async function POST(request) {
  try {
    if (!stripeSecretKey) {
      console.error("confirm-session: Missing STRIPE_SECRET_KEY");
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY" },
        { status: 500 }
      );
    }

    const { session_id: sessionId } = await request.json();
    console.log("confirm-session: received", { sessionId });
    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing session_id" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription", "customer"],
    });
    console.log("confirm-session: stripe session loaded", {
      id: session.id,
      status: session.status,
      amount_total: session.amount_total,
      currency: session.currency,
      metadata: session.metadata,
      subscription:
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id,
      payment_status: session.payment_status,
    });

    const userId =
      session?.metadata?.userId ||
      session?.subscription?.metadata?.userId ||
      "";
    const planType = session?.metadata?.planType || "monthly";
    const userEmail =
      session?.metadata?.userEmail || session?.customer_details?.email || "";

    if (!userId) {
      console.error("confirm-session: No userId in session metadata");
      return NextResponse.json(
        { error: "No userId in session metadata" },
        { status: 400 }
      );
    }

    // Pull actual paid amount from subscription/invoice
    let paidAmountCents = 0;
    let paidCurrency = (session.currency || "jmd").toUpperCase();
    let latestInvoiceId = null;
    let paymentIntentId = null;
    let paymentStatus = session.payment_status || "unknown";

    try {
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id;
      if (subscriptionId) {
        const sub = await stripe.subscriptions.retrieve(subscriptionId, {
          expand: ["latest_invoice.payment_intent"],
        });
        latestInvoiceId =
          typeof sub.latest_invoice === "string"
            ? sub.latest_invoice
            : sub.latest_invoice?.id;
        if (typeof sub.latest_invoice !== "string" && sub.latest_invoice) {
          paidAmountCents = sub.latest_invoice.amount_paid || 0;
          paidCurrency = (
            sub.latest_invoice.currency || paidCurrency
          ).toUpperCase();
          paymentIntentId = sub.latest_invoice.payment_intent?.id || null;
          paymentStatus =
            sub.latest_invoice.payment_intent?.status || paymentStatus;
        }
      }
    } catch (e) {
      console.warn(
        "confirm-session: unable to read subscription invoice, fallback to plan map",
        e?.message
      );
    }

    if (!paidAmountCents || paidAmountCents <= 0) {
      paidAmountCents = PLAN_AMOUNTS[planType] || PLAN_AMOUNTS.monthly;
    }

    const startDate = new Date();
    const trialEndDate = new Date();
    trialEndDate.setDate(startDate.getDate() + 7);
    const finalEndDate = new Date(startDate);
    if (planType === "monthly")
      finalEndDate.setMonth(finalEndDate.getMonth() + 1);
    else if (planType === "quarterly")
      finalEndDate.setMonth(finalEndDate.getMonth() + 3);
    else if (planType === "yearly")
      finalEndDate.setFullYear(finalEndDate.getFullYear() + 1);

    const trialDaysLeft = Math.max(
      0,
      Math.ceil(
        (trialEndDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      )
    );
    const totalDaysLeft = Math.max(
      0,
      Math.ceil(
        (finalEndDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      )
    );
    const subscriptionIdLocal = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

    const packageDetails = {
      subscriptionId: subscriptionIdLocal,
      packageName: `${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan`,
      price: paidAmountCents / 100,
      currency: paidCurrency,
      planType,
      isPremium: true,
      planStatus: "trial",
      subStatus: "active",
      startDate: startDate.toISOString(),
      trialEndDate: trialEndDate.toISOString(),
      endDate: finalEndDate.toISOString(),
      daysLeft: totalDaysLeft,
      trialDaysLeft,
      paymentStatus: paymentStatus || "completed",
      userId,
      stripeSessionId: session.id,
      stripeSubscriptionId:
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id || null,
      createdAt: new Date().toISOString(),
      payerEmail: userEmail,
      stripeInvoiceId: latestInvoiceId,
      stripePaymentIntentId: paymentIntentId,
    };
    console.log("confirm-session: computed packageDetails", packageDetails);

    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      console.log("confirm-session: user doc missing, creating", userId);
      await setDoc(
        userRef,
        {
          uid: userId,
          email: userEmail || null,
          status: "active",
          isVerified: false,
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }

    // Build a payment history record
    const paymentRecord = {
      id: `pay_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      amount: paidAmountCents / 100,
      currency: paidCurrency,
      status: paymentStatus || "completed",
      planType,
      createdAt: new Date().toISOString(),
      stripe: {
        checkoutSessionId: session.id,
        subscriptionId: packageDetails.stripeSubscriptionId,
        invoiceId: latestInvoiceId,
        paymentIntentId,
      },
    };

    await setDoc(
      userRef,
      {
        packageDetails,
        isPremium: true,
        lastUpdated: new Date().toISOString(),
        subscriptionHistory: {
          [new Date().toISOString()]: {
            action: "subscription_created",
            planType: packageDetails.planType,
            price: packageDetails.price,
            currency: packageDetails.currency,
            status: "trial",
            trialDaysLeft: packageDetails.trialDaysLeft,
            stripeSessionId: packageDetails.stripeSessionId,
            stripeSubscriptionId: packageDetails.stripeSubscriptionId,
          },
        },
        paymentHistory: arrayUnion(paymentRecord),
      },
      { merge: true }
    );
    console.log("confirm-session: Firestore updated for", userId);

    return NextResponse.json({ ok: true, packageDetails, paymentRecord });
  } catch (error) {
    console.error("confirm-session: error", error);
    return NextResponse.json(
      { error: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
