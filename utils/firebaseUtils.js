// Firebase utility functions for connection and error handling

export const checkFirebaseConnection = async (db) => {
  try {
    // Try to read a test document to check connection
    const testDoc = doc(db, "test", "connection");
    const testSnap = await getDoc(testDoc);

    return { connected: true, error: null };
  } catch (error) {
    console.error("Firebase connection check failed:", error);

    return { connected: false, error: error.message };
  }
};

export const isFirebaseOfflineError = (error) => {
  return (
    error?.message?.includes("offline") ||
    error?.message?.includes("Failed to get document") ||
    error?.code === "unavailable"
  );
};

export const handleFirebaseError = (error, fallbackAction) => {
  console.error("Firebase error:", error);

  if (isFirebaseOfflineError(error)) {
    console.log("Firebase appears to be offline, using fallback");
    if (fallbackAction) {
      fallbackAction();
    }

    return true; // Indicates error was handled
  }

  return false; // Error not handled, should be re-thrown
};

export const createFirebaseTimeout = (timeoutMs = 8000) => {
  return new Promise((_, reject) =>
    setTimeout(
      () => reject(new Error("Firebase operation timeout")),
      timeoutMs,
    ),
  );
};
