"use client";

import AdminNavbar from "../../components/AdminNavbar";
import { useState } from "react";
import ServiceEditForm from "./ServiceEditForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const services = [
  {
    id: 1,
    name: "Makeup",
    priceOptions: [60, 100, 150],
    duration: 60,
    image: "/makeup.jpg",
  },
  {
    id: 2,
    name: "Nails",
    priceOptions: [40, 60, 80],
    duration: 60,
    image: "/nails.jpg",
  },
];

export default function AdminServicesPage() {
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

  const [editId, setEditId] = useState<number | null>(null);

  const handleEdit = (service: (typeof services)[0]) => {
    setEditId(service.id);
  };

  const handleCancel = () => {
    setEditId(null);
  };

  const handleSave = (price: number, duration: number) => {
    // Save logic here (mock for now)
    setEditId(null);
  };

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-white px-2 sm:px-4 py-10 flex flex-col items-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
          Manage Services
        </h1>
        <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8 items-center md:items-stretch">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white shadow-lg flex flex-col items-center rounded-none overflow-hidden border border-gray-200 flex-1 min-h-64 min-w-[95vw] sm:min-w-[400px] md:min-w-[420px] max-w-[99vw] sm:max-w-[500px] md:max-w-none mx-auto md:mx-0"
            >
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-56 sm:h-64 object-cover"
              />
              <div className="flex flex-col flex-1 p-8 sm:p-10 w-full">
                <div className="flex items-center justify-between w-full mb-2">
                  <h2 className="text-2xl sm:text-3xl font-medium text-gray-900">
                    {service.name}
                  </h2>
                  <button
                    className="px-8 py-3 bg-white border border-black text-black rounded-none shadow hover:bg-black hover:text-white transition font-medium cursor-pointer ml-4 w-auto text-lg"
                    onClick={() => handleEdit(service)}
                  >
                    Edit
                  </button>
                </div>
                {editId === service.id && (
                  <ServiceEditForm
                    priceOptions={service.priceOptions}
                    initialDuration={service.duration}
                    initialPrice={service.priceOptions[0]}
                    onCancel={handleCancel}
                    onSave={handleSave}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
