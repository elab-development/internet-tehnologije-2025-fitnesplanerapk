import React, { useEffect, useState, useMemo } from "react";
import axiosClient from "./axios-client.js";
import Header from "../components/Header.jsx";
import Button from "../components/Button.jsx";
import Footer from "../components/Footer.jsx";

export default function TrenerStranica() {
  const [vezbe, setVezbe] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [nazivTreninga, setNazivTreninga] = useState("");
  const [selectedVezbe, setSelectedVezbe] = useState([]);
  const [isPublic, setIsPublic] = useState(true);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  const [selectedKategorija, setSelectedKategorija] = useState("sve");
  const [searchTerm, setSearchTerm] = useState("");

  const getYoutubeThumbnail = (url) => {
    if (!url) return null;
    const regExp =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return match
      ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
      : null;
  };

  useEffect(() => {
    const fetchVezbe = async () => {
      try {
        const response = await axiosClient.get("/vezbe");
        setVezbe(response.data);
      } catch (err) {
        setError("Greška prilikom učitavanja vežbi.");
      } finally {
        setLoading(false);
      }
    };
    fetchVezbe();
  }, []);

  const kategorije = useMemo(() => {
    return ["sve", ...new Set(vezbe.map((v) => v.kategorija).filter(Boolean))];
  }, [vezbe]);

  const filtriraneVezbe = useMemo(() => {
    return vezbe
      .filter((v) =>
        selectedKategorija === "sve" ? true : v.kategorija === selectedKategorija
      )
      .filter((v) => v.ime.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [vezbe, selectedKategorija, searchTerm]);

  const toggleVezba = (vezba) => {
    setSelectedVezbe((prev) => {
      const exists = prev.find((v) => v.id === vezba.id);
      if (exists) return prev.filter((v) => v.id !== vezba.id);
      return [
        ...prev,
        { id: vezba.id, serija: null, ponavljanja: null, tezina: null, trajanje: null },
      ];
    });
  };

  const updateVezbaField = (id, field, value) => {
    setSelectedVezbe((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              [field]: value === "" ? null : parseInt(value, 10),
            }
          : v
      )
    );
  };

  const handleCreateProgram = async () => {
    if (!nazivTreninga || selectedVezbe.length === 0) {
      setCreateError("Morate uneti naziv treninga i odabrati bar jednu vežbu.");
      return;
    }

    setCreating(true);
    setCreateError(null);

    try {
      await axiosClient.post("/programi", {
        naziv: nazivTreninga,
        public: isPublic,
        vezbe: selectedVezbe,
      });

      alert("Trening uspešno kreiran!");
      setNazivTreninga("");
      setSelectedVezbe([]);
      setIsPublic(true);
    } catch (err) {
      setCreateError("Greška prilikom kreiranja treninga.");
    } finally {
      setCreating(false);
    }
  };

  if (loading)
    return <p className="text-center mt-20 text-lg">Učitavanje vežbi...</p>;
  if (error)
    return <p className="text-center mt-20 text-red-500 text-lg">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">
          Kreiraj novi trening
        </h1>

        {/* Forma za kreiranje */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <input
            type="text"
            placeholder="Naziv treninga"
            value={nazivTreninga}
            onChange={(e) => setNazivTreninga(e.target.value)}
            className="w-full p-4 border rounded-xl mb-6 text-lg focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex items-center gap-6 mb-6">
            <span className="font-medium text-gray-700">Vidljivost:</span>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={isPublic}
                onChange={() => setIsPublic(true)}
                className="accent-blue-500"
              />
              Public
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={!isPublic}
                onChange={() => setIsPublic(false)}
                className="accent-blue-500"
              />
              Private
            </label>
          </div>

          {createError && <p className="text-red-500 mb-4">{createError}</p>}

          <Button
            onClick={handleCreateProgram}
            disabled={creating}
            className="w-full py-4 text-lg font-semibold"
          >
            {creating ? "Kreiranje..." : "Kreiraj trening"}
          </Button>
        </div>

        {/* Filter + search */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <input
            type="text"
            placeholder="Pretraži vežbe po imenu"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2 border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={selectedKategorija}
            onChange={(e) => setSelectedKategorija(e.target.value)}
            className="border rounded-xl px-4 py-2 bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            {kategorije.map((kat) => (
              <option key={kat} value={kat}>
                {kat === "sve" ? "Sve kategorije" : kat}
              </option>
            ))}
          </select>
        </div>

        {/* Grid vežbi */}
        {filtriraneVezbe.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtriraneVezbe.map((v) => {
              const thumbnail = getYoutubeThumbnail(v.snimak);
              const selectedObj = selectedVezbe.find((sv) => sv.id === v.id);
              const selected = !!selectedObj;

              return (
                <div
                  key={v.id}
                  onClick={() => toggleVezba(v)}
                  className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition border-2 cursor-pointer overflow-hidden ${
                    selected ? "border-blue-500 scale-105" : "border-transparent"
                  }`}
                >
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={v.ime}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="h-48 flex items-center justify-center bg-gray-200 text-gray-500">
                      Nema preview
                    </div>
                  )}

                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{v.ime}</h3>

                    {v.kategorija && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                        {v.kategorija}
                      </span>
                    )}

                    {selected && (
                      <div
                        className="flex flex-col gap-2 mt-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="serija"
                            value={selectedObj.serija ?? ""}
                            onChange={(e) =>
                              updateVezbaField(v.id, "serija", e.target.value)
                            }
                            className="w-1/2 border rounded-lg p-2 text-sm"
                          />
                          <input
                            type="number"
                            placeholder="Ponavljanja"
                            value={selectedObj.ponavljanja ?? ""}
                            onChange={(e) =>
                              updateVezbaField(v.id, "ponavljanja", e.target.value)
                            }
                            className="w-1/2 border rounded-lg p-2 text-sm"
                          />
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="Težina (kg)"
                            value={selectedObj.tezina ?? ""}
                            onChange={(e) =>
                              updateVezbaField(v.id, "tezina", e.target.value)
                            }
                            className="w-1/2 border rounded-lg p-2 text-sm"
                          />
                          <input
                            type="number"
                            placeholder="Trajanje (min)"
                            value={selectedObj.trajanje ?? ""}
                            onChange={(e) =>
                              updateVezbaField(v.id, "trajanje", e.target.value)
                            }
                            className="w-1/2 border rounded-lg p-2 text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 shadow text-center text-gray-500 text-lg">
            Nema vežbi koje odgovaraju kriterijumu
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}