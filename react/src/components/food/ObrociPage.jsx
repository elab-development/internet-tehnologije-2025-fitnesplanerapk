import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;

function ObrociPage() {
  const [obroci, setObroci] = useState([]);
  const [datum, setDatum] = useState(new Date().toISOString().split("T")[0]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchObroci();
  }, [datum]);

  const fetchObroci = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/obroci", { params: { datum } });
      setObroci(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setObroci([]);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "50px" }}>
      <h1 style={{ color: "#ff69b4" }}>Obroci za {datum}</h1>

      <div style={{ marginTop: "20px" }}>
        {obroci.length === 0 ? (
          <p>Trenutno nema obroka za danas.</p>
        ) : (
          obroci.map((obrok) => (
            <div key={obrok.id} style={{ backgroundColor: "#fff0f5", padding: "15px", margin: "10px 0", borderRadius: "10px", width: "300px", textAlign: "center" }}>
              <h3>{obrok.ime}</h3>
              <p>Kalorije: {obrok.kalorije}</p>
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => navigate("/obrok/novi")}
        style={{ marginTop: "30px", fontSize: "24px", width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "#ff69b4", color: "white", border: "none", cursor: "pointer" }}
      >
        +
      </button>
    </div>
  );
}

export default ObrociPage;
