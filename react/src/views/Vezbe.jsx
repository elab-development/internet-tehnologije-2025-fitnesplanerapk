import React, { useEffect, useState } from "react";
import axiosClient from "./axios-client.js";
import Header from "../components/Header.jsx";
import Button from "../components/Button.jsx";
import Footer from "../components/Footer.jsx";

export default function TrenerStranica() {
  const [vezbe, setVezbe] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVezbe, setSelectedVezbe] = useState([]);
  const [nazivPrograma, setNazivPrograma] = useState("");
const [dan, setDan] = useState(1);


  


  const getYoutubeThumbnail = (url) => {
    if (!url) return null;

    const regExp =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);

        return match
        ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
        };

        useEffect(() => {
            const fetchVezbe = async () => {
            try {
                const response = await axiosClient.get("/vezbe");
                setVezbe(response.data);
                setLoading(false);
            } catch (err) {
                console.log(err);
                setError("Greška prilikom učitavanja vežbi.");
                setLoading(false);
            }
            };

            fetchVezbe();
        }, []);

        const toggleVezbaSelection = (id) => {
    setSelectedVezbe((prev) => {
        if (prev.includes(id)) {
            return prev.filter((vid) => vid !== id); // ukloni ako je već selektovana
        } else {
            return [...prev, id]; // dodaj ako nije
        }
    });
};





const kreirajProgram = async () => {
  if (!nazivPrograma.trim()) {
    alert("Unesi naziv programa.");
    return;
  }

  if (selectedVezbe.length === 0) {
    alert("Izaberi bar jednu vežbu.");
    return;
  }

  const payload = {
    naziv: nazivPrograma,
    vezbe: selectedVezbe.map((id) => ({
      id,
      dan: dan
    }))
  };

  try {
    await axiosClient.post("/programi", payload);
    alert("Program je uspešno kreiran!");

    // reset
    setNazivPrograma("");
    setSelectedVezbe([]);
    setDan(1);
  } catch (err) {
    console.error(err);
    alert("Greška pri kreiranju programa.");
  }
};




        if (loading)
            return <p className="text-center mt-10">Učitavanje vežbi...</p>;

        if (error)
            return <p className="text-center mt-10 text-red-500">{error}</p>;

        return (
            <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1 max-w-7xl mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold text-textPrimary mb-6">
                Prikaz vežbi za kreiranje treninga
                </h1>








                <div className="bg-surface rounded-xl shadow p-6 mb-8 max-w-3xl">
  <h2 className="text-xl font-semibold mb-4">Kreiranje treninga</h2>

  <div className="flex flex-col gap-4">
    {/* Naziv programa */}
    <div>
      <label className="block text-sm mb-1">Naziv programa</label>
      <input
        type="text"
        value={nazivPrograma}
        onChange={(e) => setNazivPrograma(e.target.value)}
        className="w-full border rounded-lg px-3 py-2"
        placeholder="npr. Snaga – gornji deo tela"
      />
    </div>

    {/* Dan */}
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
                           className={`bg-surface rounded-xl shadow overflow-hidden hover:shadow-lg transition
                            ${selectedVezbe.includes(v.id) ? "border-4 border-blue-500" : ""}`}
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
                                     checked={selectedVezbe.includes(v.id)}
                                    onChange={() => toggleVezbaSelection(v.id)}
                                    className="accent-blue-500"
                        />
                         Dodaj u trening
                           </label>

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
                    <Button onClick={kreirajProgram}>Kreiraj trening</Button>

                </div>
                ) : (
                <div className="bg-surface rounded-xl p-6 shadow text-center text-gray-500">
                    Trenutno nema dostupnih vežbi
                </div>
                )}
            </main>
             <Footer />
            </div>
           
        );
        }
