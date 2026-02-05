import React, { useState } from 'react';
import Button from './Button';

function DodajObrok() {
  const [naziv, setNaziv] = useState('');
  const [datum, setDatum] = useState(new Date().toISOString().split('T')[0]);
  const [namirnice, setNamirnice] = useState([{ custom_naziv: '', kolicina: '', kalorije: '' }]);

  const dodajNamirnicu = () => {
    setNamirnice([...namirnice, { custom_naziv: '', kolicina: '', kalorije: '' }]);
  };

  const handleChange = (index, field, value) => {
    const nova = [...namirnice];
    nova[index][field] = value;
    setNamirnice(nova);
  };

  const submitObrok = () => {
    fetch('http://localhost:8000/api/obroci', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token') // ako koristiš auth
      },
      body: JSON.stringify({ naziv, datum, namirnice })
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
    });
  };

  return (
    <div>
      <h2>Dodaj Obrok</h2>
      <input type="text" placeholder="Naziv obroka" value={naziv} onChange={e => setNaziv(e.target.value)} />
      <input type="date" value={datum} onChange={e => setDatum(e.target.value)} />

      <h4>Namirnice</h4>
      {namirnice.map((n, i) => (
        <div key={i}>
          <input type="text" placeholder="Naziv" value={n.custom_naziv} onChange={e => handleChange(i, 'custom_naziv', e.target.value)} />
          <input type="number" placeholder="Količina (g)" value={n.kolicina} onChange={e => handleChange(i, 'kolicina', e.target.value)} />
          <input type="number" placeholder="Kalorije" value={n.kalorije} onChange={e => handleChange(i, 'kalorije', e.target.value)} />
        </div>
      ))}
      <Button onClick={dodajNamirnicu}>Dodaj još namirnicu</Button>
      <Button onClick={submitObrok}>Sačuvaj obrok</Button>
    </div>
  );
}

export default DodajObrok;
