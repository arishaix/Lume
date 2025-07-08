import { useState } from "react";

const TIME_SLOTS = [
  "10:00 AM",
  "11:30 AM",
  "1:00 PM",
  "2:30 PM",
  "4:00 PM",
  "5:30 PM",
];

export default function DateTimeStep({
  service,
  onBack,
  onDateTimeSelected,
  initialDate = "",
  initialTime = "",
  initialPrice = null,
}: {
  service: any; // full service object
  onBack: () => void;
  onDateTimeSelected: (date: string, time: string, price: number) => void;
  initialDate?: string;
  initialTime?: string;
  initialPrice?: number | null;
}) {
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialTime);
  const [price, setPrice] = useState<number | null>(initialPrice);
  const [showError, setShowError] = useState(false);

  // Build price options from individual fields
  const priceOptions = [
    service.basicPrice && { label: "Basic", price: service.basicPrice },
    service.standardPrice && {
      label: "Standard",
      price: service.standardPrice,
    },
    service.premiumPrice && { label: "Premium", price: service.premiumPrice },
  ].filter(Boolean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && time && price !== null) {
      onDateTimeSelected(date, time, price);
    } else {
      setShowError(true);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm mx-auto bg-white shadow-lg rounded-xl p-4 md:p-6 flex flex-col gap-3 items-center"
    >
      <h2 className="text-lg font-medium text-gray-900 mb-2 text-center">
        Pick Date & Time & Price
      </h2>
      <div className="w-full flex flex-col gap-2">
        <label className="text-gray-700 font-medium text-sm">Date</label>
        <input
          type="date"
          className="border border-gray-300 rounded px-3 py-2 w-full placeholder-black text-black text-sm"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          placeholder="mm/dd/yyyy"
          style={{ colorScheme: "light" }}
        />
      </div>
      <div className="w-full flex flex-col gap-2">
        <label className="text-gray-700 font-medium text-sm">Time</label>
        <div className="grid grid-cols-2 gap-2">
          {TIME_SLOTS.map((slot) => (
            <button
              type="button"
              key={slot}
              className={`px-3 py-2 border rounded transition font-medium text-sm ${
                time === slot
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-gray-300 hover:bg-black hover:text-white"
              }`}
              onClick={() => setTime(slot)}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>
      {/* Price Range */}
      <div className="w-full flex flex-col gap-2">
        <label className="text-gray-700 font-medium text-sm">Price</label>
        <div className="flex gap-2">
          {priceOptions.length > 0 ? (
            priceOptions.map((p: any) => (
              <button
                type="button"
                key={p.label}
                className={`px-3 py-2 border rounded transition font-medium text-sm ${
                  price === p.price
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-300 hover:bg-black hover:text-white"
                }`}
                onClick={() => setPrice(p.price)}
              >
                {`${p.label} ($${p.price})`}
              </button>
            ))
          ) : (
            <button
              type="button"
              className="px-3 py-2 border rounded text-sm"
              disabled
            >
              No prices
            </button>
          )}
        </div>
      </div>
      <div className="w-full flex justify-between mt-3 gap-2">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 border border-black text-black bg-white rounded hover:bg-black hover:text-white transition text-sm"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-black text-black bg-white rounded hover:bg-black hover:text-white transition text-sm"
        >
          Continue
        </button>
      </div>
      {/* Show error message below the buttons if user tried to submit without all required fields */}
      {showError && (!date || !time || price === null) && (
        <p className="text-sm text-black mt-1">
          Please select a date, time, and price to continue.
        </p>
      )}
    </form>
  );
}
