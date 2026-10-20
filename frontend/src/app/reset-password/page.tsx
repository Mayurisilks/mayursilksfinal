"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

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

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleResetPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    const email = window.sessionStorage.getItem("passwordResetEmail");
    const resetToken = window.sessionStorage.getItem("passwordResetToken");
    if (!email || !resetToken) {
      setError("Your reset session has expired. Request a new verification code.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, resetToken, newPassword: password }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        message?: string;
      };
      if (!response.ok) {
        throw new Error(result.message ?? "Unable to reset password");
      }

      window.sessionStorage.removeItem("passwordResetEmail");
      window.sessionStorage.removeItem("passwordResetToken");
      router.push("/reset-password-success");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to reset password",
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
            Reset Password
          </CardTitle>

          <CardDescription className="text-sm leading-6 text-stone-500">
            Create a new password for your account. Use at least 8 characters.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-7 pt-6 sm:px-8">
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-stone-800"
              >
                New Password
              </Label>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  className="h-12 border-stone-300 bg-white pr-12 text-sm text-stone-900 placeholder:text-stone-400 focus-visible:border-amber-700 focus-visible:ring-2 focus-visible:ring-amber-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-3 flex items-center text-stone-500 hover:text-stone-900"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-stone-800"
              >
                Confirm New Password
              </Label>

              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Re-enter new password"
                  autoComplete="new-password"
                  required
                  className="h-12 border-stone-300 bg-white pr-12 text-sm text-stone-900 placeholder:text-stone-400 focus-visible:border-amber-700 focus-visible:ring-2 focus-visible:ring-amber-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((previous) => !previous)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  className="absolute inset-y-0 right-3 flex items-center text-stone-500 hover:text-stone-900"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="text-sm leading-5 text-red-600">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full bg-stone-900 text-sm font-medium text-white hover:bg-amber-900"
            >
              {isSubmitting ? "Saving..." : "Save New Password"}
            </Button>
          </form>

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
