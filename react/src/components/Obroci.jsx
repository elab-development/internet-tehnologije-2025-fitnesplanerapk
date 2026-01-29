import React, { useState, useEffect } from 'react';

function Obroci() {
  const [datum, setDatum] = useState(new Date().toISOString().split('T')[0]);
  const [obroci, setObroci] = useState([]);
  const [ukupnoKalorija, setUkupnoKalorija] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:8000/api/obroci?datum=${datum}`, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token') // ako koristiš auth
      }
    })
      .then(res => res.json())
      .then(data => {
        setObroci(data.obroci);
        setUkupnoKalorija(data.ukupno_kalorija);
      });
  }, [datum]);

  return (
    <div>
      <h2>Obroci za {datum}</h2>
      <input type="date" value={datum} onChange={e => setDatum(e.target.value)} />
      <p>Ukupno kalorija: {ukupnoKalorija}</p>

      {obroci.map(obrok => (
        <div key={obrok.id} style={{border: '1px solid #ccc', padding: '10px', margin: '10px 0'}}>
          <h3>{obrok.naziv}</h3>
          <ul>
            {obrok.namirnice.map(n => (
              <li key={n.id}>
                {n.namirnica_id ? n.namirnica_id : n.custom_naziv} - {n.kalorije} kcal
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Obroci;
