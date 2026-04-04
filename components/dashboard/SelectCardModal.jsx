import { useState, useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { CreditCard, CheckCircle2 } from "lucide-react";

export default function SelectCardModal({ isOpen, onClose, cards, onSelect, loading }) {
  const [selectedCardId, setSelectedCardId] = useState(null);

  useEffect(() => {
    if (isOpen && cards.length > 0 && !selectedCardId) {
      setSelectedCardId(cards[0].id);
    }
    if (!isOpen) {
      setSelectedCardId(null);
    }
  }, [isOpen, cards, selectedCardId]);

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      scrollBehavior="inside"
      size="md"
      onClose={onClose}
    >
      <ModalContent className="rounded-[2.5rem] p-4">
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-2xl font-black">Select Payment Method</h2>
          <p className="text-zinc-500 font-medium text-sm">
            Choose which card you want to use for this upgrade.
          </p>
        </ModalHeader>
        <ModalBody className="py-6 space-y-4">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => setSelectedCardId(card.id)}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                selectedCardId === card.id 
                  ? "border-[#764979] bg-[#764979]/5" 
                  : "border-zinc-100 dark:border-zinc-800 hover:border-zinc-200"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${
                  selectedCardId === card.id ? "bg-[#764979] text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                }`}>
                  <CreditCard size={20} />
                </div>
                <div>
                  <p className="font-bold capitalize">{card.card.brand} •••• {card.card.last4}</p>
                  <p className="text-xs text-zinc-400">Expires {card.card.exp_month}/{card.card.exp_year}</p>
                </div>
              </div>
              {selectedCardId === card.id && (
                <div className="w-6 h-6 rounded-full bg-[#764979] flex items-center justify-center">
                  <CheckCircle2 size={14} className="text-white" />
                </div>
              )}
            </div>
          ))}
        </ModalBody>
        <ModalFooter>
          <Button className="rounded-xl font-bold" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-[#764979] text-white rounded-xl font-bold px-8"
            isLoading={loading}
            onClick={() => onSelect(selectedCardId)}
          >
            Confirm & Pay
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
