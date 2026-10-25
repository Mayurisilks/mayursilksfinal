"use client";

import * as React from "react";
import { ArrowUpRight } from "lucide-react";

type BaseProps = {
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

type TextButtonProps = BaseProps & {
  children: React.ReactNode;
  icon?: React.ReactNode;
};

type MayuriTextButtonProps = BaseProps & {
  children: React.ReactNode;
  variant?: "primary" | "outline";
};

export function MayuriButton({
  children,
  icon,
  onClick,
  className = "",
  ariaLabel,
  disabled = false,
  type = "button",
}: TextButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`group inline-flex min-h-12 cursor-pointer items-center justify-center gap-4 rounded-full border border-[#550022] bg-[#550022] py-1.5 pl-6 pr-1.5 text-sm font-semibold text-white transition-colors duration-300 ease-in-out hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#550022] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      <span>{children}</span>

      {icon && (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-[#550022] transition-colors duration-300 ease-in-out group-hover:bg-[#550022] group-hover:text-white">
          {icon}
        </span>
      )}
    </button>
  );
}

export function MayuriTextButton({
  children,
  onClick,
  className = "",
  ariaLabel,
  disabled = false,
  type = "button",
  variant = "primary",
}: MayuriTextButtonProps) {
  const isOutline = variant === "outline";

  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`group relative isolate inline-flex min-h-12 cursor-pointer items-center justify-center overflow-hidden rounded-full border px-6 py-3 text-sm font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#550022] disabled:cursor-not-allowed disabled:opacity-50 ${
        isOutline
          ? "border-[#550022] bg-white text-[#550022]"
          : "border-[#550022] bg-[#550022] text-white"
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-[2px] z-0 origin-left rounded-full transition-transform duration-500 ease-in-out group-hover:scale-x-100 ${
          isOutline ? "scale-x-0 bg-[#550022]" : "scale-x-0 bg-white"
        }`}
      />

      <span
        className={`relative z-10 transition-colors duration-500 ${
          isOutline
            ? "text-[#550022] group-hover:text-white"
            : "text-white group-hover:text-[#550022]"
        }`}
      >
        {children}
      </span>
    </button>
  );
}

export function MayuriIconButton({
  icon,
  onClick,
  className = "",
  ariaLabel,
  disabled = false,
  type = "button",
}: BaseProps & { icon?: React.ReactNode }) {
  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`group inline-flex size-12 cursor-pointer items-center justify-center rounded-full bg-[#550022] text-white transition-colors duration-300 ease-in-out hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#550022] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {icon ?? (
        <ArrowUpRight
          size={20}
          className="transition-transform duration-300 group-hover:rotate-45"
        />
      )}
    </button>
  );
}
