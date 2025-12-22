"use client";

import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";

import { db } from "../config/firebase";

export default function DebugFirebase() {
  const [status, setStatus] = useState("Not tested");
  const [details, setDetails] = useState("");

  const testConnection = async () => {
    setStatus("Testing...");
    setDetails("");

    try {
      console.log("Testing Firebase connection...");
      console.log("Firebase app:", db.app.name);
      console.log("Firebase project:", db.app.options.projectId);

      // Try to read a test document
      const testRef = doc(db, "test", "connection");
      const testSnap = await getDoc(testRef);

      setStatus("✅ Connected");
      setDetails(
        `Firebase is working. Test document exists: ${testSnap.exists()}`
      );
      console.log("Firebase connection test successful");
    } catch (error) {
      setStatus("❌ Failed");
      setDetails(`Error: ${error.message}`);
      console.error("Firebase connection test failed:", error);
    }
  };

  return (
    <>
      {/* <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border z-50">
        <h3 className="font-bold text-sm mb-2">Firebase Debug</h3>
        <div className="text-xs mb-2">
          <div>Status: {status}</div>
          <div>Details: {details}</div>
        </div>
        <button
          onClick={testConnection}
          className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
        >
          Test Connection
        </button>
      </div> */}
    </>
  );
}
