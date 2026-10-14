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

export default function EmailOtpForm() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  function handleSendOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Demo only: the backend must send the real email OTP.
    setOtp("");
    setOtpSent(true);
  }

  function handleVerifyOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (otp.length !== 6) return;

    // Real OTP verification will be connected to the backend later.
    alert("OTP verification is not connected yet.");
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
                className="h-12 w-full bg-stone-900 text-sm font-medium text-white hover:bg-amber-900"
              >
                Send OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <p className="text-sm text-stone-600">
                Demo: OTP sending is not connected yet. Email address:{" "}
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
                disabled={otp.length !== 6}
                className="h-12 w-full bg-stone-900 text-sm font-medium text-white hover:bg-amber-900"
              >
                Verify OTP &amp; Login
              </Button>

              <button
                type="button"
                onClick={() => {
                  setOtp("");
                  setOtpSent(false);
                }}
                className="w-full text-sm font-medium text-amber-800 hover:underline"
              >
                Change email address
              </button>
            </form>
          )}

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
