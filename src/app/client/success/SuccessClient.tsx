"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

function formatDate(dateString?: string) {
  if (!dateString) return "";
  // Try to parse and format as YYYY-MM-DD
  const d = new Date(dateString);
  if (!isNaN(d.getTime())) {
    return d.toISOString().slice(0, 10);
  }
  return dateString;
}

const BOOKING_FLOW_FLAG = "bookingFlowJustCompleted";
const BOOKING_SUCCESS_SESSION_FLAG = "bookingSuccessSeen";

export default function SuccessClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [booking, setBooking] = useState<{
    serviceName?: string;
    service?: string;
    date?: string;
    time?: string;
    price?: number;
    email?: string;
  } | null>(null);
  const [bookingCreated, setBookingCreated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accessAllowed, setAccessAllowed] = useState(false);
  const [accessChecked, setAccessChecked] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const localFlag = localStorage.getItem(BOOKING_FLOW_FLAG);
      const sessionFlag = sessionStorage.getItem(BOOKING_SUCCESS_SESSION_FLAG);
      if (localFlag) {
        // Remove the localStorage flag and set the sessionStorage flag
        localStorage.removeItem(BOOKING_FLOW_FLAG);
        sessionStorage.setItem(BOOKING_SUCCESS_SESSION_FLAG, "true");
        setAccessAllowed(true);
      } else if (sessionFlag) {
        setAccessAllowed(true);
      } else {
        setAccessAllowed(false);
      }
      setAccessChecked(true);
    }
  }, []);

  useEffect(() => {
    if (!accessAllowed) return;
    const fetchBooking = async () => {
      const sessionId = searchParams.get("session_id");
      if (!sessionId || bookingCreated) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/stripe-success?session_id=${sessionId}`);
        const data = await res.json();
        if (res.ok && data.booking) {
          setBooking(data.booking);
        } else {
          setError(data.error || "Booking not found.");
        }
        setBookingCreated(true);
      } catch (err) {
        setError("Failed to fetch booking details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, bookingCreated, accessAllowed]);

  const handleBookAnother = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("bookingFlowState");
    }
    router.push("/client/book");
  }, [router]);

  if (!accessChecked) {
    return null;
  }
  if (!accessAllowed) {
    return (
      <section className="w-full flex flex-col items-center mt-24 px-2 sm:px-4">
        <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-xl p-10 flex flex-col gap-6 items-center">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-4">
            Access Denied
          </h1>
          <p className="text-gray-700 text-center text-base">
            You can only access this page after completing a booking.
          </p>
          <button
            onClick={() => router.push("/client/book")}
            className="mt-4 text-black underline text-base hover:text-gray-800"
          >
            Go to Booking Page
          </button>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="w-full flex flex-col items-center mt-45 px-2 sm:px-4">
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4">
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-10 flex flex-col gap-6 items-center mt-0">
          <div className="text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full flex flex-col items-center mt-22 px-2 sm:px-4">
      <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-xl p-10 flex flex-col gap-6 items-center">
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
            <span className="font-medium">Service:</span>{" "}
            {booking?.serviceName || booking?.service}
          </div>
          <div>
            <span className="font-medium">Date:</span>{" "}
            {formatDate(booking?.date)}
          </div>
          <div>
            <span className="font-medium">Time:</span> {booking?.time}
          </div>
          <div>
            <span className="font-medium">Price:</span> ${booking?.price}
          </div>
        </div>
        <button
          onClick={handleBookAnother}
          className="mt-0 text-black underline text-base hover:text-gray-800"
        >
          Book another appointment
        </button>
      </div>
    </section>
  );
}
