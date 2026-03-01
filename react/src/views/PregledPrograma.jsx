import { useEffect, useState } from "react";
import axiosClient from "./axios-client.js";
import Header from "../components/Header.jsx";
import Button from "../components/Button.jsx";

export default function PregledPrograma() {
  const [programi, setProgrami] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState({
    otvoren: false,
    program: null,
    index: 0,
  });

  useEffect(() => {
    fetchProgrami();
  }, []);

  const fetchProgrami = async () => {
    try {
      const res = await axiosClient.get("/programi/moji");
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

  const openModal = (program, startIndex = 0) => {
    setModalData({ otvoren: true, program, index: startIndex });
  };

  const closeModal = () => {
    setModalData({ otvoren: false, program: null, index: 0 });
  };

  const nextVezba = () => {
    if (!modalData.program) return;
    setModalData((prev) => ({
      ...prev,
      index: (prev.index + 1) % prev.program.vezbe.length,
    }));
  };

  const prevVezba = () => {
    if (!modalData.program) return;
    setModalData((prev) => ({
      ...prev,
      index:
        (prev.index - 1 + prev.program.vezbe.length) %
        prev.program.vezbe.length,
    }));
  };

  if (loading) return <p className="text-center mt-10">Učitavanje programa...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
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
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                {/* Naziv + brisanje */}
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold">{program.naziv}</h2>
                  <Button
                    onClick={() => obrisiProgram(program.id)}
                    variant="danger"
                  >
                    Obriši
                  </Button>
                </div>

                {/* Info */}
                <div className="text-sm text-gray-600 mb-4">
                  {program.trajanje && (
                    <span>Trajanje: {program.trajanje} min | </span>
                  )}
                  {program.kalorije && (
                    <span>
                      Kalorije: {program.kalorije.toFixed(0)} kcal |{" "}
                    </span>
                  )}
                  {program.intenzitet && (
                    <span>Intenzitet: {program.intenzitet}</span>
                  )}
                </div>

                {/* Spisak vežbi */}
                {program.vezbe && program.vezbe.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Vežbe u treningu:
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {program.vezbe.map((v) => (
                        <span
                          key={v.id}
                          className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs"
                        >
                          {v.ime}
                          {v.pivot?.serija &&
                            ` (${v.pivot.serija} x ${v.pivot?.ponavljanja ?? 0})`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <Button onClick={() => openModal(program, 0)}>
                  Preview treninga
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL */}
      {modalData.otvoren && modalData.program && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start pt-20 z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold text-2xl"
            >
              &times;
            </button>

            {modalData.program.vezbe.length > 0 ? (
              <>
                <h2 className="text-2xl font-bold mb-4">
                  {modalData.program.vezbe[modalData.index].ime}
                </h2>

                <div className="mb-4 aspect-video">
                  <iframe
                    className="w-full h-full rounded-md"
                    src={`https://www.youtube-nocookie.com/embed/${
                      modalData.program.vezbe[modalData.index].snimak
                        ?.split("v=")[1]
                        ?.split("&")[0]
                    }`}
                    title={modalData.program.vezbe[modalData.index].ime}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                <div className="text-gray-700 mb-4 space-y-1">
                  {modalData.program.vezbe[modalData.index].pivot?.serija && (
                    <p>
                      Serije:{" "}
                      {modalData.program.vezbe[modalData.index].pivot.serija}
                    </p>
                  )}
                  {modalData.program.vezbe[modalData.index].pivot
                    ?.ponavljanja && (
                    <p>
                      Ponavljanja:{" "}
                      {
                        modalData.program.vezbe[modalData.index].pivot
                          .ponavljanja
                      }
                    </p>
                  )}
                  {modalData.program.vezbe[modalData.index].pivot?.tezina && (
                    <p>
                      Težina:{" "}
                      {modalData.program.vezbe[modalData.index].pivot.tezina} kg
                    </p>
                  )}
                  {modalData.program.vezbe[modalData.index].pivot?.trajanje && (
                    <p>
                      Trajanje:{" "}
                      {modalData.program.vezbe[modalData.index].pivot.trajanje}{" "}
                      min
                    </p>
                  )}
                  {modalData.program.vezbe[modalData.index].pivot?.bpm && (
                    <p>
                      BPM:{" "}
                      {modalData.program.vezbe[modalData.index].pivot.bpm}
                    </p>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button onClick={prevVezba}>⬅ Prethodna</Button>
                  <Button onClick={nextVezba}>Sledeća ➡</Button>
                </div>
              </>
            ) : (
              <p className="text-gray-500">Ovaj program nema vežbi.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}