"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Textarea, Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { Trash2, MessageSquare, Ticket } from "lucide-react";
import { toast } from "sonner";
import ApiFunction from "@/components/api/apiFuntions";
import { supportApi } from "@/components/api/ApiRoutesFile";

export default function AdminSupportPage() {
  const [supports, setSupports] = useState([]);
  const [loading, setLoading] = useState(true);

  const { get, deleteData, put } = ApiFunction();

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState(null);
  const [adminResponse, setAdminResponse] = useState("");
  const [status, setStatus] = useState("pending");

  const fetchSupports = async () => {
    setLoading(true);
    try {
      const res = await get(supportApi.getAll);
      if (res && res.success) {
        setSupports(res.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load support messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupports();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await deleteData(supportApi.delete(id));
      if (res && res.success) {
        toast.success("Message deleted successfully");
        fetchSupports();
      }
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const openRespondModal = (item) => {
    setSelectedItem(item);
    setAdminResponse(item.adminResponse || "");
    setStatus(item.status || "pending");
    onOpen();
  };

  const handleSaveResponse = async () => {
    try {
      const res = await put(supportApi.updateStatus(selectedItem._id), {
        status,
        adminResponse,
      });
      if (res && res.success) {
        toast.success("Response saved and user notified!");
        fetchSupports();
        onClose();
      }
    } catch (error) {
      toast.error("Failed to save response");
    }
  };

  return (
    <div className="flex flex-col gap-8 min-h-screen font-poppins">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#4A3B4C]">Support Tickets</h1>
          <p className="text-gray-500">View user tickets and send responses</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-10">
            <Spinner color="secondary" />
          </div>
        ) : supports.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-20 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
            <Ticket size={64} className="mb-4 opacity-20" />
            <p className="text-xl font-semibold">No tickets found</p>
            <p className="text-sm">There are no support requests right now.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table aria-label="Support messages table">
              <TableHeader>
                <TableColumn>ID</TableColumn>
                <TableColumn>SUBJECT</TableColumn>
                <TableColumn>SENDER</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>DATE</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {supports.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-bold text-[#4A3B4C]">{item.ticketId || "Contact Form"}</TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate" title={item.subject}>{item.subject || "No Subject"}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold">{item.firstName} {item.lastName}</span>
                        <span className="text-xs text-gray-500">{item.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${
                          item.status === "resolved"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          isIconOnly
                          variant="light"
                          className="text-primary"
                          onPress={() => openRespondModal(item)}
                          title="Respond"
                        >
                          <MessageSquare size={18} />
                        </Button>
                        <Button
                          isIconOnly
                          variant="light"
                          className="text-danger"
                          onPress={() => handleDelete(item._id)}
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Respond to Ticket {selectedItem?.ticketId}
              </ModalHeader>
              <ModalBody>
                <div className="bg-gray-50 p-4 rounded-xl mb-2">
                  <h4 className="font-bold text-gray-700">Subject: {selectedItem?.subject}</h4>
                  <p className="text-sm mt-2 text-gray-600 whitespace-pre-wrap">{selectedItem?.message}</p>
                </div>

                <div className="flex flex-col gap-4 mt-2">
                  <div className="flex bg-gray-100 p-1 rounded-lg w-max">
                    <button
                      className={`px-4 py-2 rounded-md text-sm font-semibold transition ${status === "pending" ? "bg-white shadow text-yellow-600" : "text-gray-500 hover:text-gray-800"}`}
                      onClick={() => setStatus("pending")}
                    >
                      Pending
                    </button>
                    <button
                      className={`px-4 py-2 rounded-md text-sm font-semibold transition ${status === "resolved" ? "bg-white shadow text-green-600" : "text-gray-500 hover:text-gray-800"}`}
                      onClick={() => setStatus("resolved")}
                    >
                      Resolved
                    </button>
                  </div>

                  <Textarea
                    label="Admin Response"
                    placeholder="Type your response to the user here. They will be notified via email."
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    minRows={5}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSaveResponse}>
                  Save & Notify Sender
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

    </div>
  );
}
