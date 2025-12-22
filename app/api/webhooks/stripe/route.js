import { NextResponse } from "next/server";
import Stripe from "stripe";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

const stripe = new Stripe(stripeSecretKey, { apiVersion: "2024-06-20" });

export async function POST(request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!webhookSecret) {
      console.error("Missing STRIPE_WEBHOOK_SECRET");
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    console.log("Received Stripe webhook event:", event.type);

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;
      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object);
        break;
      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

async function handleCheckoutSessionCompleted(session) {
  try {
    const userId = session.metadata?.userId;
    const planType = session.metadata?.planType;
    const userEmail = session.metadata?.userEmail;

    if (!userId) {
      console.error("No userId in session metadata");
      return;
    }

    console.log("Processing checkout completion for user:", userId);

    // Calculate subscription details
    const startDate = new Date();
    const endDate = new Date();
    
    // Set end date based on plan type
    if (planType === "monthly") {
      endDate.setMonth(startDate.getMonth() + 1);
    } else if (planType === "quarterly") {
      endDate.setMonth(startDate.getMonth() + 3);
    } else if (planType === "yearly") {
      endDate.setFullYear(startDate.getFullYear() + 1);
    }

    const daysLeft = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    const packageDetails = {
      packageName: `${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan`,
      price: session.amount_total / 100, // Convert from cents
      duration: planType === "monthly" ? 30 : planType === "quarterly" ? 90 : 365,
      planType: planType,
      isPremium: true,
      planStatus: "active",
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      daysLeft: daysLeft,
      subStatus: "active",
      paymentStatus: "completed",
      currency: "JMD",
      createdAt: new Date().toISOString(),
      userId: userId,
      stripeSessionId: session.id,
      stripeSubscriptionId: session.subscription,
    };

    // Update user document in Firestore
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      packageDetails: packageDetails,
      isPremium: true,
      lastUpdated: new Date().toISOString(),
      subscriptionHistory: {
        [new Date().toISOString()]: {
          action: "subscription_created",
          planType: packageDetails.planType,
          price: packageDetails.price,
          currency: packageDetails.currency,
          status: "active",
          stripeSessionId: session.id,
          stripeSubscriptionId: session.subscription,
        }
      }
    });

    console.log("Successfully updated user subscription:", userId);
  } catch (error) {
    console.error("Error handling checkout session completed:", error);
  }
}

async function handleSubscriptionUpdated(subscription) {
  try {
    const userId = subscription.metadata?.userId;
    if (!userId) return;

    console.log("Updating subscription for user:", userId);

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      "packageDetails.subStatus": subscription.status,
      "packageDetails.stripeSubscriptionId": subscription.id,
      lastUpdated: new Date().toISOString(),
    });

    console.log("Subscription updated for user:", userId);
  } catch (error) {
    console.error("Error updating subscription:", error);
  }
}

async function handleSubscriptionDeleted(subscription) {
  try {
    const userId = subscription.metadata?.userId;
    if (!userId) return;

    console.log("Cancelling subscription for user:", userId);

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      "packageDetails.subStatus": "cancelled",
      "packageDetails.planStatus": "expired",
      isPremium: false,
      lastUpdated: new Date().toISOString(),
    });

    console.log("Subscription cancelled for user:", userId);
  } catch (error) {
    console.error("Error cancelling subscription:", error);
  }
}

async function handlePaymentSucceeded(invoice) {
  try {
    const subscriptionId = invoice.subscription;
    // You can fetch subscription details and update user accordingly
    console.log("Payment succeeded for subscription:", subscriptionId);
  } catch (error) {
    console.error("Error handling payment success:", error);
  }
}

async function handlePaymentFailed(invoice) {
  try {
    const subscriptionId = invoice.subscription;
    // You can fetch subscription details and update user accordingly
    console.log("Payment failed for subscription:", subscriptionId);
  } catch (error) {
    console.error("Error handling payment failure:", error);
  }
}
