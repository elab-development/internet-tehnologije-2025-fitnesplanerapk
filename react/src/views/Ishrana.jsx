import { useEffect, useState } from "react";
import axiosClient from "./axios-client";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

export default function Ishrana() {
  const [hrana, setHrana] = useState([]);
  const [obrok, setObrok] = useState({
    datum: new Date().toISOString().slice(0, 10),
    naziv: "",
    namirnice: [
      { hrana_id: null, custom_naziv: "", kolicina: "", kalorije_na_100g: "", kalorije: 0 }
    ]
  });

  const [filteredHrana, setFilteredHrana] = useState([]);
  const [focusIndex, setFocusIndex] = useState(null);
  const [activeSuggestion, setActiveSuggestion] = useState(0);

  useEffect(() => {
    const fetchHrana = async () => {
      try {
        const res = await axiosClient.get("/hrana");
        setHrana(res.data);
      } catch (err) {
        console.error("Greška pri učitavanju hrane:", err);
      }
    };
    fetchHrana();
  }, []);

  const dodajNamirnicu = () => {
    setObrok({
      ...obrok,
      namirnice: [
        ...obrok.namirnice,
        { hrana_id: null, custom_naziv: "", kolicina: "", kalorije_na_100g: "", kalorije: 0 }
      ]
    });
  };

  const obrisiNamirnicu = (index) => {
    const temp = [...obrok.namirnice];
    temp.splice(index, 1);
    setObrok({ ...obrok, namirnice: temp });
  };

  const handleNamirnicaChange = (index, field, value) => {
    const temp = [...obrok.namirnice];

    if (field === "custom_naziv") {
      temp[index].custom_naziv = value;

      const predlozi = hrana.filter(h =>
        h.naziv.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredHrana(predlozi);
      setFocusIndex(index);
      setActiveSuggestion(0);

      const izabrana = hrana.find(h => h.naziv.toLowerCase() === value.toLowerCase());
      if (izabrana) {
        temp[index].hrana_id = izabrana.id;
        temp[index].kalorije_na_100g = izabrana.kalorije;
        temp[index].kalorije = temp[index].kolicina
          ? Math.round((izabrana.kalorije / 100) * temp[index].kolicina)
          : 0;
      } else {
        temp[index].hrana_id = null;
        temp[index].kalorije_na_100g = temp[index].kalorije || 0;
      }
    }

    if (field === "kolicina") {
      temp[index].kolicina = value;
      if (temp[index].hrana_id) {
        const izabrana = hrana.find(h => h.id === temp[index].hrana_id);
        if (izabrana) temp[index].kalorije = Math.round((izabrana.kalorije / 100) * value);
      } else if (temp[index].kalorije_na_100g) {
        temp[index].kalorije = Math.round((value * temp[index].kalorije_na_100g) / 100);
      }
    }

    if (field === "kalorije_na_100g") {
      temp[index].kalorije_na_100g = value;
      if (!temp[index].hrana_id && temp[index].kolicina) {
        temp[index].kalorije = Math.round((value * temp[index].kolicina) / 100);
      }
    }

    setObrok({ ...obrok, namirnice: temp });
  };

  const handleSelectHrana = (index, h) => {
    const temp = [...obrok.namirnice];
    temp[index].custom_naziv = h.naziv;
    temp[index].hrana_id = h.id;
    temp[index].kalorije_na_100g = h.kalorije;
    temp[index].kalorije = temp[index].kolicina
      ? Math.round((h.kalorije / 100) * temp[index].kolicina)
      : 0;

    setObrok({ ...obrok, namirnice: temp });
    setFilteredHrana([]);
    setFocusIndex(null);
    setActiveSuggestion(0);
  };

  const handleKeyDown = (e, index) => {
    if (!filteredHrana.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestion(prev => (prev + 1) % filteredHrana.length);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestion(prev => (prev - 1 + filteredHrana.length) % filteredHrana.length);
    }
    if (e.key === "Enter") {
      e.preventDefault();
      handleSelectHrana(index, filteredHrana[activeSuggestion]);
    }
  };

  const sacuvajObrok = async () => {
    try {
      const payload = obrok.namirnice.map(n => ({
        hrana_id: n.hrana_id || null,
        custom_naziv: n.custom_naziv || null,
        kolicina: Number(n.kolicina),
        kalorije: n.kalorije || Math.round((Number(n.kolicina) * Number(n.kalorije_na_100g || 0)) / 100),
        kalorije_na_100g: Number(n.kalorije_na_100g || 0)
      }));

      await axiosClient.post('/obroci', {
        datum: obrok.datum,
        naziv: obrok.naziv,
        namirnice: payload
      });

      alert('Obrok uspešno dodat');
      setObrok({
        datum: new Date().toISOString().slice(0, 10),
        naziv: "",
        namirnice: [{ hrana_id: null, custom_naziv: "", kolicina: "", kalorije_na_100g: "", kalorije: 0 }]
      });
    } catch (error) {
      console.error(error);
      alert('Došlo je do greške prilikom čuvanja obroka');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Dodaj Obrok</h1>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Datum:</label>
          <input
            type="date"
            value={obrok.datum}
            onChange={e => setObrok({ ...obrok, datum: e.target.value })}
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Naziv obroka:</label>
          <input
            type="text"
            value={obrok.naziv}
            onChange={e => setObrok({ ...obrok, naziv: e.target.value })}
            placeholder="Doručak, Ručak..."
            className="border p-2 rounded w-full"
          />
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Namirnice:</h2>

        {obrok.namirnice.map((n, i) => (
          <div key={i} className="mb-4 p-4 bg-white rounded-lg shadow relative">
            <input
              type="text"
              placeholder="Naziv namirnice"
              value={n.custom_naziv || ""}
              onChange={e => handleNamirnicaChange(i, 'custom_naziv', e.target.value)}
              onFocus={() => setFocusIndex(i)}
              onKeyDown={e => handleKeyDown(e, i)}
              className="border p-2 rounded w-full mb-2"
            />

            {filteredHrana.length > 0 && i === focusIndex && (
              <ul className="border rounded bg-white max-h-40 overflow-auto mb-2 absolute z-50 w-full">
                {filteredHrana.map((h, idx) => (
                  <li
                    key={h.id}
                    className={`px-2 py-1 cursor-pointer ${
                      idx === activeSuggestion ? "bg-blue-100 font-semibold" : "hover:bg-blue-50"
                    }`}
                    onClick={() => handleSelectHrana(i, h)}
                  >
                    {h.naziv} ({h.kalorije} kcal/100g)
                  </li>
                ))}
              </ul>
            )}

            <input
              type="number"
              placeholder="Količina (g/kom)"
              value={n.kolicina}
              onChange={e => handleNamirnicaChange(i, 'kolicina', e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />

            {!n.hrana_id && (
              <input
                type="number"
                placeholder="Kalorije na 100g"
                value={n.kalorije_na_100g}
                onChange={e => handleNamirnicaChange(i, 'kalorije_na_100g', e.target.value)}
                className="border p-2 rounded w-full mb-2"
              />
            )}

            <div className="flex justify-between items-center">
              <span className="font-medium">Kalorije: {n.kalorije}</span>
              <button
                type="button"
                onClick={() => obrisiNamirnicu(i)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Obriši
              </button>
            </div>
          </div>
        ))}

        <div className="flex gap-3 mb-6">
          <button
            type="button"
            onClick={dodajNamirnicu}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Dodaj namirnicu
          </button>

          <button
            type="button"
            onClick={sacuvajObrok}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Sačuvaj obrok
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
