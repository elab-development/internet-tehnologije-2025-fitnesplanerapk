// src/components/Button.jsx
import React from "react";

export default function Button({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-lg font-medium transition
        bg-blue-600 text-white hover:bg-blue-700
        disabled:bg-gray-400 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
}
