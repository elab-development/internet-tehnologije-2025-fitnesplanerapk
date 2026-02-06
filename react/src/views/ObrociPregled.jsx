import { useEffect, useState } from "react";
import axiosClient from "./axios-client";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Button from "../components/Button.jsx";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

export default function ObrociPregled() {
  const [dnevniObroci, setDnevniObroci] = useState([]);
  const [cilj, setCilj] = useState(null);
  const [filterDatumOd, setFilterDatumOd] = useState("");
  const [filterDatumDo, setFilterDatumDo] = useState("");
  const { user } = useStateContext();

  useEffect(() => {
    fetchCilj();
    fetchObroci();
  }, []);

  const fetchCilj = async () => {
    try {
      const res = await axiosClient.get("/cilj");
      setCilj(res.data.cilj);
    } catch (err) {
      console.error("Greška pri učitavanju cilja:", err);
    }
  };

  const fetchObroci = async (od, doDatum) => {
    try {
      const res = await axiosClient.get("/obrociPregled", {
        params: { od, do: doDatum },
      });
      setDnevniObroci(res.data);
    } catch (err) {
      console.error("Greška pri učitavanju obroka:", err);
    }
  };

  const handleFilter = () => {
    fetchObroci(filterDatumOd, filterDatumDo);
  };

  const grafikonPodaci = dnevniObroci.map((d) => ({
    datum: d.datum,
    kalorije: d.ukupno_kalorija,
  }));

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("sr-RS");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50">
        <Header />
      </div>

     
      <main className="flex-1 p-6 max-w-6xl mx-auto mt-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Pregled unetih obroka
        </h1>

        {cilj && (
          <div className="mb-6 p-4 bg-yellow-100 rounded-lg shadow-sm flex items-center justify-between">
            <span className="text-lg font-medium text-gray-700">
              Vaš dnevni kalorijski cilj:
            </span>
            <span className="text-xl font-bold text-yellow-800">{cilj} kcal</span>
          </div>
        )}

        
        <div className="flex flex-wrap gap-4 mb-6 items-end">
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Od:</label>
            <input
              type="date"
              value={filterDatumOd}
              onChange={(e) => setFilterDatumOd(e.target.value)}
              className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Do:</label>
            <input
              type="date"
              value={filterDatumDo}
              onChange={(e) => setFilterDatumDo(e.target.value)}
              className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <Button
            onClick={handleFilter}
            
          >
            Filtriraj
          </Button>
        </div>

        {/* Grafikon */}
        {dnevniObroci.length > 0 && (
          <div className="mb-8 bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Dnevni unos kalorija
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={grafikonPodaci}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="datum" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="kalorije" fill="#3B82F6" />
                {cilj && (
                  <ReferenceLine
                    y={cilj}
                    stroke="#FACC15"
                    strokeDasharray="3 3"
                    label={{ value: "Cilj", position: "top", fill: "#B45309", fontWeight: "bold" }}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Lista kartica */}
        {dnevniObroci.length === 0 && (
          <div className="text-center text-gray-500 mt-10">Nema unetih obroka za prikaz.</div>
        )}

        <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(dnevniObroci) &&
            dnevniObroci.map((d) => (
              <div
                key={d.datum}
                className="bg-white rounded-lg shadow p-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold text-gray-800">{formatDate(d.datum)}</h2>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                    {d.ukupno_kalorija} kcal
                  </span>
                </div>

                <div className="space-y-2">
                  {d.obroci.map((obrok) => (
                    <div
                      key={obrok.id}
                      className="border-l-4 border-blue-400 pl-3 py-2 bg-blue-50 rounded-md"
                    >
                      <h3 className="font-semibold text-blue-700">{obrok.naziv}</h3>
                      <p className="flex flex-wrap gap-2 mt-1">
                        {obrok.hrana.map((h) => (
                          <span
                            key={h.id || h.custom_naziv}
                            className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm"
                          >
                            {h.custom_naziv || h.hrana?.naziv} ({h.kalorije} kcal)
                          </span>
                        ))}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </main>

     
      <Footer />
    </div>
  );
}
