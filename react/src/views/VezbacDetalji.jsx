import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "./axios-client.js";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Button from "../components/Button.jsx";

export default function VezbacDetalji() {
  const { id } = useParams();
  const [vezbac, setVezbac] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditingParam, setIsEditingParam] = useState(false);
  const [isEditingCilj, setIsEditingCilj] = useState(false);

  const [isTrener] = useState(true);

  const todayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const [newParam, setNewParam] = useState({
    date: todayDate(),
    tezina: "",
    visina: "",
    bmi: "",
    masti: "",
    misici: "",
    obim_struka: ""
  });

  const [newCilj, setNewCilj] = useState({
    hidriranost: "",
    tezina: "",
    kalorije: ""
  });

  useEffect(() => {
    const fetchVezbacData = async () => {
      try {
        const { data } = await axiosClient.get(`/users/${id}`);
        setVezbac(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVezbacData();
  }, [id]);

  const handleAddParam = async () => {
    try {
      const { data } = await axiosClient.post(`/users/${id}/parametri`, newParam);
      setVezbac({
        ...vezbac,
        parametri: [data, ...vezbac.parametri]
      });
      setIsEditingParam(false);
    } catch (err) {
      alert("Greška prilikom čuvanja parametra.");
    }
  };

  const handleDeleteParam = async (paramId) => {
    if (!window.confirm("Da li ste sigurni?")) return;

    try {
      await axiosClient.delete(`/parametri/${paramId}`);
      setVezbac({
        ...vezbac,
        parametri: vezbac.parametri.filter(p => p.id !== paramId)
      });
    } catch {
      alert("Greška pri brisanju parametra.");
    }
  };

  const handleAddCilj = async () => {
    try {
      const { data } = await axiosClient.post(`/users/${id}/ciljevi`, newCilj);
      setVezbac({
        ...vezbac,
        ciljevi: [data, ...vezbac.ciljevi]
      });
      setIsEditingCilj(false);
    } catch {
      alert("Greška prilikom čuvanja cilja.");
    }
  };

  const handleDeleteCilj = async (ciljId) => {
    if (!window.confirm("Da li ste sigurni?")) return;

    try {
      await axiosClient.delete(`/ciljevi/${ciljId}`);
      setVezbac({
        ...vezbac,
        ciljevi: vezbac.ciljevi.filter(c => c.id !== ciljId)
      });
    } catch {
      alert("Greška pri brisanju cilja.");
    }
  };

  if (loading) return <p className="p-6">Učitavanje...</p>;
  if (!vezbac) return <p className="p-6">Vezbač nije pronađen.</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-1 p-6 space-y-6">

        {/* OSNOVNE INFORMACIJE */}
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold">
            {vezbac.ime} {vezbac.prezime}
          </h1>
          <p>Email: {vezbac.email}</p>
          <p>Datum rođenja: {vezbac.datumRodjenja}</p>
          <p>Pol: {vezbac.pol}</p>
        </div>

        {/* PARAMETRI */}
        <div>
          <div className="flex justify-between mb-2">
            <h2 className="text-xl font-bold">Parametri</h2>
            {isTrener && <Button onClick={() => setIsEditingParam(!isEditingParam)}>Dodaj</Button>}
          </div>

          {isEditingParam && (
            <div className="bg-white p-4 rounded shadow mb-4 grid gap-2">
              <input type="date" value={newParam.date}
                onChange={e => setNewParam({ ...newParam, date: e.target.value })}
                className="border p-2 rounded" />
              <input type="number" placeholder="Težina"
                onChange={e => setNewParam({ ...newParam, tezina: e.target.value })}
                className="border p-2 rounded" />
              <Button onClick={handleAddParam}>Sačuvaj</Button>
            </div>
          )}

          {vezbac.parametri.length > 0 ? (
            <div className="overflow-x-auto bg-white rounded shadow">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2">Datum</th>
                    <th className="px-4 py-2">Težina</th>
                    <th className="px-4 py-2">BMI</th>
                    <th className="px-4 py-2">Akcije</th>
                  </tr>
                </thead>
                <tbody>
                  {[...vezbac.parametri]
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map(param => (
                    <tr key={param.id} className="border-t">
                      <td className="px-4 py-2">{param.date}</td>
                      <td className="px-4 py-2">{param.tezina}</td>
                      <td className="px-4 py-2">{param.bmi}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleDeleteParam(param.id)}
                          className="text-red-500 hover:underline"
                        >
                          Obriši
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p>Nema parametara.</p>}
        </div>

        {/* CILJEVI */}
        <div>
          <div className="flex justify-between mb-2">
            <h2 className="text-xl font-bold">Ciljevi</h2>
            {isTrener && <Button onClick={() => setIsEditingCilj(!isEditingCilj)}>Dodaj</Button>}
          </div>

          {vezbac.ciljevi.length > 0 ? (
            <div className="overflow-x-auto bg-white rounded shadow">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2">Hidriranost</th>
                    <th className="px-4 py-2">Težina</th>
                    <th className="px-4 py-2">Kalorije</th>
                    <th className="px-4 py-2">Datum</th>
                    <th className="px-4 py-2">Akcije</th>
                  </tr>
                </thead>
                <tbody>
                  {[...vezbac.ciljevi]
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .map(cilj => (
                    <tr key={cilj.id} className="border-t">
                      <td className="px-4 py-2">{cilj.hidriranost}</td>
                      <td className="px-4 py-2">{cilj.tezina}</td>
                      <td className="px-4 py-2">{cilj.kalorije}</td>
                      <td className="px-4 py-2">
                        {new Date(cilj.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleDeleteCilj(cilj.id)}
                          className="text-red-500 hover:underline"
                        >
                          Obriši
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p>Nema ciljeva.</p>}
        </div>

      </main>
      <Footer />
    </div>
  );
}