"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { AlertCircle, Trash2 } from "lucide-react";

const ConfirmModal = ({
  isOpen,
  onOpenChange,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Delete",
  confirmColor = "danger",
  isLoading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      size="sm"
      classNames={{
        base: "border-[#f1f1f1] border",
        header: "border-b-[1px] border-[#f1f1f1]",
        footer: "border-t-[1px] border-[#f1f1f1]",
        closeButton: "hover:bg-white/5 active:bg-white/10",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-danger">
                <AlertCircle size={20} />
                <span className="font-bold">{title}</span>
              </div>
            </ModalHeader>
            <ModalBody className="py-6">
              <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={onClose}
                className="font-semibold text-gray-500"
                size="sm"
              >
                Cancel
              </Button>
              <Button
                color={confirmColor}
                onPress={() => {
                  onConfirm();
                  onClose();
                }}
                isLoading={isLoading}
                startContent={!isLoading && <Trash2 size={16} />}
                className="font-bold"
                size="sm"
              >
                {confirmLabel}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ConfirmModal;
