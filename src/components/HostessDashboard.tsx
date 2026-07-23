"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  RefreshCw,
  Users,
  UserCheck,
  UserX,
  Building2,
  Briefcase,
  Mail,
  Clock,
  Filter,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { Guest } from "@/types";

interface HostessDashboardProps {
  password: string;
  refreshSignal?: number;
}

type FilterStatus = "ALL" | "VISITED" | "VACANT";

export function HostessDashboard({ password, refreshSignal }: HostessDashboardProps) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("ALL");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchGuests = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/hostess/guests?password=${encodeURIComponent(password)}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch guest registry");
      }

      setGuests(data.guests || []);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to load guests");
    } finally {
      setIsLoading(false);
    }
  }, [password]);

  useEffect(() => {
    let isMounted = true;

    fetch(`/api/hostess/guests?password=${encodeURIComponent(password)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${password}`,
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (isMounted) {
          if (res.ok) {
            setGuests(data.guests || []);
            setLastUpdated(new Date().toLocaleTimeString());
            setError(null);
          } else {
            setError(data.error || "Failed to fetch guest registry");
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load guests");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [password, refreshSignal]);

  // Filtered guest list logic
  const filteredGuests = guests.filter((guest) => {
    // 1. Status filter
    if (statusFilter === "VISITED" && !guest.is_checked_in) return false;
    if (statusFilter === "VACANT" && guest.is_checked_in) return false;

    // 2. Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const fullName = `${guest.firstName} ${guest.lastName}`.toLowerCase();
      const company = (guest.company || "").toLowerCase();
      const position = (guest.position || "").toLowerCase();
      const email = (guest.email || "").toLowerCase();
      const id = (guest.id || "").toLowerCase();

      return (
        fullName.includes(query) ||
        company.includes(query) ||
        position.includes(query) ||
        email.includes(query) ||
        id.includes(query)
      );
    }

    return true;
  });

  // Calculate statistics
  const totalGuests = guests.length;
  const visitedGuests = guests.filter((g) => g.is_checked_in).length;
  const vacantGuests = totalGuests - visitedGuests;
  const visitedPercentage = totalGuests > 0 ? Math.round((visitedGuests / totalGuests) * 100) : 0;

  const formatTimestamp = (isoString?: string | null) => {
    if (!isoString) return "—";
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Registered */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 relative overflow-hidden flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Registered</p>
            <h3 className="text-3xl font-black text-white mt-1">{totalGuests}</h3>
            <p className="text-xs text-gray-500 mt-1">Confirmed Executive Attendees</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-white">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Visited (Glowing Green) */}
        <div className="glass-card rounded-2xl p-5 border border-emerald-500/30 relative overflow-hidden flex items-center justify-between shadow-[0_0_30px_rgba(16,185,129,0.15)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div>
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Visited (Checked In)
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-3xl font-black text-emerald-400">{visitedGuests}</h3>
              <span className="text-xs font-bold text-emerald-500/80 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                {visitedPercentage}%
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">On-site at terminal venue</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Vacant (Muted Gray) */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 relative overflow-hidden flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-gray-500" />
              Vacant (Pending)
            </p>
            <h3 className="text-3xl font-black text-gray-300 mt-1">{vacantGuests}</h3>
            <p className="text-xs text-gray-500 mt-1">Awaiting arrival at entrance</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-gray-800/80 border border-gray-700 text-gray-400">
            <UserX className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="glass-card rounded-2xl border border-white/10 p-6 overflow-hidden shadow-2xl space-y-6">
        {/* Controls Bar: Search, Filters, Refresh */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, company, title, email, or ID..."
              className="w-full bg-black/60 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff5f00] transition-colors"
            />
          </div>

          {/* Filter Tabs & Refresh button */}
          <div className="flex items-center gap-3 justify-between sm:justify-end">
            <div className="flex bg-black/60 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setStatusFilter("ALL")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === "ALL"
                    ? "bg-[#ff5f00] text-white shadow-md"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                All ({totalGuests})
              </button>
              <button
                onClick={() => setStatusFilter("VISITED")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  statusFilter === "VISITED"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Visited ({visitedGuests})
              </button>
              <button
                onClick={() => setStatusFilter("VACANT")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  statusFilter === "VACANT"
                    ? "bg-gray-700 text-white shadow-md"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                Vacant ({vacantGuests})
              </button>
            </div>

            <button
              onClick={fetchGuests}
              disabled={isLoading}
              title="Refresh Registry"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-[#ff5f00]" : ""}`} />
            </button>
          </div>
        </div>

        {/* Table Error */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Executive Dark Visitor Table */}
        <div className="w-full overflow-x-auto rounded-xl border border-white/10 bg-black/40">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-white/5 text-xs uppercase tracking-wider text-gray-400 border-b border-white/10">
              <tr>
                <th scope="col" className="py-3.5 px-4 font-semibold">
                  Guest ID
                </th>
                <th scope="col" className="py-3.5 px-4 font-semibold">
                  Guest Name
                </th>
                <th scope="col" className="py-3.5 px-4 font-semibold">
                  Company & Position
                </th>
                <th scope="col" className="py-3.5 px-4 font-semibold">
                  Contact
                </th>
                <th scope="col" className="py-3.5 px-4 font-semibold">
                  Status
                </th>
                <th scope="col" className="py-3.5 px-4 font-semibold">
                  Check-in Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {filteredGuests.length > 0 ? (
                  filteredGuests.map((guest) => (
                    <motion.tr
                      key={guest.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      {/* ID */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono text-xs px-2.5 py-1 rounded bg-white/5 border border-white/10 text-gray-300 group-hover:border-[#ff5f00]/40 transition-colors">
                          {guest.id}
                        </span>
                      </td>

                      {/* Guest Name */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-white text-base">
                          {guest.firstName} {guest.lastName}
                        </div>
                      </td>

                      {/* Company & Position */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-gray-200 font-medium flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-[#ff5f00]" />
                            {guest.company}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                            <Briefcase className="w-3 h-3 text-gray-500" />
                            {guest.position}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs font-mono text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-gray-500" />
                          {guest.email}
                        </div>
                      </td>

                      {/* Status Column with Badges: Visited (Glowing Green) vs Vacant (Muted Gray) */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {guest.is_checked_in ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                            Visited
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-800/80 border border-gray-700 text-gray-400 font-medium text-xs">
                            <Circle className="w-3 h-3 text-gray-500" />
                            Vacant
                          </span>
                        )}
                      </td>

                      {/* Checked in Time */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs font-mono text-gray-300">
                        {guest.is_checked_in ? (
                          <div className="flex items-center gap-1.5 text-emerald-300">
                            <Clock className="w-3.5 h-3.5 text-emerald-400" />
                            {formatTimestamp(guest.checkedInAt)}
                          </div>
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500 text-sm">
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin text-[#ff5f00]" />
                          <span>Loading visitor registry...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <Filter className="w-8 h-8 text-gray-600 mb-1" />
                          <p className="font-semibold text-gray-300">No Guests Found</p>
                          <p className="text-xs text-gray-500">
                            No attendees match your current search or status filter.
                          </p>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        {lastUpdated && (
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-white/5">
            <span>Showing {filteredGuests.length} of {totalGuests} guests</span>
            <span>Last synchronized: {lastUpdated}</span>
          </div>
        )}
      </div>
    </div>
  );
}
