"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { InputOTP, REGEXP_ONLY_DIGITS } from "@heroui/react";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { API_BASE_URL } from "@/lib/utils";

export default function ResetPasswordOtpPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedEmail = window.sessionStorage.getItem("passwordResetEmail");

    if (!savedEmail) {
      router.replace("/forgot-password");
      return;
    }

    setEmail(savedEmail);
  }, [router]);

  useEffect(() => {
    if (canResend) return;

    const timer = window.setInterval(() => {
      setSeconds((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer);
          setCanResend(true);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [canResend]);

  async function handleVerifyOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    setError("");
    setNotice("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const result = (await response.json().catch(() => ({}))) as {
        message?: string;
        resetToken?: string;
      };

      if (!response.ok || !result.resetToken) {
        throw new Error(result.message ?? "Unable to verify OTP");
      }

      window.sessionStorage.setItem("passwordResetToken", result.resetToken);

      router.push("/reset-password");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to verify OTP"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResendOtp() {
    if (!canResend || !email) return;

    setError("");
    setNotice("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = (await response.json().catch(() => ({}))) as {
        message?: string;
      };

      if (!response.ok) {
        throw new Error(result.message ?? "Unable to resend OTP");
      }

      setOtp("");
      setNotice(
        result.message ?? "If the account exists, a reset OTP has been sent."
      );
      setSeconds(60);
      setCanResend(false);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to resend OTP"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-8">
        <Card className="w-full max-w-md gap-0 border-stone-200 bg-white py-8 shadow-sm">
          <CardHeader className="space-y-3 px-7 text-center sm:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-800">
              MAYURI SILKS
            </p>

            <CardTitle className="text-3xl font-semibold tracking-tight text-stone-900">
              Verify Your Email
            </CardTitle>

            <CardDescription className="text-sm leading-6 text-stone-500">
              Enter the 6-digit verification code sent to{" "}
              {email || "your email"}.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 px-7 pt-6 sm:px-8">
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="space-y-3">
                <p className="text-sm font-medium text-stone-800">
                  Verification Code
                </p>

                <InputOTP
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS}
                  value={otp}
                  onChange={(value) => {
                    setOtp(value);
                    setError("");
                  }}
                  autoFocus
                  className="flex justify-center"
                >
                  <InputOTP.Group className="flex gap-2">
                    {Array.from({ length: 6 }, (_, index) => (
                      <InputOTP.Slot
                        key={index}
                        index={index}
                        className="h-12 w-10 rounded-lg border border-stone-300 bg-white text-lg font-semibold text-stone-900 sm:w-12"
                      />
                    ))}
                  </InputOTP.Group>
                </InputOTP>

                {error && (
                  <p role="alert" className="text-sm text-red-600">
                    {error}
                  </p>
                )}

                {notice && (
                  <p role="status" className="text-sm text-green-800">
                    {notice}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={otp.length !== 6 || isSubmitting || !email}
                className="h-12 w-full bg-stone-900 text-sm font-medium text-white hover:bg-amber-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Verifying..." : "Verify OTP"}
              </Button>
            </form>

            <div className="text-center">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isSubmitting}
                  className="cursor-pointer text-sm font-semibold text-amber-800 hover:underline disabled:opacity-50"
                >
                  Resend OTP
                </button>
              ) : (
                <p className="text-sm text-stone-500">
                  Resend OTP in{" "}
                  <span className="font-semibold text-stone-800">
                    {seconds}s
                  </span>
                </p>
              )}
            </div>

            <p className="text-center text-sm text-stone-600">
              <Link
                href="/forgot-password"
                className="cursor-pointer font-semibold text-amber-800 hover:underline"
              >
                Back to Forgot Password
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
