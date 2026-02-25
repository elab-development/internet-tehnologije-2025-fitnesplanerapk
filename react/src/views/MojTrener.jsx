import React, { useEffect, useState } from "react";
import axiosClient from "./axios-client.js";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Button from "../components/Button.jsx";
import Modal from "../components/Modal.jsx";

export default function MojTrener() {
  const [trener, setTrener] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewTrener, setPreviewTrener] = useState(null);
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

  const openPreview = (t) => {
    setPreviewTrener(t);
    setShowPreview(true);
  };

  const getProfileImageUrl = (profile_image) => {
    if (!profile_image) return null;
    // Ako već ima http u path-u
    if (profile_image.startsWith("http") || profile_image.startsWith("https")) return profile_image;
    // Inače uzmi storage put
    return `http://127.0.0.1:8000/storage/${profile_image}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Moj trener</h1>

        <div className="bg-white rounded-xl p-6 shadow space-y-4">
          {trener ? (
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              {/* Profilna slika */}
              <div
                className="w-32 h-32 rounded-full overflow-hidden border-2 border-indigo-500 flex-shrink-0 cursor-pointer"
                onClick={() => openPreview(trener)}
              >
                {trener.profile_image ? (
                  <img
                    src={getProfileImageUrl(trener.profile_image)}
                    alt="Profil trenera"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                    Nema slike
                  </div>
                )}
              </div>

              {/* Podaci o treneru */}
              <div className="flex-1 space-y-2">
                <p><strong>Ime:</strong> {trener.ime}</p>
                <p><strong>Prezime:</strong> {trener.prezime}</p>
                <p><strong>Username:</strong> {trener.username}</p>
                <p><strong>Email:</strong> {trener.email}</p>
                {trener.biografija && (
                  <div className="text-gray-600 whitespace-pre-wrap">{trener.biografija}</div>
                )}

                <div className="flex space-x-2 mt-2">
                  <Button
                    onClick={ukloniTrenera}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Ukloni trenera
                  </Button>
                  <Button onClick={() => setShowModal(true)}>
                    Promeni trenera
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <p className="text-gray-500">Nema postavljenog trenera</p>
              <Button onClick={() => setShowModal(true)}>
                Postavi trenera
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Modal za pretragu i izbor trenera */}
      {showModal && (
        <Modal title="Postavi trenera" onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <input
              type="text"
              value={searchTrener}
              onChange={e => setSearchTrener(e.target.value)}
              placeholder="Pretraži trenera po imenu, prezimenu ili email"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
            <Button onClick={pretraziTrenera} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg">
              Pretraži
            </Button>

            <ul className="space-y-3 max-h-80 overflow-y-auto">
              {searchResults.map(t => (
                <li
                  key={t.id}
                  className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 border p-3 rounded-lg hover:shadow-md transition-shadow"
                >
                  {/* Slika */}
                  <div
                    className="w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-400 flex-shrink-0 cursor-pointer"
                    onClick={() => openPreview(t)}
                  >
                    {t.profile_image ? (
                      <img
                        src={getProfileImageUrl(t.profile_image)}
                        alt="Profil"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                        Nema slike
                      </div>
                    )}
                  </div>

                  {/* Podaci */}
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{t.ime} {t.prezime}</p>
                    <p className="text-sm text-gray-500">{t.username} | {t.email}</p>
                    {t.biografija && (
                      <div className="text-gray-600 mt-1 text-sm whitespace-pre-wrap">
                        {t.biografija}
                      </div>
                    )}
                  </div>

                  {/* Dugme za postavljanje */}
                  <div className="flex-shrink-0 mt-2 md:mt-0">
                    <Button
                      onClick={() => postaviTrenera(t.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Postavi
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Modal>
      )}

      {/* Preview Modal za trenera */}
      {/* Preview Modal za trenera */}
{showPreview && previewTrener && (
  <Modal title="Profil trenera" onClose={() => setShowPreview(false)}>
    <div className="flex flex-col items-center space-y-4 p-4">
      <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-indigo-500">
        <img
          src={getProfileImageUrl(previewTrener.profile_image)}
          alt="Profil"
          className="w-full h-full object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src = "/default-avatar.png"; }}
        />
      </div>
      <p className="text-xl font-bold">
        {previewTrener.ime || "Ime nije dostupno"} {previewTrener.prezime || ""}
      </p>
      <p className="text-gray-600">
        <strong>Username:</strong> {previewTrener.username || "-"}
      </p>
      <div className="text-gray-700 text-center max-h-64 overflow-y-auto whitespace-pre-wrap px-2">
        {previewTrener.biografija || "Biografija nije dostupna"}
      </div>
    </div>
  </Modal>
)}
    
    </div>
  );
}