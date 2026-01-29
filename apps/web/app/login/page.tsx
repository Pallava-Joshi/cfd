"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-hot-toast";
import { Navbar } from "../components/Navbar";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginMutation } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await loginMutation.mutateAsync({ email, password });
      router.push("/");
    } catch {
      // Error surfaced via toast from mutation
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center px-4 pt-24 min-h-screen">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-cal-sand text-4xl md:text-5xl font-medium text-black leading-tight mb-4 tracking-tighter">
              Welcome{" "}
              <span className="italic font-instrument-serif tracking-normal">
                Back
              </span>
            </h1>
            <p className="text-sm md:text-md text-black mb-4 leading-relaxed font-ibm-plex-mono">
              Continue your trading journey with MarginX
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-black mb-2 font-dm-sans"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:border-gray-600 transition-colors font-dm-sans bg-white"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-black mb-2 font-dm-sans"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:border-gray-600 transition-colors font-dm-sans bg-white"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-black text-white px-6 py-2.5 rounded-2xl hover:bg-gray-800 transition-colors font-medium text-[15px] border border-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-black">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-[15px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-[15px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
