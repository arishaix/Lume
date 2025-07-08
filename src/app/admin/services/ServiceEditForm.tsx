"use client";

import { useState } from "react";
import { CustomToast } from "../../components/CustomToast";

export default function ServiceEditForm({
  basicPrice,
  standardPrice,
  premiumPrice,
  initialDuration,
  onCancel,
  onSave,
}: {
  basicPrice: number;
  standardPrice: number;
  premiumPrice: number;
  initialDuration: number;
  onCancel: () => void;
  onSave: (
    basicPrice: number,
    standardPrice: number,
    premiumPrice: number,
    duration: number
  ) => void;
}) {
  const [duration, setDuration] = useState(
    initialDuration === 0 ? "" : initialDuration.toString()
  );
  const [basic, setBasic] = useState(
    basicPrice === 0 ? "" : basicPrice.toString()
  );
  const [standard, setStandard] = useState(
    standardPrice === 0 ? "" : standardPrice.toString()
  );
  const [premium, setPremium] = useState(
    premiumPrice === 0 ? "" : premiumPrice.toString()
  );
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const isInvalid =
    !basic ||
    !standard ||
    !premium ||
    !duration ||
    Number(basic) <= 0 ||
    Number(standard) <= 0 ||
    Number(premium) <= 0 ||
    Number(duration) <= 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation: no field can be empty or zero
    if (isInvalid) {
      setError("All fields are required and must be greater than 0.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      return;
    }
    setError("");
    onSave(Number(basic), Number(standard), Number(premium), Number(duration));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col gap-4 mt-4 bg-gray-50 border border-gray-200 p-4"
    >
      <div className="flex flex-col gap-2">
        <label className="text-gray-700 font-medium text-base">
          Basic Price
        </label>
        <input
          type="number"
          className="border border-gray-300 rounded px-4 py-2 w-full text-black text-base"
          value={basic}
          min={1}
          onChange={(e) => setBasic(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-gray-700 font-medium text-base">
          Standard Price
        </label>
        <input
          type="number"
          className="border border-gray-300 rounded px-4 py-2 w-full text-black text-base"
          value={standard}
          min={1}
          onChange={(e) => setStandard(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-gray-700 font-medium text-base">
          Premium Price
        </label>
        <input
          type="number"
          className="border border-gray-300 rounded px-4 py-2 w-full text-black text-base"
          value={premium}
          min={1}
          onChange={(e) => setPremium(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-gray-700 font-medium text-base">
          Duration (minutes)
        </label>
        <input
          type="number"
          className="border border-gray-300 rounded px-4 py-2 w-full text-black text-base"
          value={duration}
          min={10}
          max={180}
          step={5}
          onChange={(e) => setDuration(e.target.value)}
          required
        />
      </div>
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
      <div className="flex gap-4 mt-2">
        <button
          type="button"
          className="px-6 py-2 border border-gray-400 text-gray-700 bg-white rounded-none hover:bg-gray-200 transition text-base font-medium"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 border border-black text-black bg-white rounded-none shadow hover:bg-black hover:text-white transition text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isInvalid}
        >
          Save
        </button>
      </div>
      {showToast && (
        <div className="fixed top-6 right-6 z-50">
          <CustomToast
            type="error"
            message="All fields are required and must be greater than 0."
          />
        </div>
      )}
    </form>
  );
}
