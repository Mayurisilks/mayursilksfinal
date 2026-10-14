"use client";

import { useState } from "react";
import Link from "next/link";
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

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    alert(`Login form submitted for: ${email}`);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-8">
      <Card className="w-full max-w-md gap-0 border-stone-200 bg-white py-8 shadow-sm">
        <CardHeader className="space-y-3 px-7 text-center sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-800">
            MAYURI SILKS
          </p>

          <CardTitle className="text-3xl font-semibold tracking-tight text-stone-900">
            Welcome Back
          </CardTitle>

          <CardDescription className="text-sm text-stone-500">
            Sign in to your account
          </CardDescription>
        </CardHeader>

        <CardContent className="px-7 pt-6 sm:px-8">
          <form onSubmit={handleLogin} className="space-y-5">
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

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-stone-800"
              >
                Password
              </Label>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="h-12 border-stone-300 bg-white pr-12 text-sm text-stone-900 placeholder:text-stone-400 focus-visible:border-amber-700 focus-visible:ring-2 focus-visible:ring-amber-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-md p-1 text-stone-500 hover:text-stone-900"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-amber-800 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="h-12 w-full bg-stone-900 text-sm font-medium text-white hover:bg-amber-900"
            >
              Sign In
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-stone-200" />
            <span className="text-xs font-medium text-stone-400">OR</span>
            <div className="h-px flex-1 bg-stone-200" />
          </div>

          <Link
            href="/login-with-otp"
            className="flex h-12 w-full items-center justify-center rounded-md border border-stone-300 bg-white px-4 text-sm font-medium text-stone-800 transition-colors hover:bg-stone-50"
          >
            Login with Email OTP
          </Link>

          <p className="mt-6 text-center text-sm text-stone-600">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-amber-800 hover:underline"
            >
              Create Account
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
