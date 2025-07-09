"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Navbar from "@/app/components/Navbar";

export default function SignupPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (session) {
      router.replace("/client/bookings");
    }
  }, [session, status, router]);

  if (status === "loading" || session) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-start justify-center pt-54 overflow-hidden">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      }
      // Auto-login after signup
      const loginRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (loginRes?.ok) {
        router.push("/client/bookings"); // Redirect to bookings or dashboard
      } else {
        setError("Signup succeeded but login failed");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white overflow-hidden">
        <div
          className="fixed left-1/2 transform -translate-x-1/2 mt-9 top-auto w-full max-w-sm bg-white shadow-lg rounded-xl p-8 flex flex-col gap-6 items-center z-10"
          style={{ top: "auto" }}
        >
          <h1 className="text-2xl font-medium text-gray-900 mb-2 text-center">
            Sign Up
          </h1>
          <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <label className="text-gray-700 font-medium text-base">
                Full Name
              </label>
              <input
                type="text"
                className="border border-gray-300 rounded px-4 py-3 w-full text-black text-base"
                placeholder="Your name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-gray-700 font-medium text-base">
                Email
              </label>
              <input
                type="email"
                className="border border-gray-300 rounded px-4 py-3 w-full text-black text-base"
                placeholder="you@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-gray-700 font-medium text-base">
                Password
              </label>
              <input
                type="password"
                className="border border-gray-300 rounded px-4 py-3 w-full text-black text-base"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
              type="submit"
              className="w-full px-6 py-3 border border-black text-black bg-white rounded hover:bg-black hover:text-white transition text-base mt-2"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
          <div className="w-full text-center mt-2">
            <span className="text-gray-600 text-sm">
              Already have an account?{" "}
            </span>
            <Link
              href="/client/login"
              className="text-black underline text-sm hover:text-gray-800"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
