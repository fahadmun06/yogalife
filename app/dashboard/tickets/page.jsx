/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Input, Textarea } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { Trash2, Edit, Plus, Ticket } from "lucide-react";
import { toast } from "sonner";
import moment from "moment";

import ProductTable from "../../../productTable/ProductTable";

import ApiFunction from "@/components/api/apiFuntions";
import { useDispatch } from "react-redux";
import ConfirmModal from "@/components/ConfirmModal";
import { useSocket } from "@/context/SocketProvider";

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isEdit, setIsEdit] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [formData, setFormData] = useState({ subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const dispatch = useDispatch();
  const socket = useSocket();

  const {
    isOpen: isDetailsOpen,
    onOpen: onDetailsOpen,
    onOpenChange: onDetailsOpenChange,
  } = useDisclosure();
  const [selectedTicket, setSelectedTicket] = useState(null);

  const { get, post, deleteData, put } = ApiFunction();

  const fetchTickets = async (search = searchQuery, page = currentPage) => {
    setLoading(true);
    try {
      const res = await get(
        `support/my-tickets?search=${search}&page=${page}&limit=10`,
      );

      if (res && res.success) {
        setTickets(res.data);
        setTotalPages(res.totalPages || 1);
      }
    } catch (error) {
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(searchQuery, currentPage);
  }, [currentPage]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setCurrentPage(1); // Reset to page 1 on new search
      fetchTickets(searchQuery, 1);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification) => {
      if (
        notification?.title === "Ticket Updated" ||
        notification?.title === "Ticket Status Updated" ||
        notification?.title === "Admin Response Added"
      ) {
        // Auto refresh list when ticket is updated by admin
        fetchTickets();
      }
    };

    socket.on("new_notification", handleNewNotification);

    return () => {
      socket.off("new_notification", handleNewNotification);
    };
  }, [socket]);

  const openCreateModal = () => {
    setIsEdit(false);
    setFormData({ subject: "", message: "" });
    onOpen();
  };

  const openEditModal = (ticket) => {
    setIsEdit(true);
    setCurrentTicket(ticket);
    setFormData({
      subject: ticket.subject || "",
      message: ticket.message || "",
    });
    onOpen();
  };

  const openDetailsModal = (ticket) => {
    setSelectedTicket(ticket);
    onDetailsOpen();
  };

  const handleSubmit = async () => {
    if (!formData.subject || !formData.message) {
      toast.error("Please fill all fields");

      return;
    }
    setIsSubmitting(true);
    try {
      if (isEdit) {
        const res = await put(`support/ticket/${currentTicket._id}`, formData);

        if (res && res.success) {
          toast.success("Ticket updated successfully");
          fetchTickets();
          onClose();
        }
      } else {
        const res = await post("support/ticket", formData);

        if (res && res.success) {
          toast.success("Ticket created successfully");
          fetchTickets();
          onClose();
        }
      }
    } catch (error) {
      toast.error("Failed to save ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!ticketToDelete) return;
    setDeletingId(ticketToDelete._id);
    try {
      const res = await deleteData(`support/ticket/${ticketToDelete._id}`);

      if (res && res.success) {
        toast.success("Ticket deleted");
        fetchTickets();
      }
    } catch (error) {
      toast.error("Failed to delete ticket");
    } finally {
      setDeletingId(null);
      setTicketToDelete(null);
    }
  };

  const columns = [
    { key: "ticketId", label: "TICKET ID" },
    { key: "subject", label: "SUBJECT" },
    { key: "email", label: "EMAIL" },
    { key: "status", label: "STATUS" },
    { key: "createdAt", label: "CREATED AT" },
    { key: "actions", label: "ACTIONS" },
  ];

  const rows = tickets.map((item) => ({
    ticketId: (
      <span
        className="font-bold text-[#4A3B4C] cursor-pointer"
        onClick={() => openDetailsModal(item)}
      >
        {item.ticketId}
      </span>
    ),
    subject: (
      <span className="cursor-pointer" onClick={() => openDetailsModal(item)}>
        {item.subject}
      </span>
    ),
    email: <span className="text-gray-500 text-sm">{item.email}</span>,
    status: (
      <span
        className={
          "px-3 py-1 text-xs font-bold rounded-full uppercase cursor-pointer " +
          (item.status === "resolved"
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700")
        }
        onClick={() => openDetailsModal(item)}
      >
        {item.status}
      </span>
    ),
    createdAt: (
      <span className="cursor-pointer" onClick={() => openDetailsModal(item)}>
        {moment(item.createdAt).format("DD-MM-YYYY")}
      </span>
    ),
    actions: (
      <div className="flex items-center gap-2">
        <Button
          isIconOnly
          className="text-primary"
          variant="light"
          isDisabled={deletingId === item._id}
          onPress={() => openEditModal(item)}
        >
          <Edit size={18} />
        </Button>
        <Button
          isIconOnly
          className="text-danger"
          variant="light"
          isLoading={deletingId === item._id}
          onPress={() => setTicketToDelete(item)}
        >
          {deletingId !== item._id && <Trash2 size={18} />}
        </Button>
      </div>
    ),
  }));

  return (
    <div className="flex flex-col gap-8 min-h-screen font-poppins">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            My Tickets
          </h1>
          <p className="text-zinc-600 font-medium text-sm mt-1">
            Manage your support requests
          </p>
        </div>

        <Button
          startContent={<Plus size={20} />}
          variant="shadow"
          color="primary"
          size="sm"
          onPress={openCreateModal}
        >
          Create Ticket
        </Button>
      </div>

      {/* Table Section */}
      <div className="">
        <ProductTable
          columns={columns}
          isPagination={true}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          loading={loading}
          rows={rows}
          search={searchQuery}
          setSearch={setSearchQuery}
          onClearSearch={() => setSearchQuery("")}
        />
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {isEdit ? "Edit Ticket" : "Create New Ticket"}
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Subject"
                  placeholder="What is your request about?"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                />
                <Textarea
                  label="Message"
                  minRows={4}
                  placeholder="Describe your issue in detail..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isLoading={isSubmitting}
                  onPress={handleSubmit}
                >
                  {isEdit ? "Update Ticket" : "Submit Ticket"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={isDetailsOpen}
        size="2xl"
        onOpenChange={onDetailsOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <span className="text-gray-500 text-sm font-normal">
                  Ticket {selectedTicket?.ticketId}
                </span>
                <span className="text-xl font-bold">
                  {selectedTicket?.subject}
                </span>
              </ModalHeader>
              <ModalBody>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h4 className="font-semibold text-gray-700 mb-2">Message:</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {selectedTicket?.message}
                  </p>
                </div>

                <div className="mt-4 border-t border-gray-100 pt-4">
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center justify-between">
                    Admin Response:
                    <span
                      className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase ${
                        selectedTicket?.status === "resolved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {selectedTicket?.status}
                    </span>
                  </h4>
                  {selectedTicket?.adminResponse ? (
                    <div className="bg-[#FCF6F5] p-4 rounded-xl border border-primary/20">
                      <p className="text-gray-800 whitespace-pre-wrap">
                        {selectedTicket.adminResponse}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">
                      No response from admin yet.
                    </p>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!ticketToDelete}
        onOpenChange={(open) => !open && setTicketToDelete(null)}
        title="Delete Ticket"
        message={`Are you sure you want to delete ticket ${ticketToDelete?.ticketId}? This action cannot be undone.`}
        confirmLabel="Delete Ticket"
        onConfirm={confirmDelete}
        isLoading={deletingId === ticketToDelete?._id}
      />
    </div>
  );
}
