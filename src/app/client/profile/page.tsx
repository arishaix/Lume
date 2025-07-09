"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/client/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-start justify-center pt-54">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    );
  }

  if (!session) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow text-center">
            <h2 className="text-xl font-semibold mb-4">Not logged in</h2>
            <p className="mb-4">Please log in to view your profile.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 overflow-hidden">
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center z-10">
          <h2 className="text-2xl font-bold mb-6 text-black">Your Profile</h2>
          <div className="mb-4">
            <span className="block text-gray-600 text-sm">Name</span>
            <span className="block text-lg font-medium text-gray-900">
              {session.user?.name}
            </span>
          </div>
          <div className="mb-6">
            <span className="block text-gray-600 text-sm">Email</span>
            <span className="block text-lg font-medium text-gray-900">
              {session.user?.email}
            </span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/client/login" })}
            className="w-full py-3 px-6 bg-black text-white rounded hover:bg-gray-800 transition font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
