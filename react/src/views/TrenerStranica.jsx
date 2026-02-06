import React, { useEffect, useState } from "react";
import axiosClient from "./axios-client.js";
import Header from "../components/Header.jsx";
import Button from "../components/Button.jsx";
import Footer from "../components/Footer.jsx";
export default function TrenerStranica() {
  const [vezbe, setVezbe] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getYoutubeThumbnail = (url) => {
    if (!url) return null;

    const regExp =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);

        return match
        ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
        : null;
        };

        useEffect(() => {
            const fetchVezbe = async () => {
            try {
                const response = await axiosClient.get("/vezbe");
                setVezbe(response.data);
                setLoading(false);
            } catch (err) {
                console.log(err);
                setError("Greška prilikom učitavanja vežbi.");
                setLoading(false);
            }
            };

            fetchVezbe();
        }, []);

        if (loading)
            return <p className="text-center mt-10">Učitavanje vežbi...</p>;

        if (error)
            return <p className="text-center mt-10 text-red-500">{error}</p>;

        return (
            <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1 max-w-7xl mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold text-textPrimary mb-6">
                Prikaz vežbi za kreiranje treninga
                
                </h1>

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
                    Trenutno nema dostupnih vežbi
                </div>
                )}
            </main>
            <Footer />
            </div>
        );
        }
