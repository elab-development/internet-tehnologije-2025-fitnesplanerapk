import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "./axios-client";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Button from "../components/Button.jsx";

// Debounce helper
const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export default function Ishrana() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editMode = !!id;

  const [hrana, setHrana] = useState([]); // lokalna baza
  const [filteredHrana, setFilteredHrana] = useState([]);
  const [focusIndex, setFocusIndex] = useState(null);
  const [activeSuggestion, setActiveSuggestion] = useState(0);

  const [obrok, setObrok] = useState({
    datum: new Date().toISOString().slice(0, 10),
    naziv: "",
    namirnice: [
      {
        hrana_id: null,
        custom_naziv: "",
        kolicina: "",
        kalorije_na_100g: "",
        kalorije: 0
      }
    ]
  });

  // Učitavanje lokalne hrane
  useEffect(() => {
    axiosClient.get("/hrana")
      .then(res => setHrana(res.data))
      .catch(err => console.error(err));
  }, []);

  // Ako je edit → učitaj obrok
  useEffect(() => {
    if (editMode) {
      axiosClient.get(`/obroci/${id}`)
        .then(({ data }) => {
          setObrok({
            datum: data.datum,
            naziv: data.naziv,
            namirnice: data.namirnice?.map(n => ({
              id: n.id,
              hrana_id: n.hrana_id,
              custom_naziv: n.custom_naziv || n.hrana?.naziv || "",
              kolicina: n.kolicina,
              kalorije_na_100g: n.kalorije_na_100g,
              kalorije: n.kalorije
            })) || []
          });
        })
        .catch(err => console.error(err));
    }
  }, [editMode, id]);

  // Dodavanje/brisanje namirnica
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

 // Funkcija koja kombinuje lokalnu bazu i USDA API
const fetchPredlozi = async (value, index) => {
  // 1️⃣ Filtriraj predloge iz lokalne baze
  const predloziLocal = hrana.filter(h =>
    h.naziv.toLowerCase().includes(value.toLowerCase())
  );

  // 2️⃣ Poziv USDA API za dodatne predloge
  let predloziUSDA = [];
  if (value.length > 2) {
    try {
      const res = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(
          value
        )}&pageSize=5&api_key=ss6hPlTYf5corvmMExs0M6auVFfJfhl9Vnu5DfT3`
      );
      const data = await res.json();

      predloziUSDA = data.foods?.map(f => {
        // Nađi kalorije po 100g
        const kcal = f.foodNutrients?.find(
          n => n.nutrientName === "Energy" && n.unitName === "KCAL"
        )?.value;

        return {
          naziv: f.description,
          kalorije: kcal || 0
        };
      }) || [];
    } catch (err) {
      console.error("USDA API error:", err);
    }
  }

  // 3️⃣ Kombinuj predloge i prikaži
  setFilteredHrana([...predloziLocal, ...predloziUSDA]);
  setFocusIndex(index);
  setActiveSuggestion(0);
};

  const debouncedFetchPredlozi = debounce(fetchPredlozi, 300);

  // Promena inputa za naziv namirnice
  const handleNamirnicaChange = (index, value) => {
    const temp = [...obrok.namirnice];
    temp[index].custom_naziv = value;
    setObrok({ ...obrok, namirnice: temp });

    debouncedFetchPredlozi(value, index);
  };

  // Izbor predloga
  const handleSelectHrana = (index, h) => {
    const temp = [...obrok.namirnice];
    temp[index].custom_naziv = h.naziv;
    temp[index].kalorije_na_100g = h.kalorije || 0;
    temp[index].hrana_id = h.id || null;

    if (temp[index].kolicina) {
      temp[index].kalorije = Math.round((temp[index].kolicina * temp[index].kalorije_na_100g) / 100);
    }

    setObrok({ ...obrok, namirnice: temp });
    setFilteredHrana([]);
    setFocusIndex(null);
  };

  // Promena količine ili kalorija na 100g
  const handleKolicinaChange = (index, field, value) => {
    const temp = [...obrok.namirnice];
    temp[index][field] = value;

    const kolicina = Number(temp[index].kolicina);
    const kcal100 = Number(temp[index].kalorije_na_100g);
    if (kolicina && kcal100) {
      temp[index].kalorije = Math.round((kolicina * kcal100) / 100);
    }

    setObrok({ ...obrok, namirnice: temp });
  };

  // Čuvanje i brisanje obroka
  const sacuvajObrok = async () => {
    try {
      const payload = {
        datum: obrok.datum,
        naziv: obrok.naziv,
        namirnice: obrok.namirnice.map(n => ({
          id: n.id || null,
          hrana_id: n.hrana_id || null,
          custom_naziv: n.custom_naziv || null,
          kolicina: Number(n.kolicina),
          kalorije: n.kalorije,
          kalorije_na_100g: Number(n.kalorije_na_100g)
        }))
      };

      if (editMode) {
        await axiosClient.put(`/obroci/${id}`, payload);
        alert("Obrok uspešno izmenjen");
      } else {
        await axiosClient.post("/obroci", payload);
        alert("Obrok uspešno dodat");
      }

      navigate("/obrociPregled");
    } catch (error) {
      console.error(error);
      alert("Greška pri čuvanju obroka");
    }
  };

  const obrisiObrok = async () => {
    if (!window.confirm("Da li ste sigurni da želite da obrišete ovaj obrok?")) return;
    try {
      await axiosClient.delete(`/obroci/${id}`);
      alert("Obrok uspešno obrisan");
      navigate("/obrociPregled");
    } catch (error) {
      console.error(error);
      alert("Greška pri brisanju obroka");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">{editMode ? "Izmeni Obrok" : "Dodaj Obrok"}</h1>

        <input
          type="date"
          value={obrok.datum}
          onChange={e => setObrok({ ...obrok, datum: e.target.value })}
          className="border p-2 rounded w-full mb-4"
        />

        <input
          type="text"
          placeholder="Naziv obroka (Doručak, Ručak...)"
          value={obrok.naziv}
          onChange={e => setObrok({ ...obrok, naziv: e.target.value })}
          className="border p-2 rounded w-full mb-6"
        />

        {obrok.namirnice.map((n, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow mb-4 relative">
            <input
              type="text"
              placeholder="Naziv namirnice"
              value={n.custom_naziv}
              onChange={e => handleNamirnicaChange(i, e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />

            {focusIndex === i && filteredHrana.length > 0 && (
              <ul className="absolute z-10 bg-white border rounded w-full max-h-48 overflow-y-auto">
                {filteredHrana.map((h, idx) => (
                  <li
                    key={idx}
                    className={`p-2 cursor-pointer hover:bg-gray-200 ${activeSuggestion === idx ? "bg-gray-100" : ""}`}
                    onClick={() => handleSelectHrana(i, h)}
                  >
                    {h.naziv} {h.kalorije ? `- ${h.kalorije} kcal/100g` : ""}
                  </li>
                ))}
              </ul>
            )}

            <input
              type="number"
              placeholder="Količina (g)"
              value={n.kolicina}
              onChange={e => handleKolicinaChange(i, "kolicina", e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />

            {!n.hrana_id && (
              <input
                type="number"
                placeholder="Kalorije na 100g"
                value={n.kalorije_na_100g}
                onChange={e => handleKolicinaChange(i, "kalorije_na_100g", e.target.value)}
                className="border p-2 rounded w-full mb-2"
              />
            )}

            <div className="flex justify-between items-center">
              <span className="font-semibold">Kalorije: {n.kalorije}</span>
              <Button onClick={() => obrisiNamirnicu(i)}>Obriši</Button>
            </div>
          </div>
        ))}

        <div className="flex gap-4">
          <Button onClick={dodajNamirnicu}>Dodaj namirnicu</Button>
          <Button onClick={sacuvajObrok}>{editMode ? "Sačuvaj izmene" : "Sačuvaj obrok"}</Button>
          {editMode && <Button onClick={obrisiObrok} className="bg-red-500 hover:bg-red-600">Obriši obrok</Button>}
        </div>
      </main>
      <Footer />
    </div>
  );
}