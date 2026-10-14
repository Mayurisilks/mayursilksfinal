"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    router.push("/reset-password-otp");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-8">
      <Card className="w-full max-w-md gap-0 border-stone-200 bg-white py-8 shadow-sm">
        <CardHeader className="space-y-3 px-7 text-center sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-800">
            MAYURI SILKS
          </p>

          <CardTitle className="text-3xl font-semibold tracking-tight text-stone-900">
            {submitted ? "Check Your Email" : "Forgot Password?"}
          </CardTitle>

          <CardDescription className="text-sm leading-6 text-stone-500">
            {submitted
              ? "If an account exists for this email, you can continue with the password reset instructions."
              : "Enter your registered email address to start resetting your password."}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-7 pt-6 sm:px-8">
          {!submitted ? (
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
                className="h-12 w-full bg-stone-900 text-sm font-medium text-white hover:bg-amber-900"
              >
                Send Reset Instructions
              </Button>
            </form>
          ) : (
            <div className="space-y-5">
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm leading-6 text-stone-700">
                  Password reset email sending is not connected yet. Your
                  request is currently a frontend demo.
                </p>
              </div>

              <Button
                type="button"
                onClick={() => setSubmitted(false)}
                variant="outline"
                className="h-12 w-full border-stone-300 text-stone-800"
              >
                Try Another Email
              </Button>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-stone-600">
            Remember your password?{" "}
            <Link
              href="/"
              className="font-semibold text-amber-800 hover:underline"
            >
              Back to Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
