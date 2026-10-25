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

export default function RegisterVerifyEmailPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [seconds, setSeconds] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedEmail = window.sessionStorage.getItem("registrationEmail");

    if (savedEmail) {
      setEmail(savedEmail);
    } else {
      setError(
        "Registration email not found. Please return to Create Account and register again."
      );
    }
  }, []);

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

  async function handleVerifyEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!email) {
      setError("Registration email not found. Please register again.");
      return;
    }

    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/otpverification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const result = (await response.json().catch(() => ({}))) as {
        message?: string;
      };

      if (!response.ok) {
        throw new Error(result.message ?? "Unable to verify email.");
      }

      window.sessionStorage.removeItem("registrationEmail");

      // Go to the registration success page only after API success.
      router.replace("/register/success");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to verify email. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResendOtp() {
    if (!canResend || isSubmitting) return;

    setError("");
    setNotice("");

    if (!email) {
      setError("Registration email not found. Please register again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/resendotp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = (await response.json().catch(() => ({}))) as {
        message?: string;
      };

      if (!response.ok) {
        throw new Error(result.message ?? "Unable to resend OTP.");
      }

      setOtp("");
      setSeconds(30);
      setCanResend(false);
      setNotice(result.message ?? "OTP sent successfully.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to resend OTP. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />

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
            {email && (
              <p className="text-center text-sm text-stone-600">
                Verification email:{" "}
                <span className="font-medium text-stone-900">{email}</span>
              </p>
            )}

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
                    setNotice("");
                  }}
                  autoFocus
                  className="flex justify-center"
                >
                  <InputOTP.Group className="flex gap-2">
                    {Array.from({ length: 6 }, (_, index) => (
                      <InputOTP.Slot
                        key={index}
                        index={index}
                        className="flex h-12 w-10 items-center justify-center rounded-lg border border-stone-300 bg-white text-center text-lg font-semibold text-stone-900 transition-colors focus-within:border-[#550022] focus-within:ring-2 focus-within:ring-[#550022]/20 sm:w-12 [&>*]:flex [&>*]:h-full [&>*]:w-full [&>*]:items-center [&>*]:justify-center [&>*]:text-center"
                      />
                    ))}
                  </InputOTP.Group>
                </InputOTP>
              </div>

              {error && (
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>
              )}

              {notice && (
                <p role="status" className="text-sm text-green-700">
                  {notice}
                </p>
              )}

              <Button
                type="submit"
                disabled={otp.length !== 6 || isSubmitting || !email}
                className="h-12 w-full bg-stone-900 text-sm font-medium text-white hover:bg-amber-900 disabled:opacity-50"
              >
                {isSubmitting ? "Verifying..." : "Verify Email"}
              </Button>
            </form>

            <div className="text-center">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isSubmitting || !email}
                  className="cursor-pointer text-sm font-semibold text-amber-800 hover:underline disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Resend OTP"}
                </button>
              ) : (
                <p className="text-sm text-stone-600">
                  Resend OTP in{" "}
                  <span className="font-semibold text-stone-900">
                    {seconds}s
                  </span>
                </p>
              )}
            </div>

            <p className="text-center text-sm text-stone-600">
              <Link
                href="/register"
                className="cursor-pointer font-semibold text-amber-800 hover:underline"
              >
                Back to Create Account
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
