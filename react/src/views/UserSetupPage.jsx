import React, { useState } from 'react';
import { useStateContext } from '../contexts/ContextProvider.jsx';
import Button from "../components/Button.jsx";
import axiosClient from "./axios-client.js";
import Header from '../components/Header.jsx';
import Footer from "../components/Footer.jsx";
export default function UserSetupPage() {
    const { user } = useStateContext();
    const [ciljevi, setCiljevi] = useState({
        hidriranost: '',
        tezina: '',
        kalorije: ''
    });

    
    const [parametri, setParametri] = useState({
        tezina: '',
        visina: '',
        masti: '',
        misici: '',
        obim_struka: ''
    });

    
    const handleCiljeviChange = (e) => {
        setCiljevi({
        ...ciljevi,
        [e.target.name]: e.target.value
        });
    };


    const handleParametriChange = (e) => {
        setParametri({
        ...parametri,
        [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const parametriSaDatumom = {
            ...parametri,
            date: new Date().toISOString().split('T')[0],
        };

        try {
            const response = await axiosClient.post("/parametri", parametriSaDatumom);
            console.log("Parametri sačuvani:", response.data);
            alert("Parametri su uspešno sačuvani!");
        } catch (error) {
            console.error(error);
            alert("Greška pri čuvanju parametara");
        }
    };

    const handleCiljeviSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosClient.post("/cilj", ciljevi);
            console.log("Ciljevi sačuvani:", response.data);
            alert("Ciljevi su uspešno sačuvani!");
        } catch (err) {
            console.log(err);
            alert("Došlo je do greške prilikom čuvanja ciljeva.");
        }
    };

    return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <h1 className="text-3xl font-bold mb-4 text-textPrimary text-center">
          Zdravo {user?.ime || 'korisniče'}! Unesi svoje ciljeve i parametre
        </h1>

        <form className="w-full max-w-md" onSubmit={handleSubmit}>

   
          <section className="bg-surface rounded-xl shadow p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Ciljevi</h2>

            <div className="mb-3">
              <label className="block mb-1 font-medium">Hidriranost:</label>
              <input
                type="text"
                name="hidriranost"
                value={ciljevi.hidriranost}
                onChange={handleCiljeviChange}
                className="w-full border border-black rounded px-3 py-2"
              />
            </div>

            <div className="mb-3">
              <label className="block mb-1 font-medium">Težina:</label>
              <input
                type="number"
                name="tezina"
                value={ciljevi.tezina}
                onChange={handleCiljeviChange}
                className="w-full border border-black rounded px-3 py-2"
              />
            </div>

            <div className="mb-3">
              <label className="block mb-1 font-medium">Dnevne kalorije:</label>
              <input
                type="number"
                name="kalorije"
                value={ciljevi.kalorije}
                onChange={handleCiljeviChange}  
                className="w-full border border-black rounded px-3 py-2"
              />
            </div>

            <Button type="button" onClick={handleCiljeviSubmit} className="mt-2 w-full">
              Sačuvaj ciljeve
            </Button>
          </section>

          <section className="bg-surface rounded-xl shadow p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Parametri</h2>

            <div className="mb-3">
              <label className="block mb-1 font-medium">Težina:</label>
              <input
                type="number"
                name="tezina"
                value={parametri.tezina}
                onChange={handleParametriChange}
                className="w-full border border-black rounded px-3 py-2"
              />
            </div>

            <div className="mb-3">
              <label className="block mb-1 font-medium">Visina:</label>
              <input
                type="number"
                name="visina"
                value={parametri.visina}
                onChange={handleParametriChange}
                className="w-full border border-black rounded px-3 py-2"
              />
            </div>

            <div className="mb-3">
              <label className="block mb-1 font-medium">Masti (%):</label>
              <input
                type="number"
                name="masti"
                value={parametri.masti}
                onChange={handleParametriChange}
                className="w-full border border-black rounded px-3 py-2"
              />
            </div>

            <div className="mb-3">
              <label className="block mb-1 font-medium">Mišići (%):</label>
              <input
                type="number"
                name="misici"
                value={parametri.misici}
                onChange={handleParametriChange}
                className="w-full border border-black rounded px-3 py-2"
              />
            </div>

            <div className="mb-3">
              <label className="block mb-1 font-medium">Obim struka (cm):</label>
              <input
                type="number"
                name="obim_struka"
                value={parametri.obim_struka}
                onChange={handleParametriChange}
                className="w-full border border-black rounded px-3 py-2"
              />
            </div>

            <Button type="submit" className="mt-2 w-full">
              Sačuvaj parametre
            </Button>
          </section>

        </form>
      </main>
      <Footer></Footer>
    </div>
  );

}
