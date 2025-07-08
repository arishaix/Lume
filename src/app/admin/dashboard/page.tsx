"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { FaCalendarAlt, FaClock, FaDollarSign } from "react-icons/fa";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState<{
    totalBookings: number;
    upcomingBookings: number;
    totalRevenue: number;
    recentBookings: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as any).role !== "admin") {
      router.replace("/");
      return;
    }
    // Fetch stats from API
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/dashboard");
        if (!res.ok) {
          throw new Error("Failed to fetch dashboard stats");
        }
        const data = await res.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [session, status, router]);

  if (
    status === "loading" ||
    loading ||
    !session ||
    (session.user as any).role !== "admin"
  ) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // Prepare stat cards
  const statCards = [
    {
      label: "Total Bookings",
      value: stats?.totalBookings ?? 0,
      icon: <FaCalendarAlt className="text-black" size={24} />,
    },
    {
      label: "Upcoming",
      value: stats?.upcomingBookings ?? 0,
      icon: <FaClock className="text-black" size={24} />,
    },
    {
      label: "Revenue",
      value: `$${stats?.totalRevenue?.toLocaleString() ?? 0}`,
      icon: <FaDollarSign className="text-black" size={24} />,
    },
  ];

  // Only show the last 3 bookings
  const recent = (stats?.recentBookings ?? []).slice(0, 3);

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-white px-2 sm:px-4 py-10 flex flex-col items-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
          Dashboard
        </h1>
        {/* Stat Cards */}
        <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="bg-white border border-gray-200 shadow rounded-xl p-6 flex flex-col items-center gap-2"
            >
              <div>{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <div className="text-gray-600 text-base">{stat.label}</div>
            </div>
          ))}
        </div>
        {/* Recent Activity */}
        <div className="w-full max-w-4xl bg-white border border-gray-200 shadow rounded-xl p-6 mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="flex flex-col gap-4">
            {recent.length === 0 ? (
              <div className="text-gray-600">No recent bookings found.</div>
            ) : (
              recent.map((item, idx) => (
                <div
                  key={item._id || idx}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6"
                >
                  <span className="font-medium text-gray-900">
                    {item.service?.name || "Unknown Service"}
                  </span>
                  <span className="text-gray-700 text-sm">
                    {new Date(item.date).toLocaleDateString()}, {item.time}
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      item.paymentStatus === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : item.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.paymentStatus.charAt(0).toUpperCase() +
                      item.paymentStatus.slice(1)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
