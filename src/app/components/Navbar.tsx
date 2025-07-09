"use client";

import Link from "next/link";
import { FaRegUser, FaRegCalendarPlus, FaRegListAlt } from "react-icons/fa";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const isAdmin = session && (session.user as any).role === "admin";
  return (
    <nav className="w-full border-b border-gray-200 bg-white/100 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between relative">
        {/* Left: Admin Dashboard Icon */}
        <div className="flex items-center">
          {isAdmin && (
            <Link href="/admin/dashboard">
              <button
                className="p-2 text-gray-700 hover:text-black focus:outline-none cursor-pointer"
                aria-label="Admin Dashboard"
              >
                {/* Blocks dashboard icon */}
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <rect
                    x="3"
                    y="3"
                    width="7"
                    height="7"
                    rx="2"
                    fill="currentColor"
                  />
                  <rect
                    x="14"
                    y="3"
                    width="7"
                    height="7"
                    rx="2"
                    fill="currentColor"
                  />
                  <rect
                    x="14"
                    y="14"
                    width="7"
                    height="7"
                    rx="2"
                    fill="currentColor"
                  />
                  <rect
                    x="3"
                    y="14"
                    width="7"
                    height="7"
                    rx="2"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </Link>
          )}
        </div>
        {/* Centered Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
          <Link href="/">
            <span className="text-3xl md:text-4xl font-serif tracking-widest font-bold text-gray-900 uppercase cursor-pointer">
              Lumé
            </span>
          </Link>
        </div>

        {/* Right Icons: Book Now, My Bookings, Login/Profile */}
        <div className="flex-1 flex items-center justify-end space-x-4 pr-2">
          <Link href="/client/book">
            <button
              className="p-2 text-gray-700 hover:text-black focus:outline-none cursor-pointer"
              aria-label="Book Now"
            >
              <FaRegCalendarPlus size={17} />
            </button>
          </Link>
          <Link href="/client/bookings">
            <button
              className="p-2 text-gray-700 hover:text-black focus:outline-none cursor-pointer"
              aria-label="My Bookings"
            >
              <FaRegListAlt size={17} />
            </button>
          </Link>
          <Link href={session ? "/client/profile" : "/client/login"}>
            <button
              className="p-2 text-gray-700 hover:text-black focus:outline-none cursor-pointer"
              aria-label={session ? "Profile" : "Login"}
            >
              <FaRegUser size={17} />
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
