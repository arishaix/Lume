import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-12 flex flex-col gap-8 items-center">
        <h1 className="text-3xl font-medium text-gray-900 mb-4 text-center">
          Login
        </h1>
        <form className="w-full flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium text-lg">Email</label>
            <input
              type="email"
              className="border border-gray-300 rounded px-6 py-4 w-full text-black text-lg"
              placeholder="you@email.com"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium text-lg">
              Password
            </label>
            <input
              type="password"
              className="border border-gray-300 rounded px-6 py-4 w-full text-black text-lg"
              placeholder="Password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-8 py-4 border border-black text-black bg-white rounded hover:bg-black hover:text-white transition text-lg mt-2"
          >
            Login
          </button>
        </form>
        <div className="w-full text-center mt-4">
          <span className="text-gray-600 text-base">
            Don't have an account?{" "}
          </span>
          <Link
            href="/client/signup"
            className="text-black underline text-base hover:text-gray-800"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
