import React, { useEffect, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import axiosClient from "./axios-client.js";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Button from "../components/Button.jsx";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";



export default function Dashboard() {
  const { user } = useStateContext();

  const [parametri, setParametri] = useState([]);
  const [ciljevi, setCiljevi] = useState([]);
  const navigate = useNavigate();
  const [showParametri, setShowParametri] = useState(false);
  const [showCiljevi, setShowCiljevi] = useState(false);
  const [hidriranost, setHidriranost] = useState(null);
  const [showHidriranostModal, setShowHidriranostModal] = useState(false);
  const [voda, setVoda] = useState("");
  useEffect(() => {
    if (!user) return;

    axiosClient.get("/all-parametri")
      .then(res => setParametri(res.data))
      .catch(err => console.log(err));

    axiosClient.get("/all-ciljevi")
      .then(res => setCiljevi(res.data))
      .catch(err => console.log(err));

    axiosClient.get("/hidriranost-danas")
      .then(res => {
        if (res.data.exists) {
          setHidriranost(res.data.data);
        } else {
          setHidriranost(null);
        }
      })
      .catch(() => {
        setHidriranost(null);
      });
  }, [user]);

  const lastParam = parametri[0] || {};
  const lastCilj = ciljevi[0] || {};
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("sr-RS");
  };

    const sacuvajHidriranost = () => {
      const unosVode = parseFloat(voda);
    const request = hidriranost
      ? axiosClient.put(`/hidriranost/${hidriranost.id}`, { ukupno: parseFloat(unosVode) })
      : axiosClient.post("/hidriranost", { ukupno: unosVode });

    request.then(res => {
      setHidriranost(res.data);
      setVoda("");
      setShowHidriranostModal(false);
    });
  };
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-8">

       
        <section className="mb-10">
          <h1 className="text-3xl font-bold text-textPrimary mb-2">
            Moj fitness dashboard
          </h1>
          <p className="text-gray-600 mb-4">
            Pregled tvog napretka, ciljeva i planova
          </p>

          <div className="bg-surface rounded-xl p-6 shadow space-y-1">
            <p><strong>Ime:</strong> {user?.ime || "-"}</p>
            <p><strong>Prezime:</strong> {user?.prezime || "-"}</p>
            <p><strong>Pol:</strong> {user?.pol || "-"}</p>
            <p><strong>Datum rođenja:</strong> {formatDate(user?.datumRodjenja)|| "-"}</p>
          </div>
        </section>
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
   
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

      
          <div className="bg-surface rounded-xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Ciljevi</h2>

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

                <Button
                  onClick={() => setShowCiljevi(true)}
                  className="text-textSecondary underline hover:opacity-80"
                >
                  Prikaži sve ciljeve 
                </Button>
              </>
            )}
          </div>


          <div className="bg-surface rounded-xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Parametri</h2>

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

                <Button
                  onClick={() => setShowParametri(true)}
                  className="text-textSecondary underline hover:opacity-80"
                >
                  Prikaži sve parametre
                </Button>
              </>
            )}
          </div>


          <div className="bg-surface rounded-xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Plan ishrane</h2>
            {/* <p className="text-gray-500 mb-3">
              Trenutno nema unetih planova ishrane.
            </p>
            <span className="text-sm text-textSecondary">
              (Ovde kasnije ide tabela ili modal)
            </span> */}
            <Button onClick={() => navigate("/obrociPregled")}>
                 Ishrana
            </Button>
          </div>

         
          <div className="bg-surface rounded-xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Plan treninga</h2>
            {/* <p className="text-gray-500 mb-3">
              Trenutno nema unetih planova treninga.
            </p>
            <span className="text-sm text-textSecondary">
              (Ovde kasnije ide tabela ili modal)
            </span> */}
            <Link to="/programi">
  <Button>Pregled mojih treninga</Button>
</Link>

          </div>

        </section>
      </main>

      <Footer />

              
      {showCiljevi && (
        <Modal title="Svi ciljevi" onClose={() => setShowCiljevi(false)}>
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
            <thead className="bg-gray-100 text-black">
              <tr>
                <th className="px-3 py-2 text-left">Hidriranost</th>
                <th className="px-3 py-2 text-center">Ciljna težina</th>
                <th className="px-3 py-2 text-center">Kalorije</th>
                <th className="px-3 py-2 text-center">Datum</th>
              </tr>
            </thead>

            <tbody>
              {ciljevi.map((c) => (
                <tr key={c.id} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2">{c.hidriranost}</td>
                  <td className="px-3 py-2 text-center">{c.tezina}</td>
                  <td className="px-3 py-2 text-center">{c.kalorije}</td>
                  <td className="px-3 py-2 text-center">
                    {formatDate(c.created_at)}
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
                <th className="px-3 py-2 text-left">Datum</th>
                <th className="px-3 py-2 text-center">Težina (kg)</th>
                <th className="px-3 py-2 text-center">Visina (cm)</th>
                <th className="px-3 py-2 text-center">BMI</th>
                <th className="px-3 py-2 text-center">Masti (%)</th>
                <th className="px-3 py-2 text-center">Mišići (%)</th>
                <th className="px-3 py-2 text-center">Struk (cm)</th>
              </tr>
            </thead>

            <tbody>
              {parametri.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2">{formatDate(p.date)}</td>
                  <td className="px-3 py-2 text-center">{p.tezina}</td>
                  <td className="px-3 py-2 text-center">{p.visina}</td>
                  <td className="px-3 py-2 text-center">{p.bmi}</td>
                  <td className="px-3 py-2 text-center">{p.masti}</td>
                  <td className="px-3 py-2 text-center">{p.misici}</td>
                  <td className="px-3 py-2 text-center">{p.obim_struka}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal>
      )}

      {showHidriranostModal && (
      <Modal
        title={hidriranost ? "Izmeni hidriranost" : "Započni merenje"}
        onClose={() => setShowHidriranostModal(false)}
      >
        <div className="space-y-4">
          <input
            type="number"
            step="0.1"
            value={voda}
            onChange={(e) => setVoda(e.target.value)}
            placeholder="Unesi količinu (L)"
            className="w-full border rounded-lg px-3 py-2"
          />
          <Button onClick={sacuvajHidriranost}>Sačuvaj</Button>
        </div>
      </Modal>
    )}
    </div>
  );
}


    function Modal({ title, children, onClose }) {
      return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-xl p-6 w-[95%] max-w-6xl shadow-2xl">
            
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h3 className="text-xl font-semibold">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-red-500 text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="overflow-x-auto">
              {children}
            </div>

          </div>
        </div>
      );
    }


