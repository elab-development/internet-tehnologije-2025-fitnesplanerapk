import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Axios globalno sa cookies za backend
axios.defaults.withCredentials = true;

function Obroci() {
  const navigate = useNavigate();
  const [datum, setDatum] = useState(new Date().toISOString().split("T")[0]);
  const [obroci, setObroci] = useState([]);
  const [ukupnoKalorija, setUkupnoKalorija] = useState(0);

  useEffect(() => {
    fetchObroci();
  }, [datum]);

  const fetchObroci = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/obroci", {
        params: { datum },
        withCredentials: true
      });

      // Backend vraća objekat { obroci: [], ukupnoKalorija: X }
      const data = res.data;
      setObroci(Array.isArray(data.obroci) ? data.obroci : []);
      setUkupnoKalorija(data.ukupnoKalorija || 0);
    } catch (err) {
      console.error("Greška pri fetch-u obroka:", err);
      setObroci([]);
      setUkupnoKalorija(0);
    }
  };

  const obrisiObrok = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/obroci/${id}`, { withCredentials: true });
      fetchObroci();
    } catch (err) {
      console.error("Greška pri brisanju obroka:", err);
    }
  };

  return (
    <div style={{
      maxWidth: "600px",
      margin: "40px auto",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#fff0f5",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ textAlign: "center", color: "#ff69b4" }}>Praćenje kalorija za {datum}</h2>

      <input
        type="date"
        value={datum}
        onChange={(e) => setDatum(e.target.value)}
        style={{
          padding: "8px",
          marginBottom: "15px",
          width: "100%",
          borderRadius: "5px",
          border: "1px solid #ccc"
        }}
      />

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #ccc" }}>
            <th style={{ textAlign: "left", padding: "5px" }}>Obrok</th>
            <th style={{ textAlign: "right", padding: "5px" }}>Kalorije</th>
            <th style={{ padding: "5px" }}>Akcija</th>
          </tr>
        </thead>
        <tbody>
          {obroci.map((obrok) => (
            <tr key={obrok.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "5px" }}>{obrok.ime}</td>
              <td style={{ padding: "5px", textAlign: "right" }}>{obrok.kalorije}</td>
              <td style={{ padding: "5px", textAlign: "center" }}>
                <button
                  onClick={() => obrisiObrok(obrok.id)}
                  style={{
                    cursor: "pointer",
                    backgroundColor: "#ffb6c1",
                    border: "none",
                    borderRadius: "5px",
                    padding: "2px 6px"
                  }}
                >
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ fontWeight: "bold", textAlign: "right", color: "#ff1493" }}>
        Ukupno kalorija: {ukupnoKalorija}
      </p>

      <h3 style={{ color: "#ff69b4", textAlign: "center" }}>Grafikon kalorija</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={obroci}>
          <XAxis dataKey="ime" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="kalorije" fill="#ff69b4" />
        </BarChart>
      </ResponsiveContainer>

      {/* Dugme + za dodavanje novog obroka */}
      <button
        onClick={() => navigate("/obrok/novi")}
        style={{
          padding: "15px",
          backgroundColor: "#ff69b4",
          border: "none",
          borderRadius: "50%",
          fontSize: "24px",
          cursor: "pointer",
          color: "white",
          position: "fixed",
          right: "30px",
          bottom: "30px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
        }}
      >
        +
      </button>
    </div>
  );
}

export default Obroci;
