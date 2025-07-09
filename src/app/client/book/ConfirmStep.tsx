import { useState } from "react";
import toast from "react-hot-toast";
import { CustomToast } from "../../components/CustomToast";
import { useSession, signIn } from "next-auth/react";

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
  const { data: session } = useSession();
  const [toastShown, setToastShown] = useState(false);

  const handleStripe = async () => {
    if (!session || !(session.user as any)?.id) {
      if (!toastShown) {
        toast.custom(
          <CustomToast type="error" message="Please log in to continue" />
        );
        setToastShown(true);
        setTimeout(() => setToastShown(false), 2000); // Reset after 2s
      }
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service, // service ID
          userId: (session.user as any).id, // Pass userId if available
          serviceName,
          price: price * 100, // Stripe expects amount in cents
          date,
          time,
          name,
          email,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        toast.custom(
          <CustomToast
            type="error"
            message={data.error || "Stripe session failed"}
          />
        );
      } else {
        localStorage.setItem("bookingFlowJustCompleted", "true");
        window.location.href = data.url; // Redirect to Stripe Checkout
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
          className={`w-full px-6 py-2 border border-black rounded flex items-center justify-center transition ${
            loading
              ? "bg-black text-white cursor-not-allowed"
              : "bg-white text-black hover:bg-black hover:text-white"
          }`}
          onClick={handleStripe}
          disabled={loading}
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
          ) : (
            "Pay with Stripe"
          )}
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
