"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Dashboard", href: "/admin/dashboard" },
  { name: "Bookings", href: "/admin/bookings" },
  { name: "Services", href: "/admin/services" },
];

export default function AdminNavbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Lume Logo/Link */}
        <Link
          href="/"
          className="text-2xl font-serif font-bold tracking-widest text-gray-900 uppercase hover:text-black transition select-none"
        >
          Lumé
        </Link>
        {/* Nav Links */}
        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-base font-medium px-2 py-1 transition-colors duration-150 ${
                pathname === link.href
                  ? "text-black border-b-2 border-black"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
