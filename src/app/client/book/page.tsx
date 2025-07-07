"use client";
import Navbar from "../../components/Navbar";
import DateTimeStep from "./DateTimeStep";
import UserInfoStep from "./UserInfoStep";
import ConfirmStep from "./ConfirmStep";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const BOOKING_STORAGE_KEY = "bookingFlowState";

export default function BookPage() {
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [dateTime, setDateTime] = useState<{
    date: string;
    time: string;
    price: number;
  } | null>(null);
  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [loadingServices, setLoadingServices] = useState(true);
  const [step, setStep] = useState<
    "service" | "datetime" | "userinfo" | "confirm"
  >("service");
  const router = useRouter();

  // Restore state from localStorage on mount
  useEffect(() => {
    const saved =
      typeof window !== "undefined"
        ? localStorage.getItem(BOOKING_STORAGE_KEY)
        : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.step) setStep(parsed.step);
        if (parsed.selectedService) setSelectedService(parsed.selectedService);
        if (parsed.dateTime) setDateTime(parsed.dateTime);
        if (parsed.userInfo) setUserInfo(parsed.userInfo);
      } catch {}
    }
  }, []);

  // Save state to localStorage on any change
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      BOOKING_STORAGE_KEY,
      JSON.stringify({ step, selectedService, dateTime, userInfo })
    );
  }, [step, selectedService, dateTime, userInfo]);

  // Clear localStorage on reset to service step (after booking or manual reset)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (step === "service" && !selectedService && !dateTime && !userInfo) {
      localStorage.removeItem(BOOKING_STORAGE_KEY);
    }
  }, [step, selectedService, dateTime, userInfo]);

  useEffect(() => {
    setLoadingServices(true);
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => setServices(data.services || []))
      .finally(() => setLoadingServices(false));
  }, []);

  // Handler to reset booking state after successful booking
  const handleBookingComplete = () => {
    setStep("service");
    setSelectedService(null);
    setDateTime(null);
    setUserInfo(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(BOOKING_STORAGE_KEY);
    }
    // Replace the current route so browser back/forward doesn't return to confirmation
    router.replace("/client/book");
  };

  // Step 1: Select Service
  if (step === "service") {
    return (
      <>
        <Navbar />
        <section className="w-full flex flex-col items-center mt-10 px-2 sm:px-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Book Your Appointment
          </h1>
          {loadingServices ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-stretch">
              {services.map((service) => (
                <div
                  key={service._id}
                  className="bg-white shadow-lg flex flex-col items-center rounded-none overflow-hidden border border-gray-200 flex-1 min-w-[90vw] sm:min-w-[340px] md:min-w-[320px] max-w-[95vw] sm:max-w-[400px] md:max-w-none mx-auto md:mx-0"
                >
                  <img
                    src={`/${service.name.toLowerCase()}.jpg`}
                    alt={service.name}
                    className="w-full h-40 sm:h-48 object-cover"
                  />
                  <div className="flex flex-col flex-1 p-4 sm:p-6 items-start w-full">
                    <h2 className="text-lg sm:text-2xl font-medium text-gray-900 mb-2">
                      {service.name}
                    </h2>
                    <p className="text-gray-500 mb-1">
                      From $
                      {Array.isArray(service.prices) &&
                      service.prices.length > 0
                        ? Math.min(...service.prices.map((p: any) => p.price))
                        : service.price || 0}
                    </p>
                    <p className="text-gray-500 mb-4">
                      Duration: {service.duration} min
                    </p>
                    <button
                      className="px-6 py-2 bg-white border border-black text-black rounded-none shadow hover:bg-black hover:text-white transition font-medium cursor-pointer w-full sm:w-auto"
                      onClick={() => {
                        setSelectedService(service);
                        setStep("datetime");
                      }}
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </>
    );
  }

  // Step 2: Pick Date + Time
  if (step === "datetime" && selectedService) {
    return (
      <>
        <Navbar />
        <section className="w-full flex flex-col items-center mt-10 px-2 sm:px-4">
          <div className="w-full max-w-md sm:max-w-sm md:max-w-md mx-auto">
            <DateTimeStep
              service={selectedService}
              onBack={() => setStep("service")}
              onDateTimeSelected={(date, time, price) => {
                setDateTime({ date, time, price });
                setStep("userinfo");
              }}
              initialDate={dateTime ? dateTime.date : ""}
              initialTime={dateTime ? dateTime.time : ""}
              initialPrice={dateTime ? dateTime.price : null}
            />
          </div>
        </section>
      </>
    );
  }

  // Step 3: User Info
  if (step === "userinfo" && selectedService && dateTime) {
    return (
      <>
        <Navbar />
        <section className="w-full flex flex-col items-center mt-10 px-2 sm:px-4">
          <div className="w-full max-w-md sm:max-w-sm md:max-w-md mx-auto">
            <UserInfoStep
              onBack={() => setStep("datetime")}
              onInfoEntered={(name, email) => {
                setUserInfo({ name, email });
                setStep("confirm");
              }}
              initialName={userInfo ? userInfo.name : ""}
              initialEmail={userInfo ? userInfo.email : ""}
            />
          </div>
        </section>
      </>
    );
  }

  // Step 4: Confirm Appointment
  if (step === "confirm" && selectedService && dateTime && userInfo) {
    return (
      <>
        <Navbar />
        <section className="w-full flex flex-col items-center mt-10 px-2 sm:px-4">
          <div className="w-full max-w-md sm:max-w-sm md:max-w-md mx-auto">
            <ConfirmStep
              service={selectedService._id}
              serviceName={selectedService.name}
              date={dateTime.date}
              time={dateTime.time}
              price={dateTime.price}
              name={userInfo.name}
              email={userInfo.email}
              onBack={() => setStep("userinfo")}
              onBookingComplete={handleBookingComplete}
            />
          </div>
        </section>
      </>
    );
  }

  // Fallback (should not happen)
  return null;
}
