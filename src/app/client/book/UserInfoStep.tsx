import { useState } from "react";

export default function UserInfoStep({
  onBack,
  onInfoEntered,
  initialName = "",
  initialEmail = "",
}: {
  onBack: () => void;
  onInfoEntered: (name: string, email: string) => void;
  initialName?: string;
  initialEmail?: string;
}) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [showError, setShowError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      onInfoEntered(name, email);
    } else {
      setShowError(true);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto bg-white shadow-lg rounded-xl p-8 flex flex-col gap-6 items-center"
    >
      <h2 className="text-2xl font-medium text-gray-900 mb-2 text-center">
        Enter Your Info
      </h2>
      <div className="w-full flex flex-col gap-4">
        <label className="text-gray-700 font-medium">Full Name</label>
        <input
          type="text"
          className="border border-gray-300 rounded px-4 py-2 w-full text-black"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Your full name"
        />
      </div>
      <div className="w-full flex flex-col gap-4">
        <label className="text-gray-700 font-medium">Email</label>
        <input
          type="email"
          className="border border-gray-300 rounded px-4 py-2 w-full text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@email.com"
        />
      </div>
      <div className="w-full flex justify-between mt-6 gap-4">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 border border-black text-black bg-white rounded hover:bg-black hover:text-white transition"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-6 py-2 border border-black text-black bg-white rounded hover:bg-black hover:text-white transition"
        >
          Continue
        </button>
      </div>
      {/* Show error message below the buttons if user tried to submit without both */}
      {showError && (!name || !email) && (
        <p className="text-sm text-black mt-2">Please enter your name and email to continue.</p>
      )}
    </form>
  );
}
