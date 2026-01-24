import React, { useState } from "react";
import NamirniceSelector from "./NamirniceSelector";

function ObrokForm({ onSave }) {
  const [obrok, setObrok] = useState({ ime: "", namirnice: [] });

  const addNamirnica = (n) => {
    setObrok({ ...obrok, namirnice: [...obrok.namirnice, n] });
  };

  const saveObrok = () => {
    if (!obrok.ime || obrok.namirnice.length === 0) {
      return alert("Popuni ime obroka i dodaj barem jednu namirnicu!");
    }
    onSave(obrok);
    setObrok({ ime: "", namirnice: [] });
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", textAlign: "center" }}>
      <h2 style={{ color: "#ff69b4" }}>Novi Obrok</h2>
      <input
        type="text"
        placeholder="Ime obroka"
        value={obrok.ime}
        onChange={(e) => setObrok({ ...obrok, ime: e.target.value })}
        style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #ffb6c1", marginBottom: "20px" }}
      />

      <NamirniceSelector onAdd={addNamirnica} />

      <div style={{ marginTop: "20px", textAlign: "left" }}>
        <h4>Namirnice u obroku:</h4>
        <ul>
          {obrok.namirnice.map((n, i) => (
            <li key={i}>{n.ime} - {n.kalorije} kcal</li>
          ))}
        </ul>
      </div>

      <button
        onClick={saveObrok}
        style={{
          marginTop: "20px",
          backgroundColor: "#ff69b4",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        Sačuvaj obrok
      </button>
    </div>
  );
}

export default ObrokForm;
