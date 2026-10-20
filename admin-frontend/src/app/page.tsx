"use client";

import { useState, type FormEvent } from "react";
import { Button, Input } from "@heroui/react";

type LoginMethod = "password" | "otp";

export default function AdminLoginPage() {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!email.trim()) {
      setMessage("Please enter your admin email address.");
      return;
    }

    if (loginMethod === "password" && !password) {
      setMessage("Please enter your password.");
      return;
    }

    setMessage(
      loginMethod === "password"
        ? "Login interface ready. Connect the backend to verify your password and require email OTP verification."
        : "Email OTP interface ready. Connect the backend to send and verify your OTP."
    );
  }

  function changeLoginMethod(method: LoginMethod) {
    setLoginMethod(method);
    setMessage("");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F8F5F0] px-4 py-10 sm:px-6">
      <div className="mayuri-glow pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#D8B878]/20 blur-3xl" />
      <div className="mayuri-glow pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-[#550022]/10 blur-3xl" />

      <div className="mayuri-animate-in relative w-full max-w-lg overflow-hidden rounded-3xl border border-[#E8DED1] bg-white shadow-[0_24px_80px_rgba(65,32,35,0.12)]">
        <section className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#D8B878] bg-[#550022] font-urbanist text-3xl text-[#E6CC92] shadow-md shadow-[#550022]/10">
              M
            </div>

            <p className="text-xs font-semibold tracking-[0.3em] text-[#550022]">
              MAYURI SILKS
            </p>

            <p className="mt-2 text-[10px] tracking-[0.2em] text-[#9A7946]">
              ADMINISTRATION PORTAL
            </p>
          </div>

          <div className="mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#9A7946]">
              Welcome back
            </p>

            <h1 className="font-urbanist text-3xl text-[#550022] sm:text-4xl">
              Admin sign in
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#81736C]">
              Sign in securely to manage your Mayuri Silks store.
            </p>
          </div>

          <div className="mb-7 grid grid-cols-2 gap-1 rounded-xl bg-[#F7F3EE] p-1">
            <Button
              type="button"
              variant="primary"
              onPress={() => changeLoginMethod("password")}
              className={`h-11 w-full rounded-lg text-sm font-medium transition ${
                loginMethod === "password"
                  ? "bg-[#550022] text-white"
                  : "bg-transparent text-[#81736C]"
              }`}
            >
              Password Login
            </Button>

            <Button
              type="button"
              variant="primary"
              onPress={() => changeLoginMethod("otp")}
              className={`h-11 w-full rounded-lg text-sm font-medium transition ${
                loginMethod === "otp"
                  ? "bg-[#550022] text-white"
                  : "bg-transparent text-[#81736C]"
              }`}
            >
              Email OTP Login
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="admin-email"
                className="mb-2 block text-sm font-medium text-[#44332E]"
              >
                Admin email address
              </label>

              <Input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="username"
                placeholder="Enter your admin email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                fullWidth
                variant="secondary"
                className="h-12 w-full rounded-xl border border-[#E6DDD4] bg-white px-3 pr-16 text-sm text-[#30231F] placeholder:text-[#B7AAA2] focus-within:border-[#550022]"
              />
            </div>

            {loginMethod === "password" && (
              <div className="mayuri-animate-in">
                <label
                  htmlFor="admin-password"
                  className="mb-2 block text-sm font-medium text-[#44332E]"
                >
                  Password
                </label>

                <div className="relative">
                  <Input
                    id="admin-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    fullWidth
                    variant="secondary"
                    className="h-12 w-full rounded-xl border border-[#E6DDD4] bg-white px-3 pr-16 text-sm text-[#30231F] placeholder:text-[#B7AAA2] focus-within:border-[#550022]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-semibold text-[#8A6C63] transition hover:bg-[#F8F5F0] hover:text-[#550022] focus-visible:outline-2 focus-visible:outline-[#550022]"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <p className="mt-3 text-right text-xs text-[#81736C]">
                  Forgot password? Contact your authorized administrator.
                </p>
              </div>
            )}

            {message && (
              <div
                role="status"
                aria-live="polite"
                className="rounded-xl border border-[#D8B878]/60 bg-[#FBF7EE] p-3 text-sm leading-6 text-[#550022]"
              >
                {message}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              className="h-12 w-full rounded-xl bg-[#550022] font-semibold text-white shadow-lg shadow-[#550022]/15 transition duration-200 hover:bg-[#70002D] active:scale-[0.99]"
            >
              {loginMethod === "password"
                ? "Continue securely →"
                : "Send email OTP →"}
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
}
