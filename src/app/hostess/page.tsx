"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  KeyRound,
  ShieldCheck,
  LogOut,
  ScanLine,
  LayoutDashboard,
  Eye,
  EyeOff,
  Layers,
} from "lucide-react";
import { HostessScanner } from "@/components/HostessScanner";
import { HostessDashboard } from "@/components/HostessDashboard";

type TabMode = "SCANNER" | "DASHBOARD" | "SPLIT";

export default function HostessPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const [activeTab, setActiveTab] = useState<TabMode>("SCANNER");
  const [refreshSignal, setRefreshSignal] = useState(0);

  // Check for existing session on mount
  useEffect(() => {
    let isMounted = true;
    const savedPassword = sessionStorage.getItem("hostess_password");

    if (savedPassword) {
      fetch(`/api/hostess/guests?password=${encodeURIComponent(savedPassword)}`)
        .then((res) => {
          if (isMounted) {
            if (res.status === 200) {
              setIsAuthenticated(true);
            } else {
              sessionStorage.removeItem("hostess_password");
              setIsAuthenticated(false);
            }
          }
        })
        .catch(() => {
          if (isMounted) {
            setIsAuthenticated(false);
          }
        })
        .finally(() => {
          if (isMounted) {
            setIsCheckingAuth(false);
          }
        });
    } else {
      queueMicrotask(() => {
        if (isMounted) {
          setIsCheckingAuth(false);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const verifyPassword = useCallback(async (pwd: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/hostess/guests?password=${encodeURIComponent(pwd)}`);
      return res.status === 200;
    } catch {
      return false;
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) return;

    setIsVerifying(true);
    setAuthError(null);

    const isValid = await verifyPassword(passwordInput.trim());

    if (isValid) {
      const pwd = passwordInput.trim();
      sessionStorage.setItem("hostess_password", pwd);
      document.cookie = `hostess_auth=${encodeURIComponent(pwd)}; path=/; max-age=86400; SameSite=Lax`;
      setIsAuthenticated(true);
      setPasswordInput("");
    } else {
      setAuthError("Invalid Hostess Access Password. Please try again.");
    }

    setIsVerifying(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("hostess_password");
    document.cookie = "hostess_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setIsAuthenticated(false);
  };

  const handleCheckInSuccess = () => {
    // Increment signal to trigger HostessDashboard auto-refresh
    setRefreshSignal((prev) => prev + 1);
  };

  // Loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-t-[#ff5f00] border-r-transparent border-b-[#eb001b] border-l-transparent animate-spin" />
          <p className="text-xs font-mono text-gray-400">Verifying Hostess Credentials...</p>
        </div>
      </div>
    );
  }

  // 1. SLEEK PASSWORD ACCESS GATE SCREEN (UNAUTHENTICATED)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Decorative Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#eb001b]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[#ff5f00]/15 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md glass-card rounded-3xl p-8 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative z-10"
        >
          {/* Header Branding */}
          <div className="flex flex-col items-center text-center space-y-3 mb-8">
            <div className="flex items-center justify-center -space-x-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-[#eb001b] opacity-90 shadow-[0_0_20px_rgba(235,0,27,0.5)]" />
              <div className="w-12 h-12 rounded-full bg-[#ff5f00] opacity-90 shadow-[0_0_20px_rgba(255,95,0,0.5)]" />
            </div>

            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 font-mono text-xs font-semibold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#ff5f00]" />
              Mastercard Executive Terminal
            </span>

            <h1 className="text-2xl font-black text-white tracking-tight">
              Hostess Access Gate
            </h1>
            <p className="text-xs text-gray-400 max-w-xs">
              Enter authorized hostess security password to access VIP scanner and guest registry.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Hostess Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter access password..."
                  required
                  className="w-full bg-black/60 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff5f00] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-medium">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying || !passwordInput.trim()}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#eb001b] via-[#ff5f00] to-[#f79e1b] text-white font-bold text-sm shadow-[0_0_25px_rgba(255,95,0,0.4)] hover:shadow-[0_0_35px_rgba(255,95,0,0.6)] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate Access</span>
                </>
              )}
            </button>
          </form>

          <p className="text-[11px] text-gray-600 text-center mt-6">
            Default system fallback password available for terminal administrators.
          </p>
        </motion.div>
      </div>
    );
  }

  // 2. AUTHENTICATED HOSTESS TERMINAL DASHBOARD & SCANNER ROUTE
  const currentPassword = sessionStorage.getItem("hostess_password") || "mastercard2026";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo & Portal Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center -space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#eb001b] opacity-90 shadow-[0_0_12px_rgba(235,0,27,0.5)]" />
              <div className="w-8 h-8 rounded-full bg-[#ff5f00] opacity-90 shadow-[0_0_12px_rgba(255,95,0,0.5)]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-white tracking-tight">Hostess Terminal</h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                  Live Auth
                </span>
              </div>
              <p className="text-xs text-gray-400">Mastercard VIP Guest Scanning & Management</p>
            </div>
          </div>

          {/* Navigation Tab Toggles & Logout */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex bg-black/60 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setActiveTab("SCANNER")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === "SCANNER"
                    ? "bg-[#ff5f00] text-white shadow-[0_0_15px_rgba(255,95,0,0.4)]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <ScanLine className="w-4 h-4" />
                <span>QR Scanner</span>
              </button>

              <button
                onClick={() => setActiveTab("DASHBOARD")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === "DASHBOARD"
                    ? "bg-[#ff5f00] text-white shadow-[0_0_15px_rgba(255,95,0,0.4)]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Visitor Table</span>
              </button>

              <button
                onClick={() => setActiveTab("SPLIT")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === "SPLIT"
                    ? "bg-[#ff5f00] text-white shadow-[0_0_15px_rgba(255,95,0,0.4)]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Split View</span>
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-400 border border-white/10 transition-colors"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">
        <AnimatePresence mode="wait">
          {activeTab === "SCANNER" && (
            <motion.div
              key="tab-scanner"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full flex justify-center py-4"
            >
              <HostessScanner
                password={currentPassword}
                onCheckInSuccess={handleCheckInSuccess}
              />
            </motion.div>
          )}

          {activeTab === "DASHBOARD" && (
            <motion.div
              key="tab-dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <HostessDashboard
                password={currentPassword}
                refreshSignal={refreshSignal}
              />
            </motion.div>
          )}

          {activeTab === "SPLIT" && (
            <motion.div
              key="tab-split"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              <div className="lg:col-span-5">
                <HostessScanner
                  password={currentPassword}
                  onCheckInSuccess={handleCheckInSuccess}
                />
              </div>
              <div className="lg:col-span-7">
                <HostessDashboard
                  password={currentPassword}
                  refreshSignal={refreshSignal}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
