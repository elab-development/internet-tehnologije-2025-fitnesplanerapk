import React, { useEffect, useState } from "react";
import axiosClient from "./axios-client.js";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Button from "../components/Button.jsx";

export default function Vezbaci() {
  const [vezbaci, setVezbaci] = useState([]);
  const [search, setSearch] = useState("");
  const [filterPol, setFilterPol] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axiosClient.get("/vezbaci")
      .then(({ data }) => setVezbaci(data))
      .catch(err => console.error(err));
  }, []);

  const handleClick = (vezbacId) => {
    navigate(`/vezbac/${vezbacId}`);
  };

  
  const filteredVezbaci = vezbaci.filter(v => {
    const fullName = `${v.ime} ${v.prezime}`.toLowerCase();
    const email = v.email?.toLowerCase() || "";
    const telefon = v.telefon?.toLowerCase() || "";
    const matchesSearch = fullName.includes(search.toLowerCase()) || email.includes(search.toLowerCase()) || telefon.includes(search.toLowerCase());
    const matchesFilter = filterPol ? v.pol === filterPol : true;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Moji Vezbači</h1>

        {/* Search i filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Pretraži po imenu, prezimenu, email ili telefonu"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-2 border rounded-md"
          />

          <select
            value={filterPol}
            onChange={(e) => setFilterPol(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="">Svi polovi</option>
            <option value="muski">Muški</option>
            <option value="zenski">Ženski</option>
          </select>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVezbaci.map((vezbac) => (
            <div
              key={vezbac.id}
              className="bg-white text-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-bold">{vezbac.ime} {vezbac.prezime}</h2>
                <p className="text-gray-600">{vezbac.username}</p>
                <p className="text-gray-500">{vezbac.email}</p>
                {vezbac.telefon && <p className="text-gray-500">{vezbac.telefon}</p>}
              </div>
              <Button onClick={() => handleClick(vezbac.id)} className="mt-4">
                Detalji
              </Button>
            </div>
          ))}
          {filteredVezbaci.length === 0 && (
            <p className="text-gray-600 col-span-full">Nema rezultata za pretragu/filter.</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}