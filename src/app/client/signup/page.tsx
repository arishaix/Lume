import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-xl p-8 flex flex-col gap-6 items-center">
        <h1 className="text-2xl font-medium text-gray-900 mb-2 text-center">
          Sign Up
        </h1>
        <form className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 font-medium text-base">
              Full Name
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded px-4 py-3 w-full text-black text-base"
              placeholder="Your name"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 font-medium text-base">Email</label>
            <input
              type="email"
              className="border border-gray-300 rounded px-4 py-3 w-full text-black text-base"
              placeholder="you@email.com"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 font-medium text-base">
              Password
            </label>
            <input
              type="password"
              className="border border-gray-300 rounded px-4 py-3 w-full text-black text-base"
              placeholder="Password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 border border-black text-black bg-white rounded hover:bg-black hover:text-white transition text-base mt-2"
          >
            Sign Up
          </button>
        </form>
        <div className="w-full text-center mt-2">
          <span className="text-gray-600 text-sm">
            Already have an account?{" "}
          </span>
          <Link
            href="/client/login"
            className="text-black underline text-sm hover:text-gray-800"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
