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
  const [recipe, setRecipe] = useState(null);
  const [hrana, setHrana] = useState([]);
  const [filteredHrana, setFilteredHrana] = useState([]);
  const [focusIndex, setFocusIndex] = useState(null);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [showRecipePopup, setShowRecipePopup] = useState(false);

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

  // Recept dana
  useEffect(() => {
    fetch("https://www.themealdb.com/api/json/v1/1/random.php")
      .then(res => res.json())
      .then(data => setRecipe(data.meals[0]))
      .catch(err => console.error(err));
  }, []);

  // Učitavanje lokalne hrane
  useEffect(() => {
    axiosClient.get("/hrana")
      .then(res => setHrana(res.data))
      .catch(err => console.error(err));
  }, []);

  // Edit mode: učitaj obrok
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

  // Autocomplete
  const fetchPredlozi = async (value, index) => {
    const predloziLocal = hrana.filter(h =>
      h.naziv.toLowerCase().includes(value.toLowerCase())
    );

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
          const kcal = f.foodNutrients?.find(
            n => n.nutrientName === "Energy" && n.unitName === "KCAL"
          )?.value;
          return { naziv: f.description, kalorije: kcal || 0 };
        }) || [];
      } catch (err) {
        console.error("USDA API error:", err);
      }
    }

    setFilteredHrana([...predloziLocal, ...predloziUSDA]);
    setFocusIndex(index);
    setActiveSuggestion(0);
  };

  const debouncedFetchPredlozi = debounce(fetchPredlozi, 300);

  const handleNamirnicaChange = (index, value) => {
    const temp = [...obrok.namirnice];
    temp[index].custom_naziv = value;
    setObrok({ ...obrok, namirnice: temp });
    debouncedFetchPredlozi(value, index);
  };

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

      {/* Recept dana sidebar */}
      <aside className="fixed top-20 right-4 w-72 bg-white p-4 rounded-xl shadow-lg z-50 hidden lg:flex flex-col items-center gap-3">
        {recipe ? (
          <>
            <img src={recipe.strMealThumb} alt={recipe.strMeal} className="rounded-xl mb-2 w-full object-cover shadow-sm"/>
            <h3 className="font-semibold text-center text-lg">{recipe.strMeal}</h3>
            <Button
              className="text-sm px-4 py-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition"
              onClick={() => setShowRecipePopup(true)}
            >
              Pogledaj recept
            </Button>
          </>
        ) : (
          <p className="text-gray-500 text-sm">Učitavanje...</p>
        )}
      </aside>

      <main className="flex-grow max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section className="flex flex-col">
          <h1 className="text-3xl font-bold mb-6">{editMode ? "Izmeni Obrok" : "Dodaj Obrok"}</h1>

          {/* Datum i naziv obroka */}
          <input
            type="date"
            value={obrok.datum}
            onChange={e => setObrok({ ...obrok, datum: e.target.value })}
            className="border p-3 rounded-xl w-full mb-4 focus:ring-2 focus:ring-green-400 focus:outline-none transition"
          />
          <input
            type="text"
            placeholder="Naziv obroka (Doručak, Ručak...)"
            value={obrok.naziv}
            onChange={e => setObrok({ ...obrok, naziv: e.target.value })}
            className="border p-3 rounded-xl w-full mb-6 focus:ring-2 focus:ring-green-400 focus:outline-none transition"
          />

          {/* Namirnice */}
          {obrok.namirnice.map((n, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl shadow-md mb-5 relative transition hover:shadow-lg">
              <input
                type="text"
                placeholder="Naziv namirnice"
                value={n.custom_naziv}
                onChange={e => handleNamirnicaChange(i, e.target.value)}
                className="border p-3 rounded-xl w-full mb-2 focus:ring-2 focus:ring-green-300 focus:outline-none transition"
              />

              {focusIndex === i && filteredHrana.length > 0 && (
                <ul className="absolute z-50 bg-white border rounded-xl w-full max-h-48 overflow-y-auto shadow-lg mt-1">
                  {filteredHrana.map((h, idx) => (
                    <li
                      key={idx}
                      className={`p-3 cursor-pointer hover:bg-green-100 transition rounded-lg ${activeSuggestion === idx ? "bg-green-50" : ""}`}
                      onClick={() => handleSelectHrana(i, h)}
                    >
                      {h.naziv} {h.kalorije ? `- ${h.kalorije} kcal/100g` : ""}
                    </li>
                  ))}
                </ul>
              )}

              <div className="grid grid-cols-2 gap-4 mb-3">
                <input
                  type="number"
                  placeholder="Količina (g)"
                  value={n.kolicina}
                  onChange={e => handleKolicinaChange(i, "kolicina", e.target.value)}
                  className="border p-3 rounded-xl focus:ring-2 focus:ring-green-300 focus:outline-none transition"
                />
                {!n.hrana_id && (
                  <input
                    type="number"
                    placeholder="Kalorije na 100g"
                    value={n.kalorije_na_100g}
                    onChange={e => handleKolicinaChange(i, "kalorije_na_100g", e.target.value)}
                    className="border p-3 rounded-xl focus:ring-2 focus:ring-green-300 focus:outline-none transition"
                  />
                )}
              </div>

              <div className="flex justify-between items-center mt-2">
                <span className="font-semibold text-green-600">Kalorije: {n.kalorije}</span>
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full transition"
                  onClick={() => obrisiNamirnicu(i)}
                >
                  Obriši
                </Button>
              </div>
            </div>
          ))}

          {/* Dugmad */}
          <div className="flex flex-wrap gap-4 mt-3">
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full transition"
              onClick={dodajNamirnicu}
            >
              Dodaj namirnicu
            </Button>
            <Button
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full transition"
              onClick={sacuvajObrok}
            >
              {editMode ? "Sačuvaj izmene" : "Sačuvaj obrok"}
            </Button>
            {editMode && (
              <Button
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full transition"
                onClick={obrisiObrok}
              >
                Obriši obrok
              </Button>
            )}
          </div>
        </section>

        {/* Recept dana mobilni */}
        <section className="lg:hidden bg-white p-4 rounded-xl shadow-lg">
          {recipe ? (
            <>
              <img src={recipe.strMealThumb} alt={recipe.strMeal} className="rounded-xl mb-3 w-full object-cover"/>
              <h3 className="font-semibold text-center text-lg">{recipe.strMeal}</h3>
              <Button
                className="text-sm px-4 py-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition w-full"
                onClick={() => setShowRecipePopup(true)}
              >
                Pogledaj recept
              </Button>
            </>
          ) : (
            <p className="text-gray-500 text-sm">Učitavanje...</p>
          )}
        </section>
      </main>

      <Footer />

      {/* Modal */}
      {showRecipePopup && recipe && (
        <div className="fixed inset-0 flex justify-center items-start pt-20 z-50">
          <div
            className="absolute inset-0 backdrop-blur-sm bg-black/30"
            onClick={() => setShowRecipePopup(false)}
          ></div>

          <div className="relative bg-white rounded-2xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 z-50">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg font-bold"
              onClick={() => setShowRecipePopup(false)}
            >
              ✖
            </button>
            <img src={recipe.strMealThumb} alt={recipe.strMeal} className="rounded-xl mb-4 w-full object-cover"/>
            <h2 className="text-2xl font-bold mb-2">{recipe.strMeal}</h2>
            <p className="text-sm text-gray-600 mb-2">{recipe.strCategory} • {recipe.strArea}</p>
            <p className="text-sm mb-3 whitespace-pre-line">{recipe.strInstructions}</p>
            {recipe.strYoutube && (
              <a
                href={recipe.strYoutube}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 hover:underline"
              >
                Pogledaj video recept
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}