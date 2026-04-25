
import React from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/7428600607
" // Replace with your WhatsApp number
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-25 right-10 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-lg shadow-lg transition-all duration-300 animate-bounce"
    >
      <FaWhatsapp className="text-2xl animate-pulse" />
      <span className="">Let's Chat </span>


    </a>
  );
}

