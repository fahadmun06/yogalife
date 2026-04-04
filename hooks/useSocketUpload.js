import { useState, useEffect, useCallback, useRef } from "react";
import { socket } from "../socket"; // Assuming there's a global socket instance

/**
 * Custom hook for real-time socket-based file uploads
 */
export const useSocketUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [eta, setEta] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);

  const activeUploadId = useRef(null);

  useEffect(() => {
    const handleProgress = (data) => {
      if (data.uploadId === activeUploadId.current) {
        setProgress(data.progress || 0);
        setSpeed(data.speed || 0);
        setEta(data.eta || 0);
      }
    };

    const handleSuccess = (data) => {
      if (data.uploadId === activeUploadId.current) {
        setUploading(false);
        setSuccess(true);
        setFileUrl(data.url);
        setProgress(100);
      }
    };

    const handleError = (data) => {
      if (data.uploadId === activeUploadId.current) {
        setUploading(false);
        setError(data.message || "Upload failed");
      }
    };

    const handleRequestId = (data) => {
      activeUploadId.current = data.uploadId;
    };

    socket.on("upload_progress", handleProgress);
    socket.on("upload_success", handleSuccess);
    socket.on("upload_error", handleError);
    socket.on("upload_request_id", handleRequestId);

    return () => {
      socket.off("upload_progress", handleProgress);
      socket.off("upload_success", handleSuccess);
      socket.off("upload_error", handleError);
      socket.off("upload_request_id", handleRequestId);
    };
  }, []);

  const uploadFile = useCallback(async (file) => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError(null);
    setSuccess(false);

    // Initial event to start upload
    socket.emit("upload_start", {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });

    // Wait slightly for the server to send over the uploadId
    // In a real scenario, we'd wait for the request_id event properly
    const waitForUploadId = setInterval(() => {
      if (activeUploadId.current) {
        clearInterval(waitForUploadId);
        startChunking(file);
      }
    }, 100);

    const startChunking = (file) => {
      const CHUNK_SIZE = 1024 * 512; // 512KB chunks
      let offset = 0;

      const readNextChunk = () => {
        const slice = file.slice(offset, offset + CHUNK_SIZE);
        const reader = new FileReader();

        reader.onload = (e) => {
          socket.emit("upload_chunk", {
            uploadId: activeUploadId.current,
            chunk: e.target.result,
          });

          offset += CHUNK_SIZE;
          if (offset < file.size) {
            // Add a small delay to prevent overwhelming the socket if needed
            // but for better speed, we can send immediately or use a controlled approach
            readNextChunk();
          }
        };

        reader.readAsArrayBuffer(slice);
      };

      readNextChunk();
    };
  }, []);

  const cancelUpload = useCallback(() => {
    if (activeUploadId.current) {
      socket.emit("upload_cancel", { uploadId: activeUploadId.current });
      setUploading(false);
      setProgress(0);
      activeUploadId.current = null;
    }
  }, []);

  return {
    uploadFile,
    cancelUpload,
    uploading,
    progress,
    speed,
    eta,
    error,
    success,
    fileUrl,
  };
};
