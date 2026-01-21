import React, { useState } from 'react';
import { useStateContext } from '../contexts/ContextProvider.jsx';
import Button from "../components/Button.jsx";
import axiosClient from "./axios-client.js";

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

    const handleSubmit = (e) => {
        e.preventDefault();


        const parametriSaDatumom = {
        ...parametri,
        date: new Date().toISOString().split('T')[0] 
        };

        console.log('Ciljevi:', ciljevi);
        console.log('Parametri:', parametriSaDatumom);

        // axios.post("/api/user-setup", { ciljevi, parametri: parametriSaDatumom }) ...
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
        <div>
        <div style={{ padding: '20px' }}>
     
            <h1>
                Zdravo {user?.ime || 'korisniče'}, hajde da unesemo tvoje ciljeve i parametre koje ćeš pratiti tokom vremena!
            </h1>
        </div>
        <div style={{ padding: '20px' }}>
        <h1>User Setup</h1>
        <form onSubmit={handleSubmit}>
        
            <section style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
            <h2>Ciljevi</h2>
            <div>
                <label>Hidriranost:</label>
                <input
                type="text"
                name="hidriranost"
                value={ciljevi.hidriranost}
                onChange={handleCiljeviChange}
                />
            </div>
            <div>
                <label>Težina:</label>
                <input
                type="number"
                name="tezina"
                value={ciljevi.tezina}
                onChange={handleCiljeviChange}
                />
            </div>
            <div>
                <label>Dnevne kalorije:</label>
                <input
                type="number"
                name="kalorije"
                value={ciljevi.kalorije}
                onChange={handleCiljeviChange}
                />
            </div>
            <Button type="button" onClick={handleCiljeviSubmit}>Sačuvaj ciljeve</Button>
            </section>

            <section style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
            <h2>Parametri</h2>
            <div>
                <label>Težina:</label>
                <input
                type="number"
                name="tezina"
                value={parametri.tezina}
                onChange={handleParametriChange}
                />
            </div>
            <div>
                <label>Visina:</label>
                <input
                type="number"
                name="visina"
                value={parametri.visina}
                onChange={handleParametriChange}
                />
            </div>
            <div>
                <label>Masti (%):</label>
                <input
                type="number"
                name="masti"
                value={parametri.masti}
                onChange={handleParametriChange}
                />
            </div>
            <div>
                <label>Mišići (%):</label>
                <input
                type="number"
                name="misici"
                value={parametri.misici}
                onChange={handleParametriChange}
                />
            </div>
            <div>
                <label>Obim struka (cm):</label>
                <input
                type="number"
                name="obim_struka"
                value={parametri.obim_struka}
                onChange={handleParametriChange}
                />
            </div>
            <Button type="submit">Sačuvaj parametre</Button>
            </section>

            
        </form>
        </div>
        </div>
    );
}
