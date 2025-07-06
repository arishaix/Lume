import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 py-8 flex flex-col items-center mt-8">
      <div className="flex flex-col items-center w-full max-w-4xl px-4 gap-2">
        <span className="text-2xl font-serif font-bold tracking-widest text-black select-none text-center">
          Lumé
        </span>
        <span className="text-xs font-normal text-black text-center">
          © 2025 Lumé. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
