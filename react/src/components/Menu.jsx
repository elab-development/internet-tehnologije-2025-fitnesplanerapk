import { NavLink } from "react-router-dom";

export default function Menu({
  showDashboard = false,
  showUserSetup = false,
  showObroci = false,
  showDodajObrok = false,
  showVezbe = false,
  showVezbaci = false,
  showMojTrener=false,
  showProgrami=false,
  showTrenerProfil=false,
  showTrenerVezbe=false,
   showKorisnikProfil=false
}) {
  // Kreiramo listu stavki menija, filtriranu prema props
  const menuItems = [
    showDashboard && { label: "Dashboard", to: "/dashboard" },
    showUserSetup && { label: "User setup", to: "/userSetup" },
    showObroci && { label: "Obroci", to: "/obrociPregled" },
    showDodajObrok && { label: "Dodaj Obrok", to: "/dodajObrok" },
    showVezbe && { label: "Vežbe", to: "/vezbe" },
    showVezbaci && { label: "Vežbači", to: "/vezbaci" },
    showMojTrener && { label: "Moj Trener", to: "/mojTrener" },
    showProgrami && {label:"Programi", to: "/programi"},
    showTrenerProfil && {label:"Profil", to: "/trener-profil"},
    showKorisnikProfil && {label:"Profil", to: "/korisnik-profil"},
    showTrenerProfil && {label:"Vezbe", to: "/trenerVezbe"},
    
  ].filter(Boolean); // uklanja sve false vrednosti

  return (
    <nav className="flex flex-col gap-2">
      {menuItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `block px-3 py-2 rounded-md font-medium transition
             ${isActive ? "bg-blue-600 text-white shadow-md" : "hover:bg-blue-100 hover:text-blue-800"}`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}