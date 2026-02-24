import React, { useEffect, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import axiosClient from "./axios-client.js";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Button from "../components/Button.jsx";
import { useNavigate, Link } from "react-router-dom";
import Modal from "../components/Modal.jsx";

export default function Dashboard() {
  const { user } = useStateContext();
  const navigate = useNavigate();

  // State
  const [parametri, setParametri] = useState([]);
  const [ciljevi, setCiljevi] = useState([]);
  const [hidriranost, setHidriranost] = useState(null);

  const [showParametri, setShowParametri] = useState(false);
  const [showCiljevi, setShowCiljevi] = useState(false);
  const [showHidriranostModal, setShowHidriranostModal] = useState(false);

  const [showAddCiljModal, setShowAddCiljModal] = useState(false);
  const [showAddParamModal, setShowAddParamModal] = useState(false);

  const [voda, setVoda] = useState("");

  const [newCilj, setNewCilj] = useState({ hidriranost: "", tezina: "", kalorije: "" });
  const [newParam, setNewParam] = useState({
    date: new Date().toISOString().slice(0,10),
    tezina: "", visina: "", bmi: "", masti: "", misici: "", obim_struka: ""
  });

  // Fetch podaci
  useEffect(() => {
    if (!user) return;

    axiosClient.get("/all-parametri")
      .then(res => setParametri(res.data))
      .catch(err => console.log(err));

    axiosClient.get("/all-ciljevi")
      .then(res => setCiljevi(res.data))
      .catch(err => console.log(err));

    axiosClient.get("/hidriranost-danas")
      .then(res => setHidriranost(res.data.exists ? res.data.data : null))
      .catch(() => setHidriranost(null));
  }, [user]);

  // Helper
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("sr-RS");
  };

  const lastParam = parametri[0] || {};
  const lastCilj = ciljevi[0] || {};

  // Hidriranost
  const sacuvajHidriranost = () => {
    const unosVode = parseFloat(voda);
    const request = hidriranost
      ? axiosClient.put(`/hidriranost/${hidriranost.id}`, { ukupno: unosVode })
      : axiosClient.post("/hidriranost", { ukupno: unosVode });

    request.then(res => {
      setHidriranost(res.data);
      setVoda("");
      setShowHidriranostModal(false);
    });
  };

  // Ciljevi i parametri CRUD
  const obrisiCilj = (id) => {
    if (!window.confirm("Da li ste sigurni da želite da obrišete cilj?")) return;
    axiosClient.delete(`/cilj/${id}`)
      .then(() => setCiljevi(prev => prev.filter(c => c.id !== id)))
      .catch(err => console.error(err));
  };

  const obrisiParametar = (id) => {
    if (!window.confirm("Da li ste sigurni da želite da obrišete parametar?")) return;
    axiosClient.delete(`/parametar/${id}`)
      .then(() => setParametri(prev => prev.filter(p => p.id !== id)))
      .catch(err => console.error(err));
  };

  const dodajCilj = () => {
    axiosClient.post("/cilj", {
      hidriranost: Number(newCilj.hidriranost),
      tezina: Number(newCilj.tezina),
      kalorije: Number(newCilj.kalorije)
    })
    .then(res => {
      setCiljevi(prev => [res.data, ...prev]);
      setNewCilj({ hidriranost: "", tezina: "", kalorije: "" });
      setShowAddCiljModal(false);
    })
    .catch(err => console.error(err));
  };

  const dodajParametar = () => {
    axiosClient.post("/parametri", {
      ...newParam,
      tezina: Number(newParam.tezina),
      visina: Number(newParam.visina),
      bmi: Number(newParam.bmi),
      masti: Number(newParam.masti),
      misici: Number(newParam.misici),
      obim_struka: Number(newParam.obim_struka)
    })
    .then(res => {
      setParametri(prev => [res.data.parametri, ...prev]);
      setNewParam({
        date: new Date().toISOString().slice(0,10),
        tezina: "", visina: "", bmi: "", masti: "", misici: "", obim_struka: ""
      });
      setShowAddParamModal(false);
    })
    .catch(err => console.error(err));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8">
        
        {/* Osnovni podaci */}
        <section className="mb-10">
          <h1 className="text-3xl font-bold text-textPrimary mb-2">
            Moj fitness dashboard
          </h1>
          <p className="text-gray-600 mb-4">Pregled tvog napretka, ciljeva i planova</p>
          <div className="bg-surface rounded-xl p-6 shadow space-y-1">
            <p><strong>Ime:</strong> {user?.ime || "-"}</p>
            <p><strong>Prezime:</strong> {user?.prezime || "-"}</p>
            <p><strong>Pol:</strong> {user?.pol || "-"}</p>
            <p><strong>Datum rođenja:</strong> {formatDate(user?.datumRodjenja)|| "-"}</p>
          </div>
        </section>

        {/* Hidriranost */}
        <section className="mb-10">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-2">
              Hidriranost za dan ({new Date().toLocaleDateString("sr-RS")})
            </h2>
            <p className="text-lg mb-4">
              Popijeno: <strong>{hidriranost?.ukupno ?? 0} L</strong>
            </p>
            <Button onClick={() => setShowHidriranostModal(true)}>
              {hidriranost ? "Dodaj" : "Započni merenje hidriranosti"}
            </Button>
          </div>
        </section>

        {/* Ciljevi i parametri */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Ciljevi */}
          <div className="bg-surface rounded-xl p-6 shadow">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Ciljevi</h2>
              <Button onClick={() => setShowAddCiljModal(true)}>Dodaj novi cilj</Button>
            </div>

            {ciljevi.length === 0 ? (
              <p className="text-gray-500">Nema unetih ciljeva</p>
            ) : (
              <>
                <ul className="space-y-2 mb-3">
                  <li><strong>Hidriranost:</strong> {lastCilj.hidriranost}</li>
                  <li><strong>Težina:</strong> {lastCilj.tezina}</li>
                  <li><strong>Kalorije:</strong> {lastCilj.kalorije}</li>
                  <li><strong>Datum:</strong> {formatDate(lastCilj.created_at)}</li>
                </ul>
                <Button onClick={() => setShowCiljevi(true)} className="text-textSecondary underline hover:opacity-80">
                  Prikaži sve ciljeve
                </Button>
              </>
            )}
          </div>

          {/* Parametri */}
          <div className="bg-surface rounded-xl p-6 shadow">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Parametri</h2>
              <Button onClick={() => setShowAddParamModal(true)}>Dodaj nove parametre</Button>
            </div>

            {parametri.length === 0 ? (
              <p className="text-gray-500">Nema unetih parametara</p>
            ) : (
              <>
                <ul className="space-y-2 mb-3">
                  <li><strong>Težina:</strong> {lastParam.tezina}</li>
                  <li><strong>Visina:</strong> {lastParam.visina}</li>
                  <li><strong>BMI:</strong> {lastParam.bmi}</li>
                  <li><strong>Masti:</strong> {lastParam.masti}</li>
                  <li><strong>Mišići:</strong> {lastParam.misici}</li>
                </ul>
                <Button onClick={() => setShowParametri(true)} className="text-textSecondary underline hover:opacity-80">
                  Prikaži sve parametre
                </Button>
              </>
            )}
          </div>

          {/* Plan ishrane */}
          <div className="bg-surface rounded-xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Plan ishrane</h2>
            <Button onClick={() => navigate("/obrociPregled")}>Ishrana</Button>
          </div>

          {/* Plan treninga */}
          <div className="bg-surface rounded-xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Plan treninga</h2>
            <Link to="/programi"><Button>Pregled mojih treninga</Button></Link>
          </div>

        </section>
      </main>

      <Footer />

      {/* Modali */}
      {showCiljevi && (
        <Modal title="Svi ciljevi" onClose={() => setShowCiljevi(false)}>
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
            <thead className="bg-gray-100 text-black">
              <tr>
                <th className="px-3 py-2">Hidriranost</th>
                <th className="px-3 py-2 text-center">Ciljna težina</th>
                <th className="px-3 py-2 text-center">Kalorije</th>
                <th className="px-3 py-2 text-center">Datum</th>
                <th className="px-3 py-2 text-center">Akcija</th>
              </tr>
            </thead>
            <tbody>
              {ciljevi.map(c => (
                <tr key={c.id} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2">{c.hidriranost}</td>
                  <td className="px-3 py-2 text-center">{c.tezina}</td>
                  <td className="px-3 py-2 text-center">{c.kalorije}</td>
                  <td className="px-3 py-2 text-center">{formatDate(c.created_at)}</td>
                  <td className="px-3 py-2 text-center">
                    <Button onClick={() => obrisiCilj(c.id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">Obriši</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal>
      )}

      {showParametri && (
        <Modal title="Svi parametri" onClose={() => setShowParametri(false)}>
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
            <thead className="bg-gray-100 text-black">
              <tr>
                <th className="px-3 py-2">Datum</th>
                <th className="px-3 py-2 text-center">Težina (kg)</th>
                <th className="px-3 py-2 text-center">Visina (cm)</th>
                <th className="px-3 py-2 text-center">BMI</th>
                <th className="px-3 py-2 text-center">Masti (%)</th>
                <th className="px-3 py-2 text-center">Mišići (%)</th>
                <th className="px-3 py-2 text-center">Struk (cm)</th>
                <th className="px-3 py-2 text-center">Akcija</th>
              </tr>
            </thead>
            <tbody>
              {parametri.map(p => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2">{formatDate(p.date)}</td>
                  <td className="px-3 py-2 text-center">{p.tezina}</td>
                  <td className="px-3 py-2 text-center">{p.visina}</td>
                  <td className="px-3 py-2 text-center">{p.bmi}</td>
                  <td className="px-3 py-2 text-center">{p.masti}</td>
                  <td className="px-3 py-2 text-center">{p.misici}</td>
                  <td className="px-3 py-2 text-center">{p.obim_struka}</td>
                  <td className="px-3 py-2 text-center">
                    <Button onClick={() => obrisiParametar(p.id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">Obriši</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal>
      )}

      {showHidriranostModal && (
        <Modal title={hidriranost ? "Izmeni hidriranost" : "Započni merenje"} onClose={() => setShowHidriranostModal(false)}>
          <div className="space-y-4">
            <input type="number" step="0.1" value={voda} onChange={e => setVoda(e.target.value)} placeholder="Unesi količinu (L)" className="w-full border rounded-lg px-3 py-2" />
            <Button onClick={sacuvajHidriranost}>Sačuvaj</Button>
          </div>
        </Modal>
      )}

      {showAddCiljModal && (
        <Modal title="Dodaj novi cilj" onClose={() => setShowAddCiljModal(false)}>
          <div className="space-y-3">
            <input type="number" placeholder="Hidriranost (L)" value={newCilj.hidriranost} onChange={e => setNewCilj({...newCilj, hidriranost: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
            <input type="number" placeholder="Težina (kg)" value={newCilj.tezina} onChange={e => setNewCilj({...newCilj, tezina: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
            <input type="number" placeholder="Kalorije" value={newCilj.kalorije} onChange={e => setNewCilj({...newCilj, kalorije: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
            <Button onClick={dodajCilj}>Sačuvaj cilj</Button>
          </div>
        </Modal>
      )}

      {showAddParamModal && (
        <Modal title="Dodaj nove parametre" onClose={() => setShowAddParamModal(false)}>
          <div className="space-y-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input type="date" value={newParam.date} onChange={e => setNewParam({...newParam, date: e.target.value})} className="border p-2 rounded" />
            <input type="number" placeholder="Težina (kg)" value={newParam.tezina} onChange={e => setNewParam({...newParam, tezina: e.target.value})} className="border p-2 rounded" />
            <input type="number" placeholder="Visina (cm)" value={newParam.visina} onChange={e => setNewParam({...newParam, visina: e.target.value})} className="border p-2 rounded" />
            <input type="number" placeholder="BMI" value={newParam.bmi} onChange={e => setNewParam({...newParam, bmi: e.target.value})} className="border p-2 rounded" />
            <input type="number" placeholder="Masti (%)" value={newParam.masti} onChange={e => setNewParam({...newParam, masti: e.target.value})} className="border p-2 rounded" />
            <input type="number" placeholder="Mišići (%)" value={newParam.misici} onChange={e => setNewParam({...newParam, misici: e.target.value})} className="border p-2 rounded" />
            <input type="number" placeholder="Obim struka (cm)" value={newParam.obim_struka} onChange={e => setNewParam({...newParam, obim_struka: e.target.value})} className="border p-2 rounded" />
            <Button onClick={dodajParametar}>Sačuvaj parametre</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
