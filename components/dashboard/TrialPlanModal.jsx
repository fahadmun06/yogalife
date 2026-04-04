import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { CheckCircle2 } from "lucide-react";

export default function TrialPlanModal({ isOpen, onClose, packages, onSelect, isEligibleForTrial }) {
  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      scrollBehavior="inside"
      size="4xl"
      onClose={onClose}
    >
      <ModalContent className="rounded-[2.5rem] p-4">
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-2xl font-black">Choose Your Plan</h2>
          <p className="text-zinc-500 font-medium">
            {isEligibleForTrial 
              ? "Start your 7-day free trial on any plan. You won't be charged until your trial ends." 
              : "Upgrade to a pro plan to unlock all features."}
          </p>
        </ModalHeader>
        <ModalBody className="py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg._id}
                className="p-6 rounded-[2rem] border-2 border-zinc-100 dark:border-zinc-800 hover:border-[#764979]/30 transition-all flex flex-col h-full bg-zinc-50/30 dark:bg-zinc-800/20"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-black text-xl">{pkg.name}</h4>
                    <p className="text-2xl font-black mt-2">
                      ${pkg.price}
                      <span className="text-sm text-zinc-400 font-medium"> /{pkg.unit}</span>
                    </p>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8 flex-1">
                  {pkg.features.map((f, i) => (
                    <li key={i} className="text-sm text-zinc-500 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-[#764979]" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  fullWidth
                  className="bg-[#764979] text-white font-bold py-6 rounded-2xl shadow-lg shadow-purple-500/10"
                  onClick={() => onSelect(pkg._id, isEligibleForTrial)}
                >
                  {isEligibleForTrial ? "Start 7-Day Trial" : `Upgrade to ${pkg.name}`}
                </Button>
              </div>
            ))}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="rounded-xl font-bold" variant="light" onPress={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
