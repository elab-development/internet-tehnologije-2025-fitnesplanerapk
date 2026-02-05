import { useEffect, useState } from "react";
import axiosClient from "./axios-client";
import Button from "../components/Button.jsx";
export default function Obroci() {
  const [datum, setDatum] = useState("");
  const [naziv, setNaziv] = useState("");
  const [hranaLista, setHranaLista] = useState([]);
  const [stavke, setStavke] = useState([
    { hrana_id: "", kolicina: "", custom_naziv: "", kalorije: "" }
  ]);

  useEffect(() => {
    axiosClient.get("/hrana").then(({ data }) => {
      setHranaLista(data);
    });
  }, []);

  const addRow = () => {
    setStavke([
      ...stavke,
      { hrana_id: "", kolicina: "", custom_naziv: "", kalorije: "" }
    ]);
  };

  const handleChange = (index, field, value) => {
    const newStavke = [...stavke];
    newStavke[index][field] = value;
    setStavke(newStavke);
  };

  const submit = (e) => {
    e.preventDefault();

    axiosClient.post("/obroci", {
      datum,
      naziv,
      hrana: stavke
    }).then(() => {
      alert("Obrok dodat ✅");
      setNaziv("");
      setStavke([{ hrana_id: "", kolicina: "", custom_naziv: "", kalorije: "" }]);
    });
  };

  return (
    <div className="card">
      <h2>Novi obrok</h2>

      <form onSubmit={submit}>
        <input
          type="date"
          value={datum}
          onChange={e => setDatum(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Naziv obroka (npr. Doručak)"
          value={naziv}
          onChange={e => setNaziv(e.target.value)}
          required
        />

        {stavke.map((s, i) => (
          <div key={i} style={{ borderBottom: "1px solid #ddd", padding: 10 }}>
            <select
              value={s.hrana_id}
              onChange={e => handleChange(i, "hrana_id", e.target.value)}
            >
              <option value="">-- Izaberi hranu --</option>
              {hranaLista.map(h => (
                <option key={h.id} value={h.id}>
                  {h.naziv}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Količina (g)"
              value={s.kolicina}
              onChange={e => handleChange(i, "kolicina", e.target.value)}
            />

            <p>ILI</p>

            <input
              type="text"
              placeholder="Custom naziv"
              value={s.custom_naziv}
              onChange={e => handleChange(i, "custom_naziv", e.target.value)}
            />

            <input
              type="number"
              placeholder="Kalorije"
              value={s.kalorije}
              onChange={e => handleChange(i, "kalorije", e.target.value)}
            />
          </div>
        ))}

        <Button type="button" onClick={addRow}>
          + Dodaj hranu
        </Button>

        <br /><br />

        <Button type="submit">Sačuvaj obrok</Button>
      </form>
    </div>
  );
}
