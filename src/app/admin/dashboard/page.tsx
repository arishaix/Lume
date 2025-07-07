"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { FaCalendarAlt, FaClock, FaDollarSign } from "react-icons/fa";
import Link from "next/link";

const stats = [
  {
    label: "Total Bookings",
    value: 128,
    icon: <FaCalendarAlt className="text-black" size={24} />,
  },
  {
    label: "Upcoming",
    value: 7,
    icon: <FaClock className="text-black" size={24} />,
  },
  {
    label: "Revenue",
    value: "$3,200",
    icon: <FaDollarSign className="text-black" size={24} />,
  },
];

const recent = [
  {
    id: 1,
    service: "Makeup",
    date: "June 12, 2024",
    time: "2:30 PM",
    status: "Upcoming",
  },
  {
    id: 2,
    service: "Nails",
    date: "June 1, 2024",
    time: "11:30 AM",
    status: "Completed",
  },
  {
    id: 3,
    service: "Makeup",
    date: "May 20, 2024",
    time: "4:00 PM",
    status: "Cancelled",
  },
];

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as any).role !== "admin") {
      router.replace("/");
    }
  }, [session, status, router]);

  if (
    status === "loading" ||
    !session ||
    (session.user as any).role !== "admin"
  ) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-white px-2 sm:px-4 py-10 flex flex-col items-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
          Dashboard
        </h1>
        {/* Stat Cards */}
        <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {stats.map((stat) => (
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
            {recent.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6"
              >
                <span className="font-medium text-gray-900">
                  {item.service}
                </span>
                <span className="text-gray-700 text-sm">
                  {item.date}, {item.time}
                </span>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    item.status === "Upcoming"
                      ? "bg-green-100 text-green-700"
                      : item.status === "Completed"
                      ? "bg-gray-100 text-gray-500"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
