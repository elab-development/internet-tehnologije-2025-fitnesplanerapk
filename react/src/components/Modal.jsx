import React from "react";
import Button from "./Button.jsx";

export default function Modal({ title, children, onClose }) {
      return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-xl p-6 w-[95%] max-w-6xl shadow-2xl">
            
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h3 className="text-xl font-semibold">{title}</h3>
              <Button
                onClick={onClose}
                className="text-gray-600 hover:text-red-500 text-2xl font-bold"
              >
                ✕
              </Button>
            </div>

            <div className="overflow-x-auto">
              {children}
            </div>

          </div>
        </div>
      );
    }