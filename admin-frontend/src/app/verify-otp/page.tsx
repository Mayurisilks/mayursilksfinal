"use client";

import { useRef, useState, type FormEvent } from "react";
import { Button } from "@heroui/react";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [message, setMessage] = useState("");
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setMessage("");

    if (digit && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  function handlePaste(event: React.ClipboardEvent<HTMLDivElement>) {
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    event.preventDefault();
    setOtp(Array.from({ length: 6 }, (_, i) => pasted[i] ?? ""));
    setMessage("");
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  }

  function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const code = otp.join("");

    if (!/^\d{6}$/.test(code)) {
      setMessage("Please enter all 6 digits of your OTP.");
      return;
    }

    setMessage(
      "UI ready. Backend integration is required to verify this OTP securely."
    );
  }

  function handleResend() {
    setMessage("OTP email delivery is not connected yet. No email was sent.");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F8F5F0] px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-[#D8B878]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-[#550022]/10 blur-3xl" />

      <section className="mayuri-animate-in relative w-full max-w-lg rounded-3xl border border-[#E8DED1] bg-white px-5 py-10 shadow-[0_24px_80px_rgba(65,32,35,0.12)] sm:px-10 sm:py-12">
        <header className="mb-9 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#D8B878] bg-[#550022] font-urbanist text-2xl text-[#E6CC92]">
            M
          </div>

          <p className="text-xs font-semibold tracking-[0.3em] text-[#550022]">
            MAYURI SILKS
          </p>

          <div className="mx-auto mb-5 mt-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F8F0E8] text-[#550022]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-7 w-7"
              aria-hidden="true"
            >
              <rect x="3" y="5" width="18" height="14" rx="3" />
              <path d="m4 7 8 6 8-6" />
            </svg>
          </div>

          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#9A7946]">
            Security verification
          </p>

          <h1 className="font-urbanist text-3xl text-[#550022] sm:text-4xl">
            Verify account
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#81736C]">
            We&apos;ve sent a code to{" "}
            <span className="font-medium text-[#550022]">
              your registered email
            </span>
          </p>
        </header>

        <form onSubmit={handleVerify} className="space-y-6">
          <div onPaste={handlePaste}>
            <label className="mb-4 block text-sm font-medium text-[#44332E]">
              Enter verification code
            </label>

            <div className="flex w-full items-center justify-center gap-1.5 sm:gap-3">
              {otp.map((digit, index) => (
                <div key={index} className="flex items-center gap-1.5 sm:gap-3">
                  {index === 3 && (
                    <span className="text-lg text-[#B7AAA2]">-</span>
                  )}

                  <input
                    ref={(element) => {
                      inputs.current[index] = element;
                    }}
                    aria-label={`OTP digit ${index + 1}`}
                    type="text"
                    inputMode="numeric"
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    maxLength={1}
                    value={digit}
                    onChange={(event) =>
                      handleChange(index, event.target.value)
                    }
                    onKeyDown={(event) => handleKeyDown(index, event)}
                    className="h-11 w-9 rounded-xl border border-[#E6DDD4] bg-[#FBF8F3] text-center text-lg font-semibold text-[#30231F] outline-none transition focus:border-[#550022] focus:ring-4 focus:ring-[#550022]/10 sm:h-14 sm:w-12"
                    required
                  />
                </div>
              ))}
            </div>

            <p className="mt-3 text-xs text-[#A09288]">
              Enter the 6-digit code from your email.
            </p>
          </div>

          {message && (
            <div
              role="status"
              aria-live="polite"
              className="rounded-xl border border-[#D8B878]/60 bg-[#FBF7EE] p-3 text-sm leading-6 text-[#550022]"
            >
              {message}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            fullWidth
            className="h-12 w-full rounded-xl bg-[#550022] font-semibold text-white transition hover:bg-[#70002D]"
          >
            Verify OTP →
          </Button>
        </form>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-1 text-sm text-[#81736C]">
          <span>Didn&apos;t receive a code?</span>
          <Button
            type="button"
            variant="tertiary"
            onPress={handleResend}
            className="h-auto min-w-0 rounded-md px-1 py-1 font-semibold text-[#550022] underline underline-offset-4 hover:bg-[#F8F5F0]"
          >
            Resend
          </Button>
        </div>

        <div className="mt-8 rounded-xl border border-[#EDE3D6] bg-[#FBF8F3] p-4">
          <p className="text-sm font-semibold text-[#550022]">
            Protected admin access
          </p>
          <p className="mt-1 text-xs leading-5 text-[#81736C]">
            Access is granted only after the server verifies the OTP and
            confirms your admin permissions.
          </p>
        </div>
      </section>
    </main>
  );
}
