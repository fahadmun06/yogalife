export const runtime = "nodejs";
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
const stripe = new Stripe(stripeSecretKey, { apiVersion: "2024-06-20" });

export async function POST(request) {
  try {
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY" },
        { status: 500 }
      );
    }

    let body = {};

    try {
      body = await request.json();
    } catch {}

    const plan = body?.plan || "monthly";
    const userId = body?.userId || null;
    const userEmail = body?.userEmail || null;
    const origin =
      request.headers.get("origin") || request.headers.get("referer") || "";

    // JMD pricing (converted to cents for Stripe)
    // const plans = {
    //   monthly: { amount: 7500, interval: "month" }, // JMD 75.00
    //   quarterly: { amount: 22500, interval: "month", interval_count: 3 }, // JMD 225.00
    //   yearly: { amount: 75500, interval: "year" }, // JMD 755.00
    // };
    const plans = {
      monthly: { amount: 750000, interval: "month" }, // JMD 7500.00
      quarterly: { amount: 2250000, interval: "month", interval_count: 3 }, // JMD 22500.00
      yearly: { amount: 7550000, interval: "year" }, // JMD 75500.00
    };

    const selected = plans[plan] || plans.monthly;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "jmd", // Changed to JMD
            product_data: {
              name: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan - Tinashaii`,
              description: `Access to premium content and features for ${plan} subscription`,
            },
            unit_amount: selected.amount,
            recurring: {
              interval: selected.interval,
              interval_count: selected.interval_count || 1,
            },
          },
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 7,
        metadata: {
          userId: userId || "",
          planType: plan,
          userEmail: userEmail || "",
        },
      },
      metadata: {
        userId: userId || "",
        planType: plan,
        userEmail: userEmail || "",
      },
      customer_email: userEmail,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
    });

    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error("Stripe checkout session creation error:", error);

    return NextResponse.json(
      { error: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
