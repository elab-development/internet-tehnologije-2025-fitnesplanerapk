import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "./axios-client";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { FaEdit, FaTrash } from "react-icons/fa"; // Icons
import Button from "../components/Button.jsx";

export default function ObrociDan() {
  const { datum } = useParams();
  const navigate = useNavigate();
  const [obroci, setObroci] = useState([]);

  useEffect(() => {
    fetchObroci();
  }, [datum]);

  const fetchObroci = async () => {
    const res = await axiosClient.get("/obrociPregled", {
      params: { od: datum, do: datum }
    });
    setObroci(res.data[0]?.obroci || []);
  };

  const obrisiObrok = async (obrokId) => {
    if (!window.confirm("Da li ste sigurni da želite da obrišete ovaj obrok?")) return;
    try {
      await axiosClient.delete(`/obroci/${obrokId}`);
      alert("Obrok uspešno obrisan");
      fetchObroci();
    } catch (error) {
      console.error(error);
      alert("Greška pri brisanju obroka");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Obroci za <span className="text-blue-600">{datum}</span>
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {obroci.map((obrok) => {
            const ukupnoKalorija = obrok.hrana.reduce((sum, h) => sum + h.kalorije, 0);
            return (
              <div
                key={obrok.id}
                className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-2xl transition relative"
              >
                {/* Naslov i badge */}
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold text-gray-800">{obrok.naziv}</h2>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {obrok.hrana.length} namirnice
                  </span>
                </div>

                {/* Ukupne kalorije */}
                <div className="mb-3 font-medium text-gray-700">
                  Ukupno kalorija: <span className="text-red-500">{ukupnoKalorija} kcal</span>
                </div>

                {/* Lista namirnica */}
                <div className="divide-y divide-gray-200 mb-4">
                  {obrok.hrana.map((h, i) => (
                    <div key={i} className="flex justify-between py-1 text-gray-600 text-sm">
                      <span>{h.custom_naziv || h.hrana?.naziv}</span>
                      <span>{h.kalorije} kcal</span>
                    </div>
                  ))}
                </div>

                {/* Dugmad sa ikonama */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => navigate(`/obroci/edit/${obrok.id}`)}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                  >
                    <FaEdit /> Edit
                  </Button>

                  <Button
                    onClick={() => obrisiObrok(obrok.id)}
                    className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                  >
                    <FaTrash /> Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}