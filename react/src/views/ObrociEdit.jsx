import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "./axios-client";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Button from "../components/Button.jsx";

export default function ObrokEdit() {
  const { datum } = useParams();
  const navigate = useNavigate();
  const [dnevniObroci, setDnevniObroci] = useState([]);
  const [hranaLista, setHranaLista] = useState([]);

  useEffect(() => {
    const fetchObroci = async () => {
      try {
        const res = await axiosClient.get("/obrociPregled", { params: { od: datum, do: datum } });
        setDnevniObroci(res.data[0]?.obroci || []);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchHrana = async () => {
      try {
        const res = await axiosClient.get("/hrana");
        setHranaLista(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchObroci();
    fetchHrana();
  }, [datum]);

  const handleChange = (i, field, value) => {
    const temp = [...dnevniObroci];
    if (field === "hrana") {
      temp[i].hrana = value;
    } else {
      temp[i][field] = value;
    }
    setDnevniObroci(temp);
  };

  const dodajNamirnicu = (i) => {
    const temp = [...dnevniObroci];
    temp[i].hrana.push({ custom_naziv: "", kolicina: "", kalorije: 0 });
    setDnevniObroci(temp);
  };

  const obrisiNamirnicu = (i, j) => {
    const temp = [...dnevniObroci];
    temp[i].hrana.splice(j, 1);
    setDnevniObroci(temp);
  };

  const obrisiObrok = (i) => {
    const temp = [...dnevniObroci];
    temp.splice(i, 1);
    setDnevniObroci(temp);
  };

  const sacuvajIzmene = async () => {
    try {
      for (const obrok of dnevniObroci) {
        await axiosClient.post("/obroci", {
          datum,
          naziv: obrok.naziv,
          namirnice: obrok.hrana.map(h => ({
            hrana_id: h.hrana?.id || null,
            custom_naziv: h.custom_naziv,
            kolicina: h.kolicina,
            kalorije: h.kalorije,
          }))
        });
      }
      alert("Izmene sačuvane ✅");
      navigate("/obrociPregled");
    } catch (err) {
      console.error(err);
      alert("Došlo je do greške pri čuvanju.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Izmeni obroke za {datum}</h1>

        {dnevniObroci.map((obrok, i) => (
          <div key={obrok.id} className="mb-6 p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                value={obrok.naziv}
                onChange={(e) => handleChange(i, "naziv", e.target.value)}
                placeholder="Unesite naziv obroka"
                className="border p-2 rounded w-full mr-4"
              />
              <button
                onClick={() => obrisiObrok(i)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Obriši obrok
              </button>
            </div>

            {obrok.hrana.map((h, j) => (
              <div key={h.hrana?.id || h.custom_naziv || j} className="flex items-center mb-2 gap-2">
                <input
                  type="text"
                  value={h.custom_naziv || h.hrana?.naziv || ""}
                  placeholder="Naziv namirnice"
                  onChange={(e) => {
                    const tempHrana = [...obrok.hrana];
                    tempHrana[j].custom_naziv = e.target.value;
                    handleChange(i, "hrana", tempHrana);
                  }}
                  className="border p-2 rounded w-2/3"
                />
                <input
                  type="number"
                  value={h.kolicina || ""}
                  placeholder="Količina"
                  onChange={(e) => {
                    const tempHrana = [...obrok.hrana];
                    tempHrana[j].kolicina = e.target.value;
                    handleChange(i, "hrana", tempHrana);
                  }}
                  className="border p-2 rounded w-1/6"
                />
                <button
                  onClick={() => obrisiNamirnicu(i, j)}
                  className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-500 transition"
                >
                  ×
                </button>
              </div>
            ))}

            <button
              onClick={() => dodajNamirnicu(i)}
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              Dodaj namirnicu
            </button>
            
          </div>
        ))}
         
        <Button onClick={sacuvajIzmene} className="mt-4">
          Sačuvaj izmene
        </Button>
      </main>
      <Footer />
    </div>
  );
}