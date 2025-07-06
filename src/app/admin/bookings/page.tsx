import AdminNavbar from "../../components/AdminNavbar";

const bookings = [
  {
    id: 1,
    service: "Makeup",
    client: "Alice Johnson",
    date: "June 12, 2024",
    time: "2:30 PM",
    price: 100,
    status: "Upcoming",
  },
  {
    id: 2,
    service: "Nails",
    client: "Bob Smith",
    date: "June 1, 2024",
    time: "11:30 AM",
    price: 60,
    status: "Completed",
  },
  {
    id: 3,
    service: "Makeup",
    client: "Carol Lee",
    date: "May 20, 2024",
    time: "4:00 PM",
    price: 150,
    status: "Cancelled",
  },
];

export default function AdminBookingsPage() {
  const hasBookings = bookings.length > 0;

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-white px-2 sm:px-4 py-10 flex flex-col items-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
          Bookings
        </h1>
        <div className="w-full max-w-3xl flex flex-col gap-6">
          {hasBookings ? (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white border border-gray-200 shadow rounded-xl p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8"
              >
                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-gray-900">
                      {booking.service}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        booking.status === "Upcoming"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "Completed"
                          ? "bg-gray-100 text-gray-500"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <div className="text-gray-700 text-sm">
                    Client: {booking.client}
                  </div>
                  <div className="text-gray-700 text-sm">
                    {booking.date}, {booking.time}
                  </div>
                  <div className="text-gray-700 text-sm">${booking.price}</div>
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  {booking.status === "Upcoming" && (
                    <>
                      <button className="px-4 py-2 border border-black text-black bg-white hover:bg-black hover:text-white transition text-sm">
                        Cancel
                      </button>
                      <button className="px-4 py-2 border border-black text-black bg-white hover:bg-black hover:text-white transition text-sm">
                        Mark as Completed
                      </button>
                    </>
                  )}
                  {booking.status === "Completed" && (
                    <span className="px-4 py-2 text-gray-500 text-sm">
                      Completed
                    </span>
                  )}
                  {booking.status === "Cancelled" && (
                    <span className="px-4 py-2 text-red-500 text-sm">
                      Cancelled
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="w-full flex flex-col items-center gap-4 py-16">
              <p className="text-gray-600 text-lg">No bookings found.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
