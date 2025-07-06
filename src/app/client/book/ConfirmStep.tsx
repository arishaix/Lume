import { useState } from "react";

export default function ConfirmStep({
  service,
  date,
  time,
  price,
  name,
  email,
  onBack,
}: {
  service: string;
  date: string;
  time: string;
  price: number;
  name: string;
  email: string;
  onBack: () => void;
}) {
  const [success, setSuccess] = useState("");

  const handleStripe = () => {
    setSuccess("Stripe payment flow coming soon! Booking confirmed.");
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-xl p-8 flex flex-col gap-6 items-center">
      <h2 className="text-2xl font-medium text-gray-900 mb-2 text-center">
        Confirm Appointment
      </h2>
      <div className="w-full flex flex-col items-center gap-2 text-black">
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
        >
          Pay with Stripe
        </button>
        <button
          className="w-full px-6 py-2 border border-black text-black bg-white rounded hover:bg-black hover:text-white transition"
          onClick={onBack}
        >
          Back
        </button>
      </div>
      {success && (
        <div className="w-full text-center text-green-600 font-medium mt-4">
          {success}
        </div>
      )}
    </div>
  );
}
