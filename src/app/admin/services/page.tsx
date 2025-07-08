"use client";

import AdminNavbar from "../../components/AdminNavbar";
import { useState, useEffect } from "react";
import ServiceEditForm from "./ServiceEditForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CustomToast } from "../../components/CustomToast";
import ConfirmationModal from "../../components/ConfirmationModal";

export default function AdminServicesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [pendingEdit, setPendingEdit] = useState<null | {
    serviceId: string;
    basicPrice: number;
    standardPrice: number;
    premiumPrice: number;
    duration: number;
  }>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as any).role !== "admin") {
      router.replace("/");
      return;
    }
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/services");
        if (!res.ok) throw new Error("Failed to fetch services");
        const data = await res.json();
        setServices(data.services);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [session, status, router]);

  if (
    status === "loading" ||
    loading ||
    !session ||
    (session.user as any).role !== "admin"
  ) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-2 sm:px-4 py-10">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const handleSave = (
    basicPrice: number,
    standardPrice: number,
    premiumPrice: number,
    duration: number,
    serviceId: string
  ) => {
    setPendingEdit({
      serviceId,
      basicPrice,
      standardPrice,
      premiumPrice,
      duration,
    });
    setShowModal(true);
  };

  const handleConfirmEdit = async () => {
    if (!pendingEdit) return;
    const { serviceId, basicPrice, standardPrice, premiumPrice, duration } =
      pendingEdit;
    setSavingId(serviceId);
    setSaveError(null);
    setSuccessId(null);
    setShowModal(false);
    try {
      const res = await fetch("/api/services", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          basicPrice,
          standardPrice,
          premiumPrice,
          duration,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update service");
      }
      const data = await res.json();
      setServices((prev) =>
        prev.map((s) => (s._id === serviceId ? data.service : s))
      );
      setSuccessId(serviceId);
    } catch (err: any) {
      setSaveError(err.message || "Unknown error");
    } finally {
      setSavingId(null);
      setTimeout(() => setSuccessId(null), 2000);
      setPendingEdit(null);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-white px-2 sm:px-4 py-10 flex flex-col items-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
          Manage Services
        </h1>
        <div className="w-full max-w-6xl flex flex-col md:flex-row gap-0 items-center md:justify-center md:items-stretch">
          {services.map((service) => (
            <div
              key={service._id}
              className="bg-white shadow-lg flex flex-col items-center rounded-none overflow-hidden border border-gray-200 min-h-32 min-w-[340px] sm:min-w-[420px] md:min-w-[520px] max-w-[600px] mx-auto"
            >
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-32 sm:h-40 md:h-48 object-cover"
              />
              <div className="flex flex-col flex-1 p-4 sm:p-6 w-full">
                <div className="flex items-center justify-between w-full mb-2">
                  <h2 className="text-2xl sm:text-3xl font-medium text-gray-900">
                    {service.name}
                  </h2>
                </div>
                <ServiceEditForm
                  basicPrice={service.basicPrice}
                  standardPrice={service.standardPrice}
                  premiumPrice={service.premiumPrice}
                  initialDuration={service.duration}
                  onCancel={() => {}}
                  onSave={(basic, standard, premium, duration) =>
                    handleSave(basic, standard, premium, duration, service._id)
                  }
                />
                <ConfirmationModal
                  open={showModal && pendingEdit?.serviceId === service._id}
                  onClose={() => setShowModal(false)}
                  booking={null}
                  onConfirm={handleConfirmEdit}
                  message="Are you sure you want to update this service?"
                  confirmText="Yes, Update"
                />
                {saveError && (
                  <div className="text-red-500 mt-2">{saveError}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Toast notification in top-right */}
      {successId && (
        <div className="fixed top-6 right-6 z-50">
          <CustomToast type="success" message="Service updated successfully!" />
        </div>
      )}
    </>
  );
}
