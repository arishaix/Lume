import Link from "next/link";

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
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-10 flex flex-col gap-6 items-center">
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
        <Link
          href="/client/book"
          className="mt-4 text-black underline text-base hover:text-gray-800"
        >
          Book another appointment
        </Link>
      </div>
    </div>
  );
}
