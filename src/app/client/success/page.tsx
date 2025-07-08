"use client";
import Navbar from "../../components/Navbar";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function SuccessPage({
  service = "Makeup",
  date = "June 10, 2024",
  time = "2:30 PM",
  price = 100,
  email = "you@email.com",
}: {
  service?: string;
  date?: string;
  time?: string;
  price?: number;
  email?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookingCreated, setBookingCreated] = useState(false);
  const [loading, setLoading] = useState(true);

  // On mount, fetch session details and create booking if not already done
  useEffect(() => {
    const createBooking = async () => {
      const sessionId = searchParams.get("session_id");
      if (!sessionId || bookingCreated) {
        setLoading(false);
        return;
      }
      try {
        // Call backend to fetch session and create booking
        const res = await fetch(`/api/stripe-success?session_id=${sessionId}`);
        await res.json(); // Optionally handle response
        setBookingCreated(true);
      } catch (err) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    };
    createBooking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, bookingCreated]);

  const handleBookAnother = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("bookingFlowState");
    }
    router.push("/client/book");
  }, [router]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4">
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-10 flex flex-col gap-6 items-center mt-0">
          {/* Small circle, large tick */}
          <span className="flex items-center justify-center w-17 h-17 rounded-full border border-black bg-white mb-1 overflow-visible">
            <svg
              width="56"
              height="56"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: "block" }}
            >
              <path
                d="M22 34L32 44L48 24"
                stroke="black"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            Booking Confirmed!
          </h1>
          <p className="text-gray-700 text-center text-base">
            Your appointment is booked. Thank you for choosing Lumé!
          </p>
          <div className="w-full flex flex-col gap-1 text-black text-base items-center">
            <div>
              <span className="font-medium">Service:</span> {service}
            </div>
            <div>
              <span className="font-medium">Date:</span> {date}
            </div>
            <div>
              <span className="font-medium">Time:</span> {time}
            </div>
            <div>
              <span className="font-medium">Price:</span> ${price}
            </div>
          </div>
          <div className="w-full text-center mt-4 text-gray-700 text-base">
            A confirmation email has been sent to{" "}
            <span className="font-medium">{email}</span>.<br />
            Please check your inbox for details.
          </div>
          <button
            onClick={handleBookAnother}
            className="mt-4 text-black underline text-base hover:text-gray-800"
          >
            Book another appointment
          </button>
        </div>
      </div>
    </>
  );
}
