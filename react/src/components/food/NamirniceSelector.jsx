import React, { useState } from "react";
import axios from "axios";

function NamirniceSelector({ onAdd }) {
  const [query, setQuery] = useState("");
  const [rezultati, setRezultati] = useState([]);
  const [manualIme, setManualIme] = useState("");
  const [manualKalorije, setManualKalorije] = useState("");

  // Pretraga preko OpenFoodFacts proxy
  const searchFood = async () => {
    if (!query) return;

    try {
      const res = await axios.get(`/api/namirnice/cgi/search.pl`, {
        params: {
          search_terms: query,
          search_simple: 1,
          action: "process",
          json: 1,
          page_size: 10,
        },
      });

      setRezultati(res.data.products || []);
    } catch (err) {
      console.error("Greška pri pretrazi namirnica:", err);
      setRezultati([]);
    }
  };

  // Dodavanje iz pretrage
  const addFromSearch = (p) => {
    const naziv = p.product_name || p.generic_name || "Nepoznata namirnica";
    const kalorije = p.nutriments?.energy_100g || 0;
    onAdd({ ime: naziv, kalorije });
  };

  // Dodavanje ručno unete namirnice
  const addManual = () => {
    if (!manualIme || !manualKalorije) return alert("Popuni oba polja!");
    onAdd({ ime: manualIme, kalorije: parseInt(manualKalorije) });
    setManualIme("");
    setManualKalorije("");
  };

  return (
    <div
      style={{
        border: "1px solid #ffc0cb",
        padding: "15px",
        borderRadius: "10px",
        backgroundColor: "#fff",
        maxWidth: "500px",
        margin: "20px auto",
      }}
    >
      <h3 style={{ color: "#ff69b4", textAlign: "center" }}>Dodaj namirnice</h3>

      {/* Pretraga */}
      <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Pretraži namirnicu"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, padding: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <button
          onClick={searchFood}
          style={{
            backgroundColor: "#ff69b4",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
            color: "white",
            borderRadius: "5px",
          }}
        >
          🔍
        </button>
      </div>

      {/* Rezultati pretrage */}
      <ul
        style={{
          maxHeight: "150px",
          overflowY: "auto",
          marginBottom: "10px",
          paddingLeft: "0",
          listStyle: "none",
        }}
      >
        {rezultati.map((p) => (
          <li
            key={p.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "1px solid #eee",
              padding: "5px 0",
            }}
          >
            <span>{p.product_name || p.generic_name || "Nepoznata namirnica"}</span>
            <button
              onClick={() => addFromSearch(p)}
              style={{
                backgroundColor: "#ff69b4",
                border: "none",
                cursor: "pointer",
                padding: "2px 6px",
                color: "white",
                borderRadius: "3px",
              }}
            >
              +
            </button>
          </li>
        ))}
      </ul>

      {/* Dodavanje ručno */}
      <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Ime namirnice"
          value={manualIme}
          onChange={(e) => setManualIme(e.target.value)}
          style={{ flex: 1, padding: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          type="number"
          placeholder="Kalorije"
          value={manualKalorije}
          onChange={(e) => setManualKalorije(e.target.value)}
          style={{
            width: "80px",
            padding: "5px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={addManual}
          style={{
            backgroundColor: "#ff69b4",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
            color: "white",
            borderRadius: "5px",
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default NamirniceSelector;
