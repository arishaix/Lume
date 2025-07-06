import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <section
        className="w-full min-h-[60vh] bg-cover bg-center flex items-end justify-center relative pt-124"
        style={{
          backgroundImage: "url('/hero.jpg')",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="w-full flex flex-col items-center mb-12">
          <div className="bg-white/80 px-6 py-3 shadow-lg mb-4">
            <h1 className="text-xl font-normal text-gray-900 text-center tracking-wide">
              Makeup, Nails, and Appointments
            </h1>
          </div>
          <Link href="/client/book">
            <button className="mt-2 w-32 h-12 bg-transparent border border-white text-white font-semibold rounded-none shadow-lg hover:bg-white hover:text-black transition text-lg cursor-pointer">
              Book
            </button>
          </Link>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="w-full flex flex-col items-center mt-20 pb-20">
        <h2 className="text-4xl font-normal text-gray-900 text-center mb-9 tracking-wide">
          What We Offer
        </h2>
        <div className="w-full flex flex-col md:flex-row justify-center items-center gap-10 bg-white px-4 mt-6">
          {/* Makeup Card */}
          <div className="bg-white rounded-none shadow-lg flex flex-col items-center w-full max-w-md overflow-hidden">
            <img
              src="/makeup.jpg"
              alt="Makeup"
              className="w-full h-64 object-cover"
            />
            <div className="flex flex-col items-center p-8 w-full flex-1">
              <h3 className="text-3xl font-normal text-gray-900 mb-2">
                Makeup
              </h3>
              <p className="text-black text-base mb-4">Starting from $60</p>
              {/* Add more content here if needed */}
            </div>
          </div>
          {/* Nails Card */}
          <div className="bg-white rounded-none shadow-lg flex flex-col items-center w-full max-w-md overflow-hidden">
            <img
              src="/nails.jpg"
              alt="Nails"
              className="w-full h-64 object-cover"
            />
            <div className="flex flex-col items-center p-8 w-full flex-1">
              <h3 className="text-3xl font-normal text-gray-900 mb-2">Nails</h3>
              <p className="text-black text-base mb-4">Starting from $40</p>
              {/* Add more content here if needed */}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
