"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ResetPasswordSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-8">
      <Card className="w-full max-w-md gap-0 border-stone-200 bg-white py-8 shadow-sm">
        <CardHeader className="items-center space-y-5 px-7 text-center sm:px-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2
              size={44}
              strokeWidth={1.8}
              className="text-green-700"
              aria-hidden="true"
            />
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-800">
            MAYURI SILKS
          </p>

          <CardTitle className="text-3xl font-semibold tracking-tight text-stone-900">
            Password Reset Successful!
          </CardTitle>

          <CardDescription className="text-sm leading-6 text-stone-500">
            Your password has been changed successfully. You can now sign in
            with your new password.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 px-7 pt-6 sm:px-8">
          <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
            <ShieldCheck
              size={21}
              className="mt-0.5 shrink-0 text-green-700"
              aria-hidden="true"
            />

            <p className="text-sm leading-6 text-green-900">
              Your account is ready. Use your new password the next time you
              sign in.
            </p>
          </div>

          <Button
            asChild
            className="h-12 w-full bg-stone-900 text-sm font-medium text-white hover:bg-amber-900"
          >
            <Link href="/">
              Back to Login
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </Button>

          <p className="text-center text-xs leading-5 text-stone-500">
            For your security, never share your password with anyone.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
