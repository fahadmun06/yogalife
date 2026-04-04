import React from "react";
import { Progress } from "@heroui/react";

/**
 * Premium Upload Progress Component
 */
const UploadProgress = ({ progress, speed, eta, fileName, onCancel }) => {
  if (progress === 0 && !speed) return null;

  const formatETA = (seconds) => {
    if (!seconds) return "0s";
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  return (
    <div className="w-full max-w-md p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-xl space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[200px]">
            {fileName || "Uploading file..."}
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {progress < 100
              ? "Sending chunks to server..."
              : "Processing on server..."}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors"
        >
          Cancel
        </button>
      </div>

      <Progress
        aria-label="Upload progress"
        size="md"
        value={progress}
        color="secondary"
        showValueLabel={true}
        className="w-full"
        classNames={{
          indicator: "bg-gradient-to-r from-[#764979] to-[#9c66a1]",
          track: "bg-zinc-100 dark:bg-zinc-800",
          value: "text-xs font-bold text-[#764979]",
        }}
      />

      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
            {speed} MB/s
          </span>
        </div>
        <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
          {eta > 0
            ? `${formatETA(eta)} remaining`
            : progress === 100
              ? "Almost done"
              : "Calculating..."}
        </span>
      </div>
    </div>
  );
};

export default UploadProgress;
