"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { useSession, signIn } from "next-auth/react";
import ConfirmationModal from "../../components/ConfirmationModal";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const BOOKINGS_PER_PAGE = 5;

export default function MyBookingsPage() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      setLoading(false);
      return;
    }
    // Try to get userId, fallback to email if needed
    const userId = (session.user as any)?.id;
    const email = session.user?.email;
    if (!userId && !email) {
      // Don't set loading to false yet, wait for userId or email to be available
      return;
    }
    setLoading(true);
    const url = userId
      ? `/api/bookings?userId=${userId}&page=${page}&limit=${BOOKINGS_PER_PAGE}`
      : `/api/bookings?email=${email}&page=${page}&limit=${BOOKINGS_PER_PAGE}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setBookings(data.bookings || []);
        setTotal(data.total || 0);
      })
      .finally(() => setLoading(false));
  }, [session, status, page]);

  const hasBookings = bookings.length > 0;
  const totalPages = Math.ceil(total / BOOKINGS_PER_PAGE);

  const handleCancelClick = (booking: any) => {
    setBookingToCancel(booking);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setBookingToCancel(null);
  };

  const handleCancelConfirm = async (booking: any) => {
    if (!booking) return;
    const res = await fetch("/api/bookings/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: booking._id }),
    });
    if (res.ok) {
      setBookings((prev) => prev.filter((b) => b._id !== booking._id));
      setShowModal(false);
      setBookingToCancel(null);
      setTotal((prev) => prev - 1);
    } else {
      setShowModal(false);
      setBookingToCancel(null);
    }
  };

  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setPage((p) => Math.min(totalPages, p + 1));

  if (status === "loading") {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center bg-white px-2 sm:px-4 py-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            My Bookings
          </h1>
          <div className="w-full flex flex-col items-center gap-4 py-16">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </>
    );
  }

  if (!session || !(session.user as any)?.id) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center bg-white px-2 sm:px-4 py-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            My Bookings
          </h1>
          <div className="w-full flex flex-col items-center gap-4 py-16">
            <p className="text-gray-600 text-lg">
              Please log in to view your bookings.
            </p>
            <button
              onClick={() => signIn()}
              className="text-black underline text-base hover:text-gray-800"
            >
              Log In
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center bg-white px-2 sm:px-4 py-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
          My Bookings
        </h1>
        <div className="w-full max-w-2xl flex flex-col gap-6">
          {loading ? (
            <div className="w-full flex flex-col items-center gap-4 py-16">
              <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
            </div>
          ) : hasBookings ? (
            <>
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white border border-gray-200 shadow rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8"
                >
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-gray-900">
                        {booking.service?.name || "Unknown Service"}
                      </span>
                    </div>
                    <div className="text-gray-700 text-sm">
                      {booking.date?.slice(0, 10)}, {booking.time}
                    </div>
                    <div className="text-gray-700 text-sm">
                      ${booking.service?.price ?? booking.price ?? "-"}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <button
                      className="px-4 py-2 border border-black text-black bg-white rounded hover:bg-black hover:text-white transition text-sm"
                      onClick={() => handleCancelClick(booking)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
              {total > BOOKINGS_PER_PAGE && totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <button
                    className="p-2 border border-black text-black bg-white rounded hover:bg-black hover:text-white transition text-sm disabled:opacity-50"
                    onClick={handlePrevPage}
                    disabled={page === 1}
                    aria-label="Previous Page"
                  >
                    <FaChevronLeft />
                  </button>
                  <span className="text-black text-base">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    className="p-2 border border-black text-black bg-white rounded hover:bg-black hover:text-white transition text-sm disabled:opacity-50"
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                    aria-label="Next Page"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="w-full flex flex-col items-center gap-4 py-16">
              <p className="text-gray-600 text-lg">You have no bookings yet.</p>
              <Link
                href="/client/book"
                className="text-black underline text-base hover:text-gray-800"
              >
                Book Now
              </Link>
            </div>
          )}
        </div>
      </div>
      <ConfirmationModal
        open={showModal}
        onClose={handleModalClose}
        booking={bookingToCancel}
        onConfirm={handleCancelConfirm}
      />
    </>
  );
}
