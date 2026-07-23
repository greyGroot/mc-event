"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  CheckCircle2,
  XCircle,
  ScanLine,
  RefreshCw,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Clock,
  Building2,
  Briefcase,
  Hash,
} from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { Guest } from "@/types";

interface HostessScannerProps {
  password: string;
  onCheckInSuccess?: (guest: Guest) => void;
}

export function HostessScanner({ password, onCheckInSuccess }: HostessScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Overlay state
  const [overlayType, setOverlayType] = useState<"success" | "error" | null>(null);
  const [overlayGuest, setOverlayGuest] = useState<Guest | null>(null);
  const [overlayError, setOverlayError] = useState<string | null>(null);

  // Manual input state
  const [manualId, setManualId] = useState("");

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const scannerRegionId = "html5qr-code-scanner-region";

  // Helper to parse guest ID from scanned text (URL, JSON, or raw ID)
  const extractGuestId = (text: string): string => {
    const trimmed = text.trim();

    // Check if URL (e.g. http://.../ticket/MC-VIP-123456)
    if (trimmed.includes("/")) {
      const parts = trimmed.split("/").filter(Boolean);
      const lastPart = parts[parts.length - 1];
      if (lastPart) return lastPart.trim();
    }

    // Check if JSON
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed.id) return String(parsed.id).trim();
        if (parsed.guestId) return String(parsed.guestId).trim();
      } catch {
        // Fall back to raw string
      }
    }

    return trimmed;
  };

  const handleCheckIn = useCallback(
    async (rawGuestId: string) => {
      const guestId = extractGuestId(rawGuestId);
      if (!guestId) return;

      setIsProcessing(true);
      setCameraError(null);

      // Stop scanner while processing/showing overlay
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        try {
          await html5QrCodeRef.current.stop();
        } catch (err) {
          console.warn("Error stopping scanner:", err);
        }
        setIsScanning(false);
      }

      try {
        const res = await fetch("/api/hostess/checkin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ guestId, password }),
        });

        const data = await res.json();

        if (res.status === 200 && data.success && !data.alreadyCheckedIn) {
          // Success
          setOverlayType("success");
          setOverlayGuest(data.guest || null);
          setOverlayError(null);
          if (data.guest && onCheckInSuccess) {
            onCheckInSuccess(data.guest);
          }
        } else if (res.status === 400 && data.alreadyCheckedIn) {
          // Already checked in
          setOverlayType("error");
          setOverlayGuest(data.guest || null);
          setOverlayError("GUEST ALREADY CHECKED IN");
        } else if (res.status === 404) {
          // Guest not found
          setOverlayType("error");
          setOverlayGuest(null);
          setOverlayError(`Guest not found for ID "${guestId}"`);
        } else {
          // Generic error
          setOverlayType("error");
          setOverlayGuest(data.guest || null);
          setOverlayError(data.error || "Check-in failed. Please try again.");
        }
      } catch (err) {
        console.error("Check-in request error:", err);
        setOverlayType("error");
        setOverlayGuest(null);
        setOverlayError("Network error while verifying check-in");
      } finally {
        setIsProcessing(false);
      }
    },
    [password, onCheckInSuccess]
  );

  const startScanner = async () => {
    setCameraError(null);
    setOverlayType(null);

    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(scannerRegionId);
      }

      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: 250,
          disableFlip: false,
        },
        (decodedText) => {
          handleCheckIn(decodedText);
        },
        () => {
          // frame scan fail - ignore
        }
      );

      setIsScanning(true);
    } catch (err: unknown) {
      console.error("Failed to start html5-qrcode scanner:", err);
      const msg =
        err instanceof Error
          ? err.message
          : "Could not access camera. Please allow camera permissions or enter Guest ID manually.";
      setCameraError(msg);
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
      } catch (err) {
        console.warn("Error stopping scanner:", err);
      }
    }
    setIsScanning(false);
  };

  const closeOverlay = () => {
    setOverlayType(null);
    setOverlayGuest(null);
    setOverlayError(null);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualId.trim()) {
      handleCheckIn(manualId.trim());
      setManualId("");
    }
  };

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const formatTimestamp = (isoString?: string | null) => {
    if (!isoString) return "Just now";
    try {
      const date = new Date(isoString);
      return date.toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {/* Scanner Control Box */}
      <div className="w-full max-w-xl glass-card rounded-2xl p-6 relative overflow-hidden border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#eb001b]/20 to-[#ff5f00]/20 border border-[#ff5f00]/30 text-[#ff5f00]">
              <ScanLine className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">QR Hostess Terminal</h2>
              <p className="text-xs text-gray-400">Position guest QR pass in frame for instant check-in</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                isScanning
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  : "bg-gray-800 text-gray-400 border border-gray-700"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isScanning ? "bg-emerald-400 animate-ping" : "bg-gray-500"
                }`}
              />
              {isScanning ? "Camera Active" : "Standby"}
            </span>
          </div>
        </div>

        {/* Camera View Area */}
        <div className="relative w-full aspect-square max-h-[360px] rounded-xl overflow-hidden bg-black/90 border border-white/10 flex flex-col items-center justify-center">
          {/* HTML5 QR Code Container */}
          <div
            id={scannerRegionId}
            className="w-full h-full absolute inset-0 z-0"
            style={{ opacity: isScanning ? 1 : 0, pointerEvents: isScanning ? "auto" : "none" }}
          />

          {!isScanning && (
            <div className="flex flex-col items-center justify-center p-6 text-center z-10 space-y-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#eb001b]/10 via-[#ff5f00]/10 to-[#f79e1b]/10 border border-[#ff5f00]/30 flex items-center justify-center text-[#ff5f00] shadow-[0_0_30px_rgba(255,95,0,0.15)]">
                <Camera className="w-10 h-10" />
              </div>
              <div>
                <p className="text-base font-semibold text-gray-200">Camera Off</p>
                <p className="text-xs text-gray-400 max-w-xs mt-1">
                  Click below to activate camera scanner or enter Guest ID manually.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={startScanner}
                disabled={isProcessing}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#eb001b] via-[#ff5f00] to-[#f79e1b] text-white font-bold text-sm shadow-[0_0_25px_rgba(255,95,0,0.4)] hover:shadow-[0_0_35px_rgba(255,95,0,0.6)] transition-all duration-300 flex items-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Scan QR Code
              </motion.button>
            </div>
          )}

          {/* Active Camera Overlay controls */}
          {isScanning && (
            <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center">
              <button
                onClick={stopScanner}
                className="px-5 py-2 rounded-lg bg-black/80 hover:bg-black text-gray-300 hover:text-white border border-white/20 text-xs font-semibold backdrop-blur-md transition-colors"
              >
                Stop Camera
              </button>
            </div>
          )}

          {isProcessing && (
            <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-10 h-10 text-[#ff5f00] animate-spin" />
              <p className="text-sm font-semibold text-white">Verifying Guest Check-in...</p>
            </div>
          )}
        </div>

        {/* Camera error notification */}
        {cameraError && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-400 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{cameraError}</p>
          </div>
        )}

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#121212] px-3 text-gray-400 font-mono text-[11px]">
              Or Manual Code Lookup
            </span>
          </div>
        </div>

        {/* Manual ID Input Form */}
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={manualId}
              onChange={(e) => setManualId(e.target.value)}
              placeholder="e.g. MC-VIP-123456"
              className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff5f00] transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={!manualId.trim() || isProcessing}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-[#ff5f00] text-white font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <span>Check In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* FULL-SCREEN OVERLAYS (GLOWING GREEN OR GLOWING RED) */}
      <AnimatePresence>
        {overlayType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl"
          >
            {/* GLOWING GREEN SUCCESS OVERLAY */}
            {overlayType === "success" && (
              <motion.div
                initial={{ scale: 0.85, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.85, y: 30 }}
                className="w-full max-w-lg rounded-3xl p-8 bg-black/95 border-2 border-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.5)] flex flex-col items-center text-center relative overflow-hidden"
              >
                {/* Background glow accents */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl" />

                {/* Animated Green Badge Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(16,185,129,0.6)]"
                >
                  <CheckCircle2 className="w-14 h-14" />
                </motion.div>

                {/* Success Title */}
                <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  VIP Check-in Verified
                </span>
                <h2 className="text-3xl font-black text-white tracking-tight mb-6">
                  Access Granted
                </h2>

                {/* Guest Details Card */}
                {overlayGuest && (
                  <div className="w-full bg-white/5 rounded-2xl p-5 border border-emerald-500/30 text-left space-y-3 mb-6">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Guest Name</p>
                        <p className="text-xl font-bold text-white mt-0.5">
                          {overlayGuest.firstName} {overlayGuest.lastName}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-xs font-semibold border border-emerald-500/30">
                        {overlayGuest.id}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                      <div>
                        <p className="text-gray-400 flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                          Company
                        </p>
                        <p className="text-white font-medium text-sm mt-0.5">{overlayGuest.company}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                          Position
                        </p>
                        <p className="text-white font-medium text-sm mt-0.5">{overlayGuest.position}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        Check-in Time
                      </span>
                      <span className="text-emerald-300 font-mono font-medium">
                        {formatTimestamp(overlayGuest.checkedInAt)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="w-full flex gap-3">
                  <button
                    onClick={() => {
                      closeOverlay();
                      startScanner();
                    }}
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Scan Next Guest</span>
                  </button>
                  <button
                    onClick={closeOverlay}
                    className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white font-semibold text-sm transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            )}

            {/* GLOWING RED ERROR OVERLAY */}
            {overlayType === "error" && (
              <motion.div
                initial={{ scale: 0.85, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.85, y: 30 }}
                className="w-full max-w-lg rounded-3xl p-8 bg-black/95 border-2 border-red-500 shadow-[0_0_100px_rgba(239,68,68,0.5)] flex flex-col items-center text-center relative overflow-hidden"
              >
                {/* Background glow accents */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-red-500/20 rounded-full blur-3xl" />

                {/* Animated Red Warning Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="w-24 h-24 rounded-full bg-red-500/20 border-2 border-red-500 text-red-400 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(239,68,68,0.6)]"
                >
                  <XCircle className="w-14 h-14" />
                </motion.div>

                {/* Error Title */}
                <span className="px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/40 text-red-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Check-in Rejected
                </span>
                <h2 className="text-3xl font-black text-white tracking-tight mb-2">
                  {overlayError || "Entry Denied"}
                </h2>
                <p className="text-xs text-red-300/80 mb-6">
                  {overlayGuest
                    ? "This VIP pass has already been used for check-in."
                    : "The scanned QR pass could not be verified in the registration registry."}
                </p>

                {/* Guest Details Card if guest exists */}
                {overlayGuest && (
                  <div className="w-full bg-white/5 rounded-2xl p-5 border border-red-500/30 text-left space-y-3 mb-6">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Registered Guest</p>
                        <p className="text-xl font-bold text-white mt-0.5">
                          {overlayGuest.firstName} {overlayGuest.lastName}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-md bg-red-500/20 text-red-300 font-mono text-xs font-semibold border border-red-500/30">
                        {overlayGuest.id}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                      <div>
                        <p className="text-gray-400 flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-red-400" />
                          Company
                        </p>
                        <p className="text-white font-medium text-sm mt-0.5">{overlayGuest.company}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5 text-red-400" />
                          Position
                        </p>
                        <p className="text-white font-medium text-sm mt-0.5">{overlayGuest.position}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-red-400" />
                        First Checked In At
                      </span>
                      <span className="text-red-300 font-mono font-medium">
                        {formatTimestamp(overlayGuest.checkedInAt)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="w-full flex gap-3">
                  <button
                    onClick={() => {
                      closeOverlay();
                      startScanner();
                    }}
                    className="flex-1 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Try Again</span>
                  </button>
                  <button
                    onClick={closeOverlay}
                    className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white font-semibold text-sm transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
