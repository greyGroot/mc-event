"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RegistrationForm, RegistrationFormData } from "@/components/RegistrationForm";
import { SuccessCard } from "@/components/SuccessCard";
import { Guest } from "@/types";

type RegistrationState = "idle" | "submitting" | "success";

export default function Home() {
  const [status, setStatus] = useState<RegistrationState>("idle");
  const [guest, setGuest] = useState<Guest | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (formData: RegistrationFormData) => {
    setStatus("submitting");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed. Please try again.");
      }

      const registeredGuest: Guest = data.guest ? data.guest : data;
      setGuest(registeredGuest);
      setStatus("success");
    } catch (err: unknown) {
      console.error("Registration error:", err);
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during registration.";
      setErrorMessage(message);
      setStatus("idle");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setGuest(null);
    setErrorMessage(null);
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center py-6 sm:py-12">
      <AnimatePresence mode="wait">
        {status === "success" && guest ? (
          <motion.div
            key="success-card"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <SuccessCard guest={guest} onReset={handleReset} />
          </motion.div>
        ) : (
          <motion.div
            key="registration-form"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <RegistrationForm
              onSubmit={handleSubmit}
              isLoading={status === "submitting"}
              errorMessage={errorMessage}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
