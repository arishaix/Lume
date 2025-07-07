"use client";

import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
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
    return <div>Loading...</div>;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res?.ok) {
      router.push("/client/bookings");
    } else {
      setError("Invalid email or password");
    }
    setLoading(false);
  }

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen flex flex-col justify-center items-center bg-white pt-7
       overflow-hidden"
      >
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-12 flex flex-col gap-8 items-center">
          <h1 className="text-3xl font-medium text-gray-900 mb-4 text-center">
            Login
          </h1>
          <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-gray-700 font-medium text-lg">Email</label>
              <input
                type="email"
                className="border border-gray-300 rounded px-6 py-4 w-full text-black text-lg"
                placeholder="you@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-gray-700 font-medium text-lg">
                Password
              </label>
              <input
                type="password"
                className="border border-gray-300 rounded px-6 py-4 w-full text-black text-lg"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <div className="text-red-500 text-base">{error}</div>}
            <button
              type="submit"
              className="w-full px-8 py-4 border border-black text-black bg-white rounded hover:bg-black hover:text-white transition text-lg mt-2"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <div className="w-full text-center mt-4">
            <span className="text-gray-600 text-base">
              Don't have an account?{" "}
            </span>
            <Link
              href="/client/signup"
              className="text-black underline text-base hover:text-gray-800"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
