

import "../index.css";
export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* LEVA KOLONA */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">
            Fitness Planner
          </h2>
          <p className="text-sm leading-relaxed">
            Planiraj treninge, prati napredak i ostani dosledan svojim ciljevima.
          </p>
        </div>

        {/* SREDNJA SLIKA */}
        <div className="col-span-2 flex justify-center items-center">
          <img 
            src="/quote-removebg-preview.png"  
            alt="Footer logo"
            className="h-24 md:h-28 lg:h-32 object-contain"
          />
        </div>

        {/* DESNA KOLONA */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-4 uppercase">
            Kontakt
          </h3>
          <p className="text-sm">support@iteh.com</p>
          <p className="text-sm mt-2">Beograd, Srbija</p>
        </div>

      </div>
    </footer>
  );
}

