"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { InputOTP, REGEXP_ONLY_DIGITS } from "@heroui/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterVerifyEmailPage() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (canResend) return;

    const timer = setInterval(() => {
      setSeconds((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [canResend]);

  function handleVerifyEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    setError(
      "Email verification is not connected yet. Backend integration is required."
    );
  }

  function handleResendOtp() {
    if (!canResend) return;

    setOtp("");
    setError("");
    setSeconds(30);
    setCanResend(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-8">
      <Card className="w-full max-w-md gap-0 border border-stone-200 bg-white py-8 shadow-sm">
        <CardHeader className="space-y-3 px-7 text-center sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-800">
            MAYURI SILKS
          </p>

          <CardTitle className="text-3xl font-semibold tracking-tight text-stone-900">
            Verify Your Email
          </CardTitle>

          <CardDescription className="text-sm leading-6 text-stone-600">
            Enter the 6-digit verification code to complete your registration.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 px-7 pt-6 sm:px-8">
          <form onSubmit={handleVerifyEmail} className="space-y-5">
            <div className="space-y-3">
              <p className="text-sm font-medium text-stone-800">
                Email Verification Code
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
            </div>

            <Button
              type="submit"
              disabled={otp.length !== 6}
              className="h-12 w-full bg-stone-900 text-sm font-medium text-white hover:bg-amber-900 disabled:opacity-50"
            >
              Verify Email
            </Button>
          </form>

          <div className="text-center">
            {canResend ? (
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-sm font-semibold text-amber-800 hover:underline"
              >
                Resend OTP
              </button>
            ) : (
              <p className="text-sm text-stone-600">
                Resend OTP in{" "}
                <span className="font-semibold text-stone-900">{seconds}s</span>
              </p>
            )}
          </div>

          <p className="text-center text-sm text-stone-600">
            <Link
              href="/register"
              className="font-semibold text-amber-800 hover:underline"
            >
              Back to Create Account
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
