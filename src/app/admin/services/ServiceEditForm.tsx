"use client";

import { useState } from "react";

export default function ServiceEditForm({
  priceOptions,
  initialDuration,
  initialPrice,
  onCancel,
  onSave,
}: {
  priceOptions: number[];
  initialDuration: number;
  initialPrice: number;
  onCancel: () => void;
  onSave: (price: number, duration: number) => void;
}) {
  const [price, setPrice] = useState(initialPrice);
  const [duration, setDuration] = useState(initialDuration);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(price, duration);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col gap-4 mt-4 bg-gray-50 border border-gray-200 p-4"
    >
      <div className="flex flex-col gap-2">
        <label className="text-gray-700 font-medium text-base">
          Price Range
        </label>
        <div className="flex gap-3">
          {priceOptions.map((p) => (
            <button
              type="button"
              key={p}
              className={`px-4 py-2 border text-base font-medium transition ${
                price === p
                  ? "border-black text-black bg-white hover:bg-black hover:text-white"
                  : "border-gray-300 text-gray-700 bg-white hover:bg-black hover:text-white"
              }`}
              onClick={() => setPrice(p)}
            >
              ${p}
            </button>
          ))}
        </div>
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
          onChange={(e) => setDuration(Number(e.target.value))}
          required
        />
      </div>
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
          className="px-6 py-2 border border-black text-black bg-white rounded-none shadow hover:bg-black hover:text-white transition text-base font-medium"
        >
          Save
        </button>
      </div>
    </form>
  );
}
