"use client";

import { useState } from "react";
import Link from "next/link";
import { InputOTP, REGEXP_ONLY_DIGITS } from "@heroui/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { API_BASE_URL } from "@/lib/utils";

export default function EmailOtpForm() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function handleSendOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-login-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        message?: string;
      };

      if (!response.ok) {
        throw new Error(result.message ?? "Unable to send OTP");
      }

      setOtp("");
      setOtpSent(true);
      setNotice(result.message ?? "If the account exists, a login OTP has been sent.");
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "Unable to send OTP",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerifyOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (otp.length !== 6) return;

    setError("");
    setNotice("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-login-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        message?: string;
        token?: string;
      };

      if (!response.ok || !result.token) {
        throw new Error(result.message ?? "Unable to verify OTP");
      }

      window.sessionStorage.setItem("authToken", result.token);
      setNotice("Login successful.");
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "Unable to verify OTP",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-8">
      <Card className="w-full max-w-md gap-0 border-stone-200 bg-white py-8 shadow-sm">
        <CardHeader className="space-y-3 px-7 text-center sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-800">
            MAYURI SILKS
          </p>

          <CardTitle className="text-3xl font-semibold tracking-tight text-stone-900">
            {otpSent ? "Verify Your Email" : "Login with Email OTP"}
          </CardTitle>

          <CardDescription className="text-sm text-stone-500">
            {otpSent
              ? "Enter the verification code to continue"
              : "Sign in securely using your email address"}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-7 pt-6 sm:px-8">
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-stone-800"
                >
                  Enter your email address
                </Label>

                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="h-12 text-sm text-stone-900 placeholder:text-stone-400"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full bg-stone-900 text-sm font-medium text-white hover:bg-amber-900"
              >
                {isSubmitting ? "Sending..." : "Send OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <p className="text-sm text-stone-600">
                If the account exists, a code was sent to {" "}
                <span className="font-medium text-stone-900">{email}</span>
              </p>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-stone-800">
                  Enter 6-digit OTP
                </Label>

                <InputOTP
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS}
                  value={otp}
                  onChange={setOtp}
                  autoFocus
                  className="flex justify-center"
                >
                  <InputOTP.Group className="flex gap-2">
                    {Array.from({ length: 6 }, (_, index) => (
                      <InputOTP.Slot
                        key={index}
                        index={index}
                        className="h-12 w-10 border border-stone-300 rounded-lg bg-white text-center text-lg font-semibold text-stone-900 sm:w-12"
                      />
                    ))}
                  </InputOTP.Group>
                </InputOTP>
              </div>

              <Button
                type="submit"
                disabled={otp.length !== 6 || isSubmitting}
                className="h-12 w-full bg-stone-900 text-sm font-medium text-white hover:bg-amber-900"
              >
                {isSubmitting ? "Verifying..." : "Verify OTP & Login"}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setOtp("");
                  setOtpSent(false);
                  setError("");
                  setNotice("");
                }}
                disabled={isSubmitting}
                className="w-full text-sm font-medium text-amber-800 hover:underline"
              >
                Change email address
              </button>
            </form>
          )}

          {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
          {notice && <p role="status" className="mt-4 text-sm text-green-800">{notice}</p>}

          <p className="mt-6 text-center text-sm text-stone-600">
            Back to{" "}
            <Link
              href="/"
              className="font-semibold text-amber-800 hover:underline"
            >
              Password Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
