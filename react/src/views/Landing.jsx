import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="relative">

   
      <nav className="w-full bg-[#eda336] fixed top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white tracking-wide">FitnessAplikacija</h1>
          <button
            onClick={handleLogin}
            className="bg-gradient-to-r from-[#667eea] to-[#515bff] text-white font-semibold px-5 py-2 rounded-lg shadow-lg hover:scale-105 transition-transform"
          >
            Login
          </button>
        </div>
      </nav>

      
      <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-tr from-[#667eea] to-[#515bff] text-white p-6 pt-32">

        
        <h1 className="text-5xl font-extrabold mb-6 text-center animate-fadeIn">
          Najjednostavnija Fitness Aplikacija
        </h1>

       
        <p className="text-xl mb-12 text-center max-w-3xl animate-fadeIn delay-100">
          Pratite ishranu, treninge i hidrataciju na jednom mestu. Naša aplikacija je moderna, brza i intuitivna, kreirana da vam olakša zdrav život svakog dana.
        </p>

      
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16 max-w-5xl">
          {[
            { emoji: "🔥", text: "Praćenje dnevnog unosa hrane i kalorija" },
            { emoji: "🏋️‍♂️", text: "Planiranje i praćenje treninga" },
            { emoji: "💧", text: "Praćenje hidratacije i dnevnog unosa tečnosti" },
            { emoji: "✨", text: "Jednostavno i intuitivno korisničko iskustvo" }
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 bg-white text-[#515bff] rounded-xl p-6 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              <span className="text-4xl">{item.emoji}</span>
              <span className="text-lg font-medium">{item.text}</span>
            </div>
          ))}
        </div>

      
        <a
          href="https://fitnessaplikacija.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-[#eda336] to-[#f5b14c] text-white font-semibold px-12 py-4 rounded-xl shadow-lg hover:scale-105 transition-transform text-lg mb-20"
        >
          Kupite članarinu odmah
        </a>

       
        <div className="bg-white text-[#515bff] rounded-2xl shadow-xl p-10 max-w-4xl w-full mb-20">
          <h2 className="text-3xl font-bold mb-4 text-center">
            Za Trenerе
          </h2>
          <p className="text-lg mb-6 text-center">
            Ako ste trener, kreirajte trening programe i pratite napredak vaših vežbača direktno kroz aplikaciju.
          </p>
          <ul className="list-disc list-inside mb-8 text-lg space-y-2">
            <li>Pravite prilagođene trening planove</li>
            <li>Praćenje napretka i rezultata vežbača</li>
            <li>Jednostavno deljenje programa sa klijentima</li>
          </ul>
          <div className="flex justify-center">
            <a
              href="https://fitnessaplikacija.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-[#667eea] to-[#515bff] text-white font-semibold px-10 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
              Kreirajte program odmah
            </a>
          </div>
        </div>

        <p className="mt-6 text-center text-sm max-w-md animate-fadeIn delay-200">
          Počnite danas i unapredite svoje zdravlje i rezultate uz najjednostavniju fitness aplikaciju!
        </p>

      </div>
    </div>
  );
}