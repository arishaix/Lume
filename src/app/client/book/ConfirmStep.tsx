import { useState } from "react";
import toast from "react-hot-toast";
import { CustomToast } from "../../../components/CustomToast";

export default function ConfirmStep({
  service, // service ID
  serviceName, // service name
  date,
  time,
  price,
  name,
  email,
  onBack,
  onBookingComplete,
}: {
  service: string;
  serviceName: string;
  date: string;
  time: string;
  price: number;
  name: string;
  email: string;
  onBack: () => void;
  onBookingComplete?: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleStripe = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedServiceId: service,
          appointmentDate: date,
          appointmentTime: time,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.custom(
          <CustomToast type="error" message={data.error || "Booking failed"} />
        );
      } else {
        toast.custom(
          <CustomToast
            type="success"
            message="Booking Confirmed!"
            link="/client/bookings"
            linkText="Go to My Bookings"
          />
        );
        if (onBookingComplete) onBookingComplete();
      }
    } catch (err) {
      toast.custom(<CustomToast type="error" message="Something went wrong" />);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-xl p-8 flex flex-col gap-6 items-center">
      <h2 className="text-2xl font-medium text-gray-900 mb-2 text-center">
        Confirm Appointment
      </h2>
      <div className="w-full flex flex-col items-center gap-2 text-black">
        <div>
          <span className="font-medium">Service:</span> {serviceName}
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
        <div>
          <span className="font-medium">Name:</span> {name}
        </div>
        <div>
          <span className="font-medium">Email:</span> {email}
        </div>
      </div>
      <div className="w-full flex flex-col gap-3 mt-4">
        <button
          className="w-full px-6 py-2 border border-black text-black bg-white rounded hover:bg-black hover:text-white transition"
          onClick={handleStripe}
          disabled={loading}
        >
          {loading ? "Booking..." : "Pay with Stripe"}
        </button>
        <button
          className="w-full px-6 py-2 border border-black text-black bg-white rounded hover:bg-black hover:text-white transition"
          onClick={onBack}
          disabled={loading}
        >
          Back
        </button>
      </div>
    </div>
  );
}
