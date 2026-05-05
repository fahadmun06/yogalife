/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, useCallback } from "react";
import { ArrowRight, Lock, BookOpen, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { toast } from "sonner";

import { useLandingPage } from "../hooks/useLandingPage";
import { useAuth } from "../hooks/useAuth";
import ApiFunction from "../components/api/apiFuntions";
import { stripeApi } from "../components/api/ApiRoutesFile";

function getStripePublishableKey() {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
}

let stripePromiseSingleton = null;

function getStripe() {
  const pk = getStripePublishableKey();

  if (!pk || !pk.startsWith("pk_")) {
    return Promise.resolve(null);
  }

  if (!stripePromiseSingleton) {
    stripePromiseSingleton = loadStripe(pk);
  }

  return stripePromiseSingleton;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      fontFamily:
        "ui-sans-serif, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      "::placeholder": { color: "#aab7c4" },
    },
    invalid: { color: "#9e2146" },
  },
};

/** CardElement + confirmCardPayment — must render inside <Elements>. */
function BlogCardPaymentForm({
  clientSecret,
  user,
  post,
  updateUser,
  blogToOpen,
  onPaid,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const billingName = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe is still loading. Please wait.");

      return;
    }

    const cardEl = elements.getElement(CardElement);

    if (!cardEl) {
      toast.error("Card field is not ready.");

      return;
    }

    setIsSubmitting(true);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardEl,
            billing_details: {
              name: billingName || undefined,
            },
          },
        },
      );

      if (error) {
        toast.error(error.message || "Payment failed");

        return;
      }

      if (paymentIntent?.status !== "succeeded") {
        toast.error("Payment was not completed.");

        return;
      }

      const res = await post(stripeApi.confirmBlogPayment, {
        paymentIntentId: paymentIntent.id,
      });

      if (!res.success) {
        toast.error(res?.message || res?.error || "Could not unlock book");

        return;
      }

      if (res.data?.user) updateUser(res.data.user);
      toast.success("Payment successful!");
      onPaid(blogToOpen);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Payment failed. Try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!stripe || !elements) {
    return (
      <div className="flex justify-center py-8">
        <Spinner label="Loading secure form…" />
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-zinc-700">
          Card details
        </span>
        <div className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-3">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>
      <Button
        className="w-full font-semibold"
        color="primary"
        isDisabled={isSubmitting}
        isLoading={isSubmitting}
        type="submit"
      >
        Complete payment
      </Button>
    </form>
  );
}

function hasPurchasedBlog(user, blogId) {
  const ids = user?.purchasedBlogIds || [];
  const s = String(blogId);

  return ids.some((id) => String(id) === s);
}

function isPaidBook(blog) {
  return blog && Number(blog.price) > 0;
}

export default function BlogSection({ embedded = false } = {}) {
  const router = useRouter();
  const { getBlogs } = useLandingPage();
  const { user, isAuthenticated, updateUser } = useAuth();
  const { post } = ApiFunction();
  const [blogs, setBlogs] = useState([]);
  const [settings, setSettings] = useState({
    tagline: "BLOG POSTS",
    title: "Sanctuary News Feed",
    description: "Welcome to our Sanctuary News Feed...",
  });
  const [loading, setLoading] = useState(true);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [intentLoading, setIntentLoading] = useState(false);

  useEffect(() => {
    const loadBlogs = async () => {
      const data = await getBlogs({ forceRefresh: true });

      if (data) {
        if (data.blogs) setBlogs(data.blogs);
        if (data.settings) setSettings(data.settings);
      }
      setLoading(false);
    };

    loadBlogs();
  }, []);

  const openBook = useCallback(
    (blog) => {
      let raw = (blog?.link ?? "").trim();

      if (!raw || raw === "#") {
        toast.error("This book has no link configured.");

        return;
      }

      if (raw.startsWith("//")) {
        raw = `https:${raw}`;
      }

      if (/^https?:\/\//i.test(raw)) {

        // console.log("raw",raw);
        const win = window.open(raw, "_blank", "noopener,noreferrer");

        if (!win) {
          const a = document.createElement("a");

          a.href = raw;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          document.body.appendChild(a);
          a.click();
          a.remove();
        }

        return;
      }

      const path = raw.startsWith("/") ? raw : `/${raw}`;

      router.push(path);
    },
    [router],
  );

  const handleCardActivate = (blog) => {
    if (!isPaidBook(blog)) {
      openBook(blog);

      return;
    }

    if (isAuthenticated && hasPurchasedBlog(user, blog._id)) {
      openBook(blog);

      return;
    }

    setSelectedBlog(blog);
    setPayModalOpen(true);
  };

  const fetchBlogPaymentIntent = async () => {
    if (!selectedBlog?._id) return false;

    if (!getStripePublishableKey().startsWith("pk_")) {
      toast.error(
        "Stripe publishable key is missing. Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.",
      );

      return false;
    }

    setIntentLoading(true);
    setClientSecret(null);

    try {
      const res = await post(stripeApi.createBlogPaymentIntent, {
        blogId: selectedBlog._id,
      });

      if (res.success && res.data?.clientSecret) {
        setClientSecret(res.data.clientSecret);

        return true;
      }

      toast.error(res?.message || res?.error || "Could not start payment");

      return false;
    } catch (e) {
      toast.error(
        e?.response?.data?.message || "Could not start payment. Try again.",
      );

      return false;
    } finally {
      setIntentLoading(false);
    }
  };

  const handlePayButtonPress = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to purchase.");

      return;
    }

    await fetchBlogPaymentIntent();
  };

  const goToLogin = () => {
    setPayModalOpen(false);
    const returnUrl = encodeURIComponent(
      `${window.location.origin}${window.location.pathname}${window.location.search}`,
    );

    router.push(`/auth/login?returnUrl=${returnUrl}`);
  };

  return (
    <section
      className={`relative font-poppins ${
        embedded
          ? "py-2 bg-transparent"
          : "py-20 bg-white"
      }`}
      id={embedded ? undefined : "blog_post"}
    >
      <div
        className={`mx-auto relative z-10 px-4 ${
          embedded ? "max-w-6xl" : "container text-center"
        }`}
      >
        {embedded ? (
          <div className="mb-8">
            <h2 className="text-2xl md:text-[32px] font-semibold tracking-[0.08em] uppercase text-[#64566A] font-poppins">
              {settings.title}
            </h2>
            {settings.description ? (
              <p className="text-gray-500 text-sm md:text-base mt-3 max-w-2xl whitespace-pre-wrap">
                {settings.description}
              </p>
            ) : null}
          </div>
        ) : (
          <>
            <motion.h4
              className="text-primary font-black text-xs tracking-[0.2em] uppercase"
              initial={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              {settings.tagline}
            </motion.h4>

            <motion.h2
              className="text-4xl md:text-5xl font-playfair text-black font-black mt-3"
              initial={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              {settings.title}
            </motion.h2>

            <motion.p
              className="text-gray-500 max-w-2xl mx-auto mt-6 text-sm md:text-base leading-relaxed whitespace-pre-wrap"
              initial={{ opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1 }}
            >
              {settings.description}
            </motion.p>
          </>
        )}

        <div
          className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 ${
            embedded ? "mt-4" : "mt-12"
          }`}
        >
          {loading ? (
            [1, 2].map((i) => (
              <div
                key={i}
                className="relative h-80 rounded-2xl bg-gray-200 animate-pulse overflow-hidden shadow-lg"
              >
                <div className="absolute inset-x-6 bottom-6 space-y-3">
                  <div className="h-4 w-24 bg-gray-300 rounded" />
                  <div className="h-6 w-3/4 bg-gray-300 rounded" />
                </div>
              </div>
            ))
          ) : blogs.length > 0 ? (
            blogs.map((blog, i) => {
              const paid = isPaidBook(blog);
              const unlocked =
                !paid ||
                (isAuthenticated && hasPurchasedBlog(user, blog._id));
              const currencyCode = (blog.currency || "jmd").toUpperCase();
              const amountStr = Number(blog.price || 0).toFixed(2);

              return (
                <motion.div
                  key={blog._id}
                  className="relative group overflow-hidden rounded-[1.25rem] shadow-lg cursor-pointer"
                  initial={{ opacity: 0, y: 40 }}
                  role="button"
                  tabIndex={0}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  viewport={{ once: true }}
                  whileInView={{ opacity: 1, y: 0 }}
                  onClick={() => handleCardActivate(blog)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleCardActivate(blog);
                    }
                  }}
                >
                  <img
                    alt={blog.title}
                    className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                    src={blog.img}
                  />

                  {/* Free / Paid + payment info */}
                  <div className="pointer-events-none absolute top-3 left-3 right-3 z-10 flex flex-wrap items-start justify-between gap-2">
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border shadow-sm ${
                        paid
                          ? "bg-amber-500/95 text-white border-white/40"
                          : "bg-emerald-600/95 text-white border-white/40"
                      }`}
                    >
                      {paid ? "Paid" : "Free"}
                    </span>
                    {paid ? (
                      <div className="flex flex-col items-end gap-1 max-w-[60%]">
                        {unlocked ? (
                          <span className="text-[10px] font-bold uppercase tracking-wide text-white bg-black/55 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/25 flex items-center gap-1 shadow-sm">
                            <BookOpen className="w-3 h-3 shrink-0" />
                            Unlocked
                          </span>
                        ) : (
                          <div className="text-right rounded-xl bg-black/60 backdrop-blur-md border border-white/20 px-3 py-2 shadow-lg">
                            <div className="flex items-center justify-end gap-1.5 text-white">
                              <CreditCard className="w-3.5 h-3.5 opacity-90 shrink-0" />
                              <span className="text-sm font-black tabular-nums">
                                {currencyCode} {amountStr}
                              </span>
                            </div>
                         
                            <p className="text-[9px] text-amber-200/95 mt-1 flex items-center justify-end gap-0.5 font-medium">
                              <Lock className="w-2.5 h-2.5" />
                              Pay to open
                            </p>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>

                  <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6 text-left">
                    <span className="text-sm text-white/85 font-medium">
                      {blog.category}
                    </span>
                    <h4 className="text-lg md:text-xl font-bold text-white mt-1.5 leading-tight">
                      {blog.title}
                    </h4>
                    {paid && !unlocked ? (
                      <p className="text-xs text-white/75 mt-2 font-medium">
                        Tap the card to pay securely, then we&apos;ll open this
                        resource.
                      </p>
                    ) : null}
                    {paid && unlocked ? (
                      <p className="text-xs text-emerald-200/90 mt-2 font-medium">
                        You own this — tap to open.
                      </p>
                    ) : null}
                    {!paid ? (
                      <p className="text-xs text-white/75 mt-2 font-medium">
                        Free access — tap to open.
                      </p>
                    ) : null}

                    <div className="mt-4">
                      <span
                        aria-hidden
                        className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-white text-primary shadow-md transition-all group-hover:bg-primary group-hover:text-white"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-1 md:col-span-2 xl:col-span-3 py-10 text-gray-400 italic">
              No news updates at the moment. Stay tuned!
            </div>
          )}
        </div>
      </div>

      <Modal
        isDismissable
        classNames={{ base: "font-poppins" }}
        isOpen={payModalOpen}
        placement="center"
        scrollBehavior="inside"
        onOpenChange={(open) => {
          setPayModalOpen(open);
          if (!open) {
            setClientSecret(null);
            setSelectedBlog(null);
            setIntentLoading(false);
          }
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-start">
                <span className="text-primary text-xs font-black tracking-widest uppercase">
                  Unlock book
                </span>
                <span className="text-xl font-bold text-zinc-900">
                  {selectedBlog?.title}
                </span>
              </ModalHeader>
              <ModalBody className="text-start text-zinc-600 text-sm leading-relaxed">
                {clientSecret ? (
                  <p>
                    Enter your card below, then tap{" "}
                    <strong>Complete payment</strong>. You stay on this page.
                  </p>
                ) : (
                  <p>
                    This resource is paid. Tap <strong>Pay now</strong> to load
                    the secure card form.
                  </p>
                )}
                {selectedBlog && isPaidBook(selectedBlog) ? (
                  <p className="font-semibold text-zinc-900">
                    Price:{" "}
                    <span className="text-primary">
                      {(selectedBlog.currency || "jmd").toUpperCase()}{" "}
                      {Number(selectedBlog.price).toFixed(2)}
                    </span>
                  </p>
                ) : null}
                {!isAuthenticated ? (
                  <p className="text-amber-700 bg-amber-50 border border-amber-100 rounded-lg p-3 text-xs">
                    Sign in to your Butterfly Sanctuary account before
                    purchasing.
                  </p>
                ) : null}
                {isAuthenticated ? (
                  intentLoading ? (
                    <div className="flex justify-center py-8">
                      <Spinner label="Preparing secure checkout…" />
                    </div>
                  ) : clientSecret ? (
                    <Elements
                      key={clientSecret}
                      options={{ clientSecret }}
                      stripe={getStripe()}
                    >
                      <BlogCardPaymentForm
                        blogToOpen={selectedBlog}
                        clientSecret={clientSecret}
                        post={post}
                        updateUser={updateUser}
                        user={user}
                        onPaid={(blog) => {
                          onClose?.();
                          setPayModalOpen(false);
                          setClientSecret(null);
                          setSelectedBlog(null);
                          openBook(blog);
                        }}
                      />
                    </Elements>
                  ) : (
                    <p className="text-xs text-zinc-500">
                      Your card details are only requested after you press Pay
                      now.
                    </p>
                  )
                ) : null}
              </ModalBody>
              {!(isAuthenticated && clientSecret) ? (
                <ModalFooter className="gap-2">
                  <Button variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  {!isAuthenticated ? (
                    <Button
                      className="font-semibold"
                      color="primary"
                      onPress={goToLogin}
                    >
                      Sign in to continue
                    </Button>
                  ) : (
                    <Button
                      className="font-semibold"
                      color="primary"
                      isDisabled={intentLoading}
                      isLoading={intentLoading}
                      onPress={handlePayButtonPress}
                    >
                      Pay now
                    </Button>
                  )}
                </ModalFooter>
              ) : null}
            </>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
}
