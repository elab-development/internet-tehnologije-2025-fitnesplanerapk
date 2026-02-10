import React, { useEffect, useState } from "react";
import axiosClient from "./axios-client.js";
import Header from "../components/Header.jsx";
import Button from "../components/Button.jsx";
import Footer from "../components/Footer.jsx";

export default function TrenerStranica() {
  const [vezbe, setVezbe] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVezbe, setSelectedVezbe] = useState({});
  const [nazivPrograma, setNazivPrograma] = useState("");
  const [dan, setDan] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [programiTrenera, setProgramiTrenera] = useState([]);

  
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
        console.log(err);
        setError("Greška prilikom učitavanja vežbi.");
      } finally {
        setLoading(false);
      }
    };
    fetchVezbe();
  }, []);

 
  const toggleVezbaSelection = (id) => {
    setSelectedVezbe((prev) => {
      if (prev[id]) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return {
        ...prev,
        [id]: { serija: "", ponavljanja: "", tezina: "", trajanje: "", bpm: "" },
      };
    });
  };

  
  const kreirajProgram = async () => {
    if (!nazivPrograma.trim()) {
      alert("Unesi naziv programa.");
      return;
    }
    if (Object.keys(selectedVezbe).length === 0) {
      alert("Izaberi bar jednu vežbu.");
      return;
    }

    const payload = {
      naziv: nazivPrograma,
      vezbe: Object.entries(selectedVezbe).map(([id, podaci]) => ({
        id: Number(id),
        dan: dan,
        serija: podaci.serija,
        ponavljanja: podaci.ponavljanja,
        tezina: podaci.tezina,
        trajanje: podaci.trajanje,
        bpm: podaci.bpm,
      })),
    };

    try {
      await axiosClient.post("/programi", payload);
      alert("Program je uspešno kreiran!");

      
      setNazivPrograma("");
      setSelectedVezbe({});
      setDan(1);
    } catch (err) {
      console.error(err);
      alert("Greška pri kreiranju programa.");
    }
  };

  
  const fetchProgramiTrenera = async () => {
    try {
      const res = await axiosClient.get("/programi/treneri");
      setProgramiTrenera(res.data);
      setShowModal(true);
    } catch (err) {
      console.error(err);
      alert("Greška pri učitavanju programa trenera");
    }
  };

  const izaberiProgram = (program) => {
    setNazivPrograma(program.naziv + " (preuzet)");
    setSelectedVezbe({});

    const noveVezbe = {};
    program.vezbe.forEach((v) => {
      noveVezbe[v.id] = {
        serija: v.pivot.serija || "",
        ponavljanja: v.pivot.ponavljanja || "",
        tezina: v.pivot.tezina || "",
        trajanje: v.pivot.trajanje || "",
        bpm: v.pivot.bpm || "",
      };
      setDan(v.pivot.dan);
    });

    setSelectedVezbe(noveVezbe);
    setShowModal(false);
  };

  if (loading)
    return <p className="text-center mt-10">Učitavanje vežbi...</p>;

  if (error)
    return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-8">
       
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-textPrimary">
            Prikaz vežbi za kreiranje treninga
          </h1>
          <Button onClick={fetchProgramiTrenera}>
            Izaberi trening trenera
          </Button>
        </div>

       
        <div className="bg-surface rounded-xl shadow p-6 mb-8 max-w-3xl">
          <h2 className="text-xl font-semibold mb-4">Kreiranje treninga</h2>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm mb-1">Naziv treninga</label>
              <input
                type="text"
                value={nazivPrograma}
                onChange={(e) => setNazivPrograma(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="npr. Snaga – gornji deo tela"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Dan izvođenja</label>
              <input
                type="number"
                min="1"
                value={dan}
                onChange={(e) => setDan(Number(e.target.value))}
                className="w-32 border rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </div>

       
        {vezbe.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {vezbe.map((v) => {
              const thumbnail = getYoutubeThumbnail(v.snimak);

              return (
                <div
                  key={v.id}
                  className={`bg-surface rounded-xl shadow overflow-hidden hover:shadow-lg transition ${
                    v.id in selectedVezbe ? "border-4 border-blue-500" : ""
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
                    <h2 className="text-lg font-semibold mb-2">{v.ime}</h2>

                    <label className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={v.id in selectedVezbe}
                        onChange={() => toggleVezbaSelection(v.id)}
                        className="accent-blue-500"
                      />
                      Dodaj u trening
                    </label>

                    {selectedVezbe[v.id] && (
                      <div className="mt-2 space-y-1 text-sm">
                        <input
                          type="number"
                          placeholder="Serije"
                          className="border rounded px-2 py-1 w-full"
                          value={selectedVezbe[v.id].serija}
                          onChange={(e) =>
                            setSelectedVezbe((prev) => ({
                              ...prev,
                              [v.id]: {
                                ...prev[v.id],
                                serija: e.target.value,
                              },
                            }))
                          }
                        />
                        <input
                          type="number"
                          placeholder="Ponavljanja"
                          className="border rounded px-2 py-1 w-full"
                          value={selectedVezbe[v.id].ponavljanja}
                          onChange={(e) =>
                            setSelectedVezbe((prev) => ({
                              ...prev,
                              [v.id]: {
                                ...prev[v.id],
                                ponavljanja: e.target.value,
                              },
                            }))
                          }
                        />
                        <input
                          type="number"
                          placeholder="Težina (kg)"
                          className="border rounded px-2 py-1 w-full"
                          value={selectedVezbe[v.id].tezina}
                          onChange={(e) =>
                            setSelectedVezbe((prev) => ({
                              ...prev,
                              [v.id]: {
                                ...prev[v.id],
                                tezina: e.target.value,
                              },
                            }))
                          }
                        />
                        <input
                          type="number"
                          placeholder="Trajanje (min)"
                          value={selectedVezbe[v.id].trajanje}
                          onChange={(e) =>
                            setSelectedVezbe((prev) => ({
                              ...prev,
                              [v.id]: {
                                ...prev[v.id],
                                trajanje: e.target.value,
                              },
                            }))
                          }
                          className="border rounded px-2 py-1 w-full"
                        />
                        <input
                          type="number"
                          placeholder="BPM"
                          value={selectedVezbe[v.id].bpm}
                          onChange={(e) =>
                            setSelectedVezbe((prev) => ({
                              ...prev,
                              [v.id]: {
                                ...prev[v.id],
                                bpm: e.target.value,
                              },
                            }))
                          }
                          className="border rounded px-2 py-1 w-full"
                        />
                      </div>
                    )}

                    <a
                      href={v.snimak}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline"
                    >
                      Pogledaj snimak
                    </a>
                  </div>
                </div>
              );
            })}
            {/* <Button onClick={kreirajProgram}>Kreiraj trening</Button> */}
          </div>
        ) : (
          <div className="bg-surface rounded-xl p-6 shadow text-center text-gray-500">
            Trenutno nema dostupnih vežbi
          </div>
        )}

       
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-lg">
              <h2 className="text-xl font-semibold mb-4">Programi trenera</h2>
              <div className="space-y-3 max-h-80 overflow-auto">
                {programiTrenera.map((p) => (
                  <div
                    key={p.id}
                    className="border p-3 rounded cursor-pointer hover:bg-blue-100"
                    onClick={() => izaberiProgram(p)}
                  >
                    <h3 className="font-semibold">{p.naziv}</h3>
                    <p className="text-sm text-gray-500">
                      Trener: {p.korisnik.ime} {p.korisnik.prezime}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-right">
                <Button onClick={() => setShowModal(false)}>Zatvori</Button>
              </div>
            </div>
          </div>
        )}
        <Button onClick={kreirajProgram}>Kreiraj trening</Button>
      </main>

      <Footer />
    </div>
  );
}
