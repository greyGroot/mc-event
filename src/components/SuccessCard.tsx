"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import QRCode from "qrcode";
import { Guest } from "@/types";
import {
  Check,
  Download,
  Wallet,
  UserPlus,
  Building2,
  Briefcase,
  ShieldCheck,
  QrCode as QrIcon,
  CreditCard,
} from "lucide-react";

interface SuccessCardProps {
  guest: Guest;
  onReset: () => void;
}

export function SuccessCard({ guest, onReset }: SuccessCardProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrError, setQrError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    if (guest && guest.id) {
      QRCode.toDataURL(guest.id, {
        width: 250,
        margin: 1,
        color: {
          dark: "#0a0a0a",
          light: "#ffffff",
        },
      })
        .then((url) => {
          if (isMounted) {
            setQrDataUrl(url);
          }
        })
        .catch((err) => {
          console.error("Failed to generate QR code:", err);
          if (isMounted) {
            setQrError(true);
          }
        });
    }
    return () => {
      isMounted = false;
    };
  }, [guest]);

  const handleDownloadPDF = () => {
    window.open(`/api/ticket/${guest.id}`, "_blank");
  };

  const handleSaveWallet = () => {
    window.open(`/api/wallet/${guest.id}`, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-xl mx-auto"
    >
      {/* Outer Card Shell */}
      <div className="glass-card relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-neutral-800 shadow-2xl backdrop-blur-2xl bg-neutral-950/80">
        {/* Glowing Entrance Animated Aura */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-64 h-64 bg-[#FF5F00]/25 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute -bottom-32 -right-32 w-64 h-64 bg-[#F79E1B]/20 rounded-full blur-3xl pointer-events-none"
        />

        {/* Checkmark scale-in animation header */}
        <div className="flex flex-col items-center text-center mb-6 relative">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.15 }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-[#EB001B] via-[#FF5F00] to-[#F79E1B] p-0.5 shadow-lg shadow-[#FF5F00]/30 mb-3 flex items-center justify-center"
          >
            <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center">
              <Check className="w-8 h-8 text-[#FF5F00]" strokeWidth={3} />
            </div>
          </motion.div>

          {/* Badge Fade-in */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Registration Confirmed</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-luxury">
              VIP Pass Issued
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-md">
              Your registration is complete. Please present your pass or QR code upon arrival at the Mastercard Terminal.
            </p>
          </motion.div>
        </div>

        {/* VIP Ticket Card with Mastercard Branding */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative rounded-2xl p-6 mb-6 glowing-gradient-border overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-950 to-black text-white shadow-xl border border-neutral-800"
        >
          {/* Mastercard Brand Circles Logo */}
          <div className="absolute top-4 right-4 flex items-center opacity-90">
            <svg
              className="w-12 h-8"
              viewBox="0 0 100 65"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Mastercard Logo"
            >
              <circle cx="35" cy="32.5" r="30" fill="#EB001B" />
              <circle cx="65" cy="32.5" r="30" fill="#F79E1B" fillOpacity="0.92" />
              <path
                d="M50 8.5A30 30 0 0 0 35 32.5 30 30 0 0 0 50 56.5 30 30 0 0 0 65 32.5 30 30 0 0 50 8.5Z"
                fill="#FF5F00"
              />
            </svg>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#F79E1B] uppercase">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Mastercard VIP Access Pass</span>
            </div>
          </div>

          {/* Guest Full Name */}
          <div className="mb-4">
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Guest Name</span>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-luxury">
              {guest.firstName} {guest.lastName}
            </h3>
          </div>

          {/* Position & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 border-t border-b border-neutral-800/80 py-3 text-xs">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-0.5">Position</span>
              <div className="flex items-center gap-1.5 text-neutral-200 font-medium">
                <Briefcase className="w-3.5 h-3.5 text-[#FF5F00]" />
                <span className="truncate">{guest.position}</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-0.5">Company</span>
              <div className="flex items-center gap-1.5 text-neutral-200 font-medium">
                <Building2 className="w-3.5 h-3.5 text-[#F79E1B]" />
                <span className="truncate">{guest.company}</span>
              </div>
            </div>
          </div>

          {/* Bottom row: Guest ID & QR Code Preview */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-0.5">Guest ID</span>
              <span className="font-mono text-sm font-semibold tracking-wider text-[#FF5F00] bg-neutral-900/90 px-2.5 py-1 rounded border border-neutral-800 inline-block">
                {guest.id}
              </span>
            </div>

            {/* QR Code Preview Component */}
            <div className="flex flex-col items-center">
              <div className="bg-white p-2 rounded-xl shadow-md border border-neutral-200">
                {qrDataUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={qrDataUrl}
                    alt={`QR Code for guest ${guest.id}`}
                    className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
                  />
                ) : qrError ? (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 flex flex-col items-center justify-center text-neutral-400 text-xs text-center p-1">
                    <QrIcon className="w-6 h-6 mb-1 text-neutral-500" />
                    <span>QR Unavailable</span>
                  </div>
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center text-neutral-400 text-xs">
                    <span className="animate-pulse">Loading...</span>
                  </div>
                )}
              </div>
              <span className="text-[9px] uppercase tracking-widest text-neutral-400 mt-1 flex items-center gap-1">
                <QrIcon className="w-2.5 h-2.5 text-[#FF5F00]" /> Check-in QR
              </span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Download Ticket (PDF) */}
            <button
              onClick={handleDownloadPDF}
              type="button"
              className="w-full py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] shadow-md hover:border-[#FF5F00]/50"
            >
              <Download className="w-4 h-4 text-[#FF5F00]" />
              <span>Download Ticket (PDF)</span>
            </button>

            {/* Save to Android Wallet */}
            <button
              onClick={handleSaveWallet}
              type="button"
              className="w-full py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] shadow-md hover:border-[#F79E1B]/50"
            >
              <Wallet className="w-4 h-4 text-[#F79E1B]" />
              <span>Save to Android Wallet</span>
            </button>
          </div>

          {/* Register Another Guest */}
          <button
            onClick={onReset}
            type="button"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-neutral-800 to-neutral-900 hover:from-neutral-700 hover:to-neutral-800 border border-neutral-700/80 text-neutral-200 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
          >
            <UserPlus className="w-4 h-4 text-neutral-400" />
            <span>Register Another Guest</span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
