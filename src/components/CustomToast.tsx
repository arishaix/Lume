import React from "react";

export function CustomToast({
  type,
  message,
  link,
  linkText,
}: {
  type: "success" | "error";
  message: string;
  link?: string;
  linkText?: string;
}) {
  return (
    <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded shadow-lg min-w-[260px] max-w-xs">
      <span>
        {type === "success" ? (
          // Black tick SVG
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" fill="#000" />
            <path
              d="M7 13l3 3 7-7"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          // Black cross SVG
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" fill="#000" />
            <path
              d="M8 8l8 8M16 8l-8 8"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-900">{message}</div>
        {link && (
          <a
            href={link}
            className="text-xs font-bold text-black underline underline-offset-2 mt-1 inline-block hover:text-gray-700 transition"
          >
            {linkText || "View"}
          </a>
        )}
      </div>
    </div>
  );
}
