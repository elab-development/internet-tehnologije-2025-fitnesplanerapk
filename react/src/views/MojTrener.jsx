import React, { useEffect, useState } from "react";
import axiosClient from "./axios-client.js";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Button from "../components/Button.jsx";
import Modal from "../components/Modal.jsx";

export default function MojTrener() {
  const [trener, setTrener] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTrener, setSearchTrener] = useState("");
  const [searchResults, setSearchResults] = useState([]);

 
  useEffect(() => {
    axiosClient.get("/me")
      .then(res => setTrener(res.data.trener || null))
      .catch(err => console.error(err));
  }, []);

  
  const ukloniTrenera = () => {
    if (!window.confirm("Da li želiš da ukloniš trenutnog trenera?")) return;
    axiosClient.post("/trener/ukloni")
      .then(() => setTrener(null))
      .catch(err => console.error(err));
  };

  
  const pretraziTrenera = () => {
    if (!searchTrener) return;
    axiosClient.get(`/trener/pretraga?query=${searchTrener}`)
      .then(res => setSearchResults(res.data))
      .catch(err => console.error(err));
  };

 
  const postaviTrenera = (id) => {
    axiosClient.post("/trener/postavi", { trener_id: id })
      .then(res => {
        setTrener(res.data.trener);
        setShowModal(false);
        setSearchTrener("");
        setSearchResults([]);
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Trener</h1>

        <div className="bg-surface rounded-xl p-6 shadow space-y-4">
          {trener ? (
            <div className="space-y-2">
              <p><strong>Ime:</strong> {trener.ime}</p>
              <p><strong>Email:</strong> {trener.email}</p>
              <Button onClick={ukloniTrenera} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                Ukloni trenera
              </Button>
            </div>
          ) : (
            <p className="text-gray-500">Nema postavljenog trenera</p>
          )}

          <Button onClick={() => setShowModal(true)}>
            {trener ? "Promeni trenera" : "Postavi trenera"}
          </Button>
        </div>
      </main>

      <Footer />

      
      {showModal && (
        <Modal title="Postavi trenera" onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <input
              type="text"
              value={searchTrener}
              onChange={e => setSearchTrener(e.target.value)}
              placeholder="Pretraži trenera po imenu ili email"
              className="w-full border rounded-lg px-3 py-2"
            />
            <Button onClick={pretraziTrenera}>Pretraži</Button>

            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {searchResults.map(t => (
                <li key={t.id} className="flex justify-between items-center border p-2 rounded">
                  <div>
                    <p>{t.ime} {t.prezime}</p>
                    <p className="text-sm text-gray-500">{t.email}</p>
                  </div>
                  <Button onClick={() => postaviTrenera(t.id)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
                    Postavi
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </Modal>
      )}
    </div>
  );
}