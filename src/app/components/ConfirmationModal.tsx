import React from "react";

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  booking?: any;
  onConfirm?: (booking: any) => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  booking,
  onConfirm,
}) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "#000000cc" }}
    >
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm flex flex-col items-center">
        <h2 className="text-xl font-semibold mb-4 text-center text-black">
          Are you sure you want to cancel this booking?
        </h2>
        <div className="flex gap-4 mt-6">
          <button
            className="px-4 py-2 border border-black text-black bg-white rounded hover:bg-black hover:text-white transition"
            onClick={onClose}
          >
            No, Go Back
          </button>
          <button
            className="px-4 py-2 border border-black text-black bg-white rounded hover:bg-black hover:text-white transition"
            onClick={() => onConfirm && onConfirm(booking)}
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
