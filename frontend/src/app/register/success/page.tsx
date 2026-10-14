import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-8">
      <Card className="w-full max-w-md gap-0 border border-stone-200 bg-white py-8 shadow-sm">
        <CardHeader className="items-center space-y-5 px-7 text-center sm:px-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2
              className="h-12 w-12 text-green-600"
              strokeWidth={1.7}
            />
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-800">
            MAYURI SILKS
          </p>

          <CardTitle className="text-3xl font-semibold tracking-tight text-stone-900">
            Registration Complete!
          </CardTitle>

          <CardDescription className="text-sm leading-6 text-stone-600">
            Thank you for joining Mayuri Silks. Your registration process is
            complete.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 px-7 pt-6 sm:px-8">
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-center">
            <p className="text-sm font-medium text-stone-800">
              Welcome to Mayuri Silks
            </p>

            <p className="mt-1 text-sm leading-6 text-stone-600">
              Sign in to continue to your account.
            </p>
          </div>

          <Link
            href="/login-with-otp"
            className="flex h-12 w-full items-center justify-center rounded-md bg-stone-900 px-4 text-sm font-medium text-white transition-colors hover:bg-amber-900"
          >
            Continue to Login
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>

          <p className="text-center text-xs leading-5 text-stone-500">
            Thank you for choosing Mayuri Silks.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
