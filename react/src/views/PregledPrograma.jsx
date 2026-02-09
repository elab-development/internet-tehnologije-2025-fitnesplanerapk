import { useEffect, useState } from "react";
import axiosClient from "./axios-client.js";
import Header from "../components/Header.jsx";
import Button from "../components/Button.jsx";

export default function PregledPrograma() {
  const [programi, setProgrami] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otvorenProgram, setOtvorenProgram] = useState(null);

  useEffect(() => {
    fetchProgrami();
  }, []);

  const fetchProgrami = async () => {
    try {
      const res = await axiosClient.get("/programi");
      setProgrami(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const obrisiProgram = async (id) => {
    if (!window.confirm("Da li ste sigurni da želite da obrišete program?")) return;
    try {
      await axiosClient.delete(`/programi/${id}`);
      fetchProgrami();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return <p className="text-center mt-10">Učitavanje programa...</p>;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Moji treninzi</h1>

        {programi.length === 0 ? (
          <p className="text-gray-500">Još uvek nemate nijedan kreiran program.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {programi.map((program) => (
              <div
                key={program.id}
                className="bg-surface rounded-xl shadow p-6 cursor-pointer"
                onClick={() =>
                  setOtvorenProgram(otvorenProgram === program.id ? null : program.id)
                }
              >
                {/* Naziv programa i dugme za brisanje */}
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold">{program.naziv}</h2>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      obrisiProgram(program.id);
                    }}
                    variant="danger"
                  >
                    Obriši
                  </Button>
                </div>

                
                <div className="text-sm text-gray-600 mb-4">
                  {program.trajanje && <span>Trajanje: {program.trajanje} min | </span>}
                  {program.kalorije && <span>Kalorije: {program.kalorije.toFixed(0)} kcal | </span>}
                  {program.intenzitet && <span>Intenzitet: {program.intenzitet}</span>}
                </div>

               
                {otvorenProgram === program.id && program.vezbe?.length > 0 && (
                  <div className="mt-4 pl-4 border-l space-y-4">
                    {Object.entries(
                      program.vezbe.reduce((acc, v) => {
                        const dan = v.pivot?.dan || 1;
                        if (!acc[dan]) acc[dan] = [];
                        acc[dan].push(v);
                        return acc;
                      }, {})
                    ).map(([dan, vezbe]) => (
                      <div key={dan}>
                        <h3 className="font-semibold mb-1">Dan {dan}</h3>
                        <ul className="list-disc pl-6 space-y-1">
                          {vezbe.map((v) => (
                            <li key={v.id}>
                              <span className="font-medium">{v.ime}</span>{" "}
                              {v.pivot?.serija && `| Serije: ${v.pivot.serija}`}{" "}
                              {v.pivot?.ponavljanja && `| Ponavljanja: ${v.pivot.ponavljanja}`}{" "}
                              {v.pivot?.tezina && `| Težina: ${v.pivot.tezina} kg`}{" "}
                              {v.pivot?.trajanje && `| Trajanje: ${v.pivot.trajanje} min`}{" "}
                              {v.pivot?.bpm && `| BPM: ${v.pivot.bpm}`}
                              <a
                                href={v.snimak}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline ml-2 text-sm"
                              >
                                Pogledaj snimak
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {otvorenProgram === program.id && program.vezbe?.length === 0 && (
                  <p className="text-gray-500 mt-2">Nema vežbi u ovom programu</p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
