"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ArrowRight, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/context/ToastContext";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("from") || "/admin";
  const { success, error: toastError } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please provide both username and password.");
      toastError("Username and password are required.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      if (data.token) {
        try {
          localStorage.setItem("dkdc_token", data.token);
        } catch {}
      }

      success("Signed in successfully. Entering dashboard...", "Authentication Verified");
      // Seamlessly navigate directly to the destination with fresh cookies
      if (typeof window !== "undefined") {
        sessionStorage.setItem("dkdc_admin_loaded", "true");
        window.location.href = redirectTo;
      } else {
        router.push(redirectTo);
      }
    } catch (err: any) {
      const msg = err.message || "Invalid credentials.";
      setError(msg);
      toastError(msg, "Login Failed");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-neutral-950 border border-neutral-800 p-6 sm:p-10 shadow-2xl">
      
      <div className="text-center mb-8">
        <div className="relative w-48 h-14 mx-auto mb-4">
          <Image
            src="/images/logo/logo.png"
            alt="DK Dance Company Official Logo"
            fill
            priority
            className="object-contain object-center"
            sizes="192px"
          />
        </div>
        <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block">
          Administrative Access
        </span>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-center gap-3 p-3.5 mb-6 bg-dk-red/10 border border-dk-red/30 text-white text-xs"
        >
          <AlertCircle className="w-4 h-4 text-dk-red shrink-0" />
          <span>{error}</span>
        </div>
      )}

      
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label
            htmlFor="username"
            className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2"
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-black border border-neutral-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-dk-yellow transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2"
          >
            Password
          </label>
          <div className="relative flex items-center">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-neutral-800 pl-4 pr-11 py-3 text-sm text-white focus:outline-none focus:border-dk-yellow transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 p-1.5 text-neutral-500 hover:text-white transition-colors cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-neutral-400 hover:text-white" />
              ) : (
                <Eye className="w-4 h-4 text-neutral-400 hover:text-white" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-white text-black hover:bg-dk-yellow font-heading font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 mt-4"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In to Admin</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-neutral-900 text-center">
        <Link
          href="/"
          className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 hover:text-white transition-colors"
        >
          ← Return To Public Site
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 sm:p-6">
      <Suspense
        fallback={
          <div className="text-xs font-mono uppercase tracking-widest text-neutral-500">
            Loading...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
