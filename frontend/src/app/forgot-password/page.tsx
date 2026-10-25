"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const result = (await response.json().catch(() => ({}))) as {
        message?: string;
      };

      if (!response.ok) {
        throw new Error(result.message ?? "Unable to request password reset.");
      }

      // Save the email for the existing OTP verification page.
      window.sessionStorage.setItem("passwordResetEmail", normalizedEmail);

      window.sessionStorage.removeItem("passwordResetToken");

      // Go directly to the existing reset OTP page.
      router.push("/reset-password-otp");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to request password reset. Please try again."
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
              Forgot Password?
            </CardTitle>

            <CardDescription className="text-sm leading-6 text-stone-500">
              Enter your registered email address to receive a password reset
              verification code.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-7 pt-6 sm:px-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-stone-800"
                >
                  Email Address
                </Label>

                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="h-12 border-stone-300 bg-white text-sm text-stone-900 placeholder:text-stone-400 focus-visible:border-amber-700 focus-visible:ring-2 focus-visible:ring-amber-100"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full bg-stone-900 text-sm font-medium text-white hover:bg-amber-900"
              >
                {isSubmitting ? "Sending..." : "Send Reset Code"}
              </Button>
            </form>

            {error && (
              <p role="alert" className="mt-4 text-sm text-red-700">
                {error}
              </p>
            )}

            <p className="mt-6 text-center text-sm text-stone-600">
              Remember your password?{" "}
              <Link
                href="/login"
                className="cursor-pointer font-semibold text-amber-800 hover:underline"
              >
                Back to Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
