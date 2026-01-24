import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ObrokForm from "./ObrokForm";

axios.defaults.withCredentials = true;

function NewObrok() {
  const navigate = useNavigate();

  const handleSaveObrok = async (obrok) => {
    try {
      const ukupnoKalorija = obrok.namirnice.reduce((sum, n) => sum + n.kalorije, 0);
      await axios.post("http://127.0.0.1:8000/api/obroci", {
        ime: obrok.ime,
        kalorije: ukupnoKalorija,
      });
      navigate("/obroci"); // vrati na listu obroka
    } catch (err) {
      console.error("Greška pri čuvanju obroka:", err);
      alert("Neuspešno čuvanje obroka. Probaj ponovo.");
    }
  };

  return <ObrokForm onSave={handleSaveObrok} />;
}

export default NewObrok;
