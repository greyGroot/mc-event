"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Building2, Briefcase, Mail, Loader2, Sparkles } from "lucide-react";

export const registrationSchema = z.object({
  firstName: z.string().min(1, "First name is required").trim(),
  lastName: z.string().min(1, "Last name is required").trim(),
  company: z.string().min(1, "Company name is required").trim(),
  position: z.string().min(1, "Position / Title is required").trim(),
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address")
    .trim(),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;

interface RegistrationFormProps {
  onSubmit: (data: RegistrationFormData) => Promise<void>;
  isLoading?: boolean;
  errorMessage?: string | null;
}

export function RegistrationForm({
  onSubmit,
  isLoading = false,
  errorMessage = null,
}: RegistrationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      company: "",
      position: "",
      email: "",
    },
  });

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="glass-card relative overflow-hidden rounded-2xl p-6 sm:p-8 border border-neutral-800/80 shadow-2xl backdrop-blur-xl bg-neutral-900/70">
        {/* Glowing Ambient Background Accents */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#FF5F00]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#F79E1B]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Form Header */}
        <div className="relative mb-6 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5F00]/10 border border-[#FF5F00]/30 text-[#FF5F00] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VIP Registration</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-luxury">
            Request Event Pass
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Please fill in your executive details to generate your digital Mastercard VIP pass.
          </p>
        </div>

        {/* Global Error Banner if submission failed */}
        {errorMessage && (
          <div
            className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-sm flex items-start gap-3"
            role="alert"
          >
            <span>{errorMessage}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-5 relative"
          noValidate
        >
          {/* Name fields responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1.5"
              >
                First Name <span className="text-[#FF5F00]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  {...register("firstName")}
                  className={`w-full pl-10 pr-4 py-2.5 bg-neutral-950/60 border ${
                    errors.firstName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-neutral-800 focus:border-[#FF5F00] focus:ring-[#FF5F00]"
                  } rounded-xl text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-1 transition-all duration-200`}
                  disabled={isLoading}
                />
              </div>
              {errors.firstName && (
                <p className="mt-1.5 text-xs text-red-400">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="lastName"
                className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1.5"
              >
                Last Name <span className="text-[#FF5F00]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  {...register("lastName")}
                  className={`w-full pl-10 pr-4 py-2.5 bg-neutral-950/60 border ${
                    errors.lastName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-neutral-800 focus:border-[#FF5F00] focus:ring-[#FF5F00]"
                  } rounded-xl text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-1 transition-all duration-200`}
                  disabled={isLoading}
                />
              </div>
              {errors.lastName && (
                <p className="mt-1.5 text-xs text-red-400">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Company Field */}
          <div>
            <label
              htmlFor="company"
              className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1.5"
            >
              Company <span className="text-[#FF5F00]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <Building2 className="w-4 h-4" />
              </div>
              <input
                id="company"
                type="text"
                placeholder="Acme Financial Corp"
                {...register("company")}
                className={`w-full pl-10 pr-4 py-2.5 bg-neutral-950/60 border ${
                  errors.company
                    ? "border-red-500 focus:ring-red-500"
                    : "border-neutral-800 focus:border-[#FF5F00] focus:ring-[#FF5F00]"
                } rounded-xl text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-1 transition-all duration-200`}
                disabled={isLoading}
              />
            </div>
            {errors.company && (
              <p className="mt-1.5 text-xs text-red-400">
                {errors.company.message}
              </p>
            )}
          </div>

          {/* Position Field */}
          <div>
            <label
              htmlFor="position"
              className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1.5"
            >
              Position / Title <span className="text-[#FF5F00]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <Briefcase className="w-4 h-4" />
              </div>
              <input
                id="position"
                type="text"
                placeholder="Managing Director"
                {...register("position")}
                className={`w-full pl-10 pr-4 py-2.5 bg-neutral-950/60 border ${
                  errors.position
                    ? "border-red-500 focus:ring-red-500"
                    : "border-neutral-800 focus:border-[#FF5F00] focus:ring-[#FF5F00]"
                } rounded-xl text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-1 transition-all duration-200`}
                disabled={isLoading}
              />
            </div>
            {errors.position && (
              <p className="mt-1.5 text-xs text-red-400">
                {errors.position.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1.5"
            >
              Email Address <span className="text-[#FF5F00]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="email"
                type="email"
                placeholder="john.doe@company.com"
                {...register("email")}
                className={`w-full pl-10 pr-4 py-2.5 bg-neutral-950/60 border ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-neutral-800 focus:border-[#FF5F00] focus:ring-[#FF5F00]"
                } rounded-xl text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-1 transition-all duration-200`}
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>

          {/* Accessible Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isLoading}
              aria-busy={isLoading}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#EB001B] via-[#FF5F00] to-[#F79E1B] hover:opacity-95 text-white font-semibold shadow-lg shadow-[#FF5F00]/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm tracking-wide active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing VIP Access...</span>
                </>
              ) : (
                <span>Register for VIP Access</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
