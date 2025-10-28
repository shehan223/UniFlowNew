import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "doctorAvailability";
const STORAGE_EVENT = "medical-availability-update";

const MedicalAvailabilityContext = createContext(undefined);

const readStoredAvailability = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null) {
      return false;
    }
    return JSON.parse(stored) === true;
  } catch (error) {
    return false;
  }
};

export const MedicalAvailabilityProvider = ({ children }) => {
  const [isAvailable, setIsAvailable] = useState(readStoredAvailability);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(isAvailable));
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: isAvailable }));
  }, [isAvailable]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key && event.key !== STORAGE_KEY) {
        return;
      }
      setIsAvailable(readStoredAvailability());
    };

    const handleCustomEvent = (event) => {
      if (typeof event.detail === "boolean") {
        setIsAvailable(event.detail);
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(STORAGE_EVENT, handleCustomEvent);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(STORAGE_EVENT, handleCustomEvent);
    };
  }, []);

  const contextValue = useMemo(
    () => ({
      isAvailable,
      setAvailability: setIsAvailable,
      resetAvailability: () => setIsAvailable(false),
    }),
    [isAvailable]
  );

  return (
    <MedicalAvailabilityContext.Provider value={contextValue}>
      {children}
    </MedicalAvailabilityContext.Provider>
  );
};

export const useMedicalAvailability = () => {
  const context = useContext(MedicalAvailabilityContext);
  if (!context) {
    throw new Error(
      "useMedicalAvailability must be used within a MedicalAvailabilityProvider"
    );
  }
  return context;
};
