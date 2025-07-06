"use client";
import Navbar from "../../components/Navbar";
import DateTimeStep from "./DateTimeStep";
import UserInfoStep from "./UserInfoStep";
import ConfirmStep from "./ConfirmStep";
import { useState } from "react";

export default function BookPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [dateTime, setDateTime] = useState<{
    date: string;
    time: string;
    price: number;
  } | null>(null);
  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
  } | null>(null);

  // Step 1: Select Service
  if (!selectedService) {
    return (
      <>
        <Navbar />
        <section className="w-full flex flex-col items-center mt-10 px-2 sm:px-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Book Your Appointment
          </h1>
          <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-stretch">
            {/* Makeup Card */}
            <div className="bg-white shadow-lg flex flex-col items-center rounded-none overflow-hidden border border-gray-200 flex-1 min-w-[90vw] sm:min-w-[340px] md:min-w-[320px] max-w-[95vw] sm:max-w-[400px] md:max-w-none mx-auto md:mx-0">
              <img
                src="/makeup.jpg"
                alt="Makeup"
                className="w-full h-40 sm:h-48 object-cover"
              />
              <div className="flex flex-col flex-1 p-4 sm:p-6 items-start w-full">
                <h2 className="text-lg sm:text-2xl font-medium text-gray-900 mb-2">
                  Makeup
                </h2>
                <p className="text-gray-500 mb-1">From $60</p>
                <p className="text-gray-500 mb-4">Duration: 1 hour</p>
                <button
                  className="px-6 py-2 bg-white border border-black text-black rounded-none shadow hover:bg-black hover:text-white transition font-medium cursor-pointer w-full sm:w-auto"
                  onClick={() => setSelectedService("Makeup")}
                >
                  Select
                </button>
              </div>
            </div>
            {/* Nails Card */}
            <div className="bg-white shadow-lg flex flex-col items-center rounded-none overflow-hidden border border-gray-200 flex-1 min-w-[90vw] sm:min-w-[340px] md:min-w-[320px] max-w-[95vw] sm:max-w-[400px] md:max-w-none mx-auto md:mx-0">
              <img
                src="/nails.jpg"
                alt="Nails"
                className="w-full h-40 sm:h-48 object-cover"
              />
              <div className="flex flex-col flex-1 p-4 sm:p-6 items-start w-full">
                <h2 className="text-lg sm:text-2xl font-medium text-gray-900 mb-2">
                  Nails
                </h2>
                <p className="text-gray-500 mb-1">From $40</p>
                <p className="text-gray-500 mb-4">Duration: 1 hour</p>
                <button
                  className="px-6 py-2 bg-white border border-black text-black rounded-none shadow hover:bg-black hover:text-white transition font-medium cursor-pointer w-full sm:w-auto"
                  onClick={() => setSelectedService("Nails")}
                >
                  Select
                </button>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  // Step 2: Pick Date + Time
  if (!dateTime) {
    return (
      <>
        <Navbar />
        <section className="w-full flex flex-col items-center mt-10 px-2 sm:px-4">
          <div className="w-full max-w-md sm:max-w-sm md:max-w-md mx-auto">
            <DateTimeStep
              selectedService={selectedService}
              onBack={() => setSelectedService(null)}
              onDateTimeSelected={(date, time, price) =>
                setDateTime({ date, time, price })
              }
            />
          </div>
        </section>
      </>
    );
  }

  // Step 3: User Info
  if (!userInfo) {
    return (
      <>
        <Navbar />
        <section className="w-full flex flex-col items-center mt-10 px-2 sm:px-4">
          <div className="w-full max-w-md sm:max-w-sm md:max-w-md mx-auto">
            <UserInfoStep
              onBack={() => setDateTime(null)}
              onInfoEntered={(name, email) => setUserInfo({ name, email })}
            />
          </div>
        </section>
      </>
    );
  }

  // Step 4: Confirm Appointment
  return (
    <>
      <Navbar />
      <section className="w-full flex flex-col items-center mt-10 px-2 sm:px-4">
        <div className="w-full max-w-md sm:max-w-sm md:max-w-md mx-auto">
          <ConfirmStep
            service={selectedService}
            date={dateTime?.date || ""}
            time={dateTime?.time || ""}
            price={dateTime?.price}
            name={userInfo.name}
            email={userInfo.email}
            onBack={() => setUserInfo(null)}
          />
        </div>
      </section>
    </>
  );
}
