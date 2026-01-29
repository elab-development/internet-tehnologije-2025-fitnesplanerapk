import { NavLink } from "react-router-dom";

export default function Menu() {
  const menuItems = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "User setup", to: "/userSetup" },
    { label: "Obroci", to: "/obrociPregled" },
    { label: "Dodaj Obrok", to: "/dodajObrok" },
  ];

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
