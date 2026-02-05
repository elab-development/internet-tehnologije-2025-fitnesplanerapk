
import React, { useState, useEffect } from "react";
import axiosClient from "./axios-client.js";
import Header from '../components/Header.jsx';
import Button from "../components/Button.jsx";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vezbe, setVezbe] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [imeVezbe, setImeVezbe] = useState("");
  const [snimakVezbe, setSnimakVezbe] = useState("");
  const [saving, setSaving] = useState(false);


   const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("sr-RS");
  };

  const saveVezba = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await axiosClient.post("/vezbe", {
        ime: imeVezbe,
        snimak: snimakVezbe,
      });

      setVezbe((prev) => [...prev, res.data]);

     
      setImeVezbe("");
      setSnimakVezbe("");
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

  if (loading) return <p className="text-center mt-10">Učitavanje podataka...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  const getYoutubeThumbnail = (url) => {
  if (!url) return null;

  const regExp =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regExp);

  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
};
return (
  <div className="min-h-screen bg-background flex flex-col">
    <Header />

    <main className="flex-1 max-w-7xl mx-auto px-6 py-8">

      
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-textPrimary mb-4">
          Lista korisnika
        </h1>

        <div className="bg-surface rounded-xl p-6 shadow overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2 text-left">Ime</th>
                <th className="border px-4 py-2 text-left">Prezime</th>
                <th className="border px-4 py-2 text-left">Email</th>
                <th className="border px-4 py-2 text-left">Username</th>
                <th className="border px-4 py-2 text-left">
                  Datum registracije
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">{u.ime}</td>
                    <td className="border px-4 py-2">{u.prezime}</td>
                    <td className="border px-4 py-2">{u.email}</td>
                    <td className="border px-4 py-2">{u.username}</td>
                    <td className="border px-4 py-2">
                      {formatDate(u.created_at)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    Nema korisnika
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

  
      <section>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-textPrimary">
            Lista vežbi
          </h1>
          <Button type="button" onClick={() => setShowModal(true)}>
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
                  className="bg-surface rounded-xl shadow overflow-hidden hover:shadow-lg transition"
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
                    <h2 className="text-lg font-semibold mb-2">
                      {v.ime}
                    </h2>

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
              );
            })}
          </div>
        ) : (
          <div className="bg-surface rounded-xl p-6 shadow text-center text-gray-500">
            Trenutno nema unetih vežbi
          </div>
        )}
      </section>
       {showModal && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl border">
              <h2 className="text-xl font-bold mb-4">Nova vežba</h2>

              <form onSubmit={saveVezba} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Naziv vežbe
                  </label>
                  <input
                    type="text"
                    value={imeVezbe}
                    onChange={(e) => setImeVezbe(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="ime vežbe"
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
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="link ka vežbi"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-lg border"
                  >
                    Otkaži
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
                  >
                    {saving ? "Čuvanje..." : "Sačuvaj"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

    </main>
  </div>
);


 
}
