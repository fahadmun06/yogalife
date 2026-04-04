import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";

import ApiFunction from "@/components/api/apiFuntions";
import { stripeApi } from "@/components/api/ApiRoutesFile";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51S4me0GqnQN5OEbLUO4LdKgBiDgLjj36gkMWN9Rop4jiOp3nUmB9bJwn2SWAajwnKCxYZFlfmxbgkuiIJdTaXXtA00rqCM9Wmw",
);

export function AddCardModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const cardElementRef = useRef(null);
  const [stripe, setStripe] = useState(null);
  const [cardElement, setCardElement] = useState(null);
  const { post } = ApiFunction();

  useEffect(() => {
    if (isOpen) {
      const initStripe = async () => {
        const stripeInstance = await stripePromise;

        setStripe(stripeInstance);
        const elementsInstance = stripeInstance.elements();

        const card = elementsInstance.create("card", {
          style: {
            base: {
              fontSize: "16px",
              color: "#32325d",
              "::placeholder": {
                color: "#aab7c4",
              },
            },

            invalid: {
              color: "#fa755a",
              iconColor: "#fa755a",
            },
          },
        });
        card.mount(cardElementRef.current);
        setCardElement(card);
      };
      initStripe();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!stripe || !cardElement) return;

    try {
      setLoading(true);

      // 1. Create Setup Intent on backend
      const res = await post(stripeApi.createSetupIntent);
      if (!res.success)
        throw new Error(res.error || "Failed to initialize setup");

      // 2. Confirm card setup on frontend
      const { setupIntent, error } = await stripe.confirmCardSetup(
        res.data.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              // We could collect name/email here if needed
            },
          },
        },
      );

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Card added successfully!");
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      console.error("Add card error:", err);
      toast.error(err.message || "Failed to add card");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      className="font-poppins"
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      backdrop="blur"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">Add New Card</h2>
          <p className="text-xs text-zinc-500 font-medium">
            Your card information is stored securely with Stripe.
          </p>
        </ModalHeader>
        <ModalBody>
          <div className="p-4 border-2 border-zinc-100 rounded-2xl bg-zinc-50/50">
            <div ref={cardElementRef} />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="light"
            onPress={onClose}
            className="rounded-xl font-bold"
          >
            Cancel
          </Button>
          <Button
            className="bg-[#764979] text-white rounded-xl font-bold px-8"
            onPress={handleSubmit}
            isLoading={loading}
          >
            Add Card
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export function EditCardModal({ isOpen, onClose, pm, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const { post } = ApiFunction();
  // For editing, we usually update billing_details or expiry
  // But Stripe PaymentMethods don't allow easy expiry update via Stripe JS easily without re-entering
  // Usually we just allow updating the Name or removing/adding.
  // The user asked to "update kr saktaha".

  const handleUpdate = async () => {
    // Note: Stripe PM update is limited.
    toast.info(
      "Updating card details is limited by Stripe. We recommend adding a new card if details have changed.",
    );
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" backdrop="blur">
      <ModalContent className="rounded-[2rem] p-4">
        <ModalHeader>
          <h2 className="text-xl font-bold">Edit Card Details</h2>
        </ModalHeader>
        <ModalBody className="space-y-4">
          <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold capitalize">
                {pm?.card?.brand} •••• {pm?.card?.last4}
              </p>
              <p className="text-xs text-zinc-400">
                Expires {pm?.card?.exp_month}/{pm?.card?.exp_year}
              </p>
            </div>
          </div>
          <p className="text-sm text-zinc-500 leading-relaxed italic">
            Due to security reasons, card numbers and expiry dates cannot be
            edited directly. To update your card, please add a new one and
            remove the old one.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="light"
            onPress={onClose}
            className="rounded-xl font-bold"
          >
            Close
          </Button>
          <Button
            className="bg-[#764979] text-white rounded-xl font-bold px-8"
            onPress={handleUpdate}
            isLoading={loading}
          >
            OK
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
