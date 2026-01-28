// src/components/Button.jsx
import React from "react";
import "../index.css";
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
       className={`button ${className}`}
    >
      {children}
    </button>
  );
}
