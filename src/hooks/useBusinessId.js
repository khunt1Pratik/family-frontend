import { useState, useEffect } from "react";

export default function useBusinessId() {
  const [businessId, setBusinessId] = useState(() =>
    localStorage.getItem("BusinessId")
  );

  // Listen to localStorage changes (even same tab)
  useEffect(() => {
    const handler = () => {
      setBusinessId(localStorage.getItem("BusinessId"));
    };

    window.addEventListener("storage", handler);
    window.addEventListener("businessIdUpdated", handler);

    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("businessIdUpdated", handler);
    };
  }, []);

  const updateBusinessId = (id) => {
    localStorage.setItem("BusinessId", id);
    setBusinessId(id);

    // custom event for same-tab realtime update
    window.dispatchEvent(new Event("businessIdUpdated"));
  };

  return { businessId, updateBusinessId };
}
