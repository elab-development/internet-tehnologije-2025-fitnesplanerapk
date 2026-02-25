import React, { useState, useEffect } from "react";
import axiosClient from "./axios-client.js";
import Header from "../components/Header.jsx";
import Button from "../components/Button.jsx";
import Footer from "../components/Footer.jsx";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [vezbe, setVezbe] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [imeVezbe, setImeVezbe] = useState("");
  const [snimakVezbe, setSnimakVezbe] = useState("");
  const [kategorija, setKategorija] = useState("");
  const [saving, setSaving] = useState(false);

  const kategorije = [
    "Grudi",
    "Leđa",
    "Noge",
    "Ramena",
    "Ruke",
    "Stomak",
    "Kardio",
    "Full body",
    "Ostalo",
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("sr-RS");
  };

  const getYoutubeThumbnail = (url) => {
    if (!url) return null;
    const regExp =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return match
      ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
      : null;
  };

  const saveVezba = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await axiosClient.post("/vezbe", {
        ime: imeVezbe,
        snimak: snimakVezbe,
        kategorija: kategorija,
      });

      setVezbe((prev) => [...prev, res.data]);

      setImeVezbe("");
      setSnimakVezbe("");
      setKategorija("");
      setShowModal(false);

      window.alert("Vežba je uspešno sačuvana!");
    } catch (err) {
      alert("Greška prilikom čuvanja vežbe");
      console.log(err);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axiosClient.get("/admin/users");
        setUsers(usersResponse.data);

        const vezbeResponse = await axiosClient.get("/vezbe");
        setVezbe(vezbeResponse.data);

        setLoading(false);
      } catch (err) {
        console.log(err);
        setError("Greška prilikom učitavanja podataka.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return <p className="text-center mt-10">Učitavanje podataka...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-8">
        {/* USERS */}
        <section className="mb-14">
          <h1 className="text-3xl font-bold mb-6">Lista korisnika</h1>

          <div className="bg-white rounded-2xl p-6 shadow overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2">Ime</th>
                  <th className="px-4 py-2">Prezime</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Username</th>
                  <th className="px-4 py-2">Datum registracije</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{u.ime}</td>
                    <td className="px-4 py-2">{u.prezime}</td>
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2">{u.username}</td>
                    <td className="px-4 py-2">
                      {formatDate(u.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* VEZBE */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Lista vežbi</h1>
            <Button onClick={() => setShowModal(true)}>
              Dodaj vežbu
            </Button>
          </div>

          {vezbe.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {vezbe.map((v) => {
                const thumbnail = getYoutubeThumbnail(v.snimak);

                return (
                  <div
                    key={v.id}
                    className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden"
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
                      <h2 className="text-lg font-semibold">
                        {v.ime}
                      </h2>

                      {v.kategorija && (
                        <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                          {v.kategorija}
                        </span>
                      )}

                      <div className="mt-3">
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
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow text-center text-gray-500">
              Trenutno nema unetih vežbi
            </div>
          )}
        </section>
      </main>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Nova vežba</h2>

            <form onSubmit={saveVezba} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Naziv vežbe
                </label>
                <input
                  type="text"
                  value={imeVezbe}
                  onChange={(e) => setImeVezbe(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  YouTube link
                </label>
                <input
                  type="text"
                  value={snimakVezbe}
                  onChange={(e) => setSnimakVezbe(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Kategorija
                </label>
                <select
                  value={kategorija}
                  onChange={(e) => setKategorija(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Izaberi kategoriju</option>
                  {kategorije.map((kat) => (
                    <option key={kat} value={kat}>
                      {kat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                >
                  Otkaži
                </button>

                <Button type="submit" disabled={saving}>
                  {saving ? "Čuvanje..." : "Sačuvaj"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}