import React from 'react'

export default function Dashboard() {
  return (
    <div class="dashboard">
      {/* header aplikacije ubacujem kao reusable komponentu posle */}
      <header className="dashboard-header">
        <h1>Moj fitness dashboard</h1>
        <p>Pregled tvog napretka i plana</p>
      </header>
    <section className="card user-info">
        <h2>Moji podaci</h2>
        <ul>
          <li>Ime: <strong>Ime Prezime</strong></li>
          <li>Prezme: <strong>Ime Prezime</strong></li>
          <li>Pol: <strong>Ženski</strong></li>
          <li>Datum rodjenja: <strong>25</strong></li>
        </ul>
      </section>

      <section className="card parametri">
        <h2>Trenutni parametri</h2>
        <ul>
          <li>Datum unosa: <strong>...</strong></li>
          <li>Težina: <strong>...</strong></li>
          <li>Visina: <strong>...</strong></li>
          <li>BMI: <strong>...</strong></li>
          <li>Procenat masti: <strong>...</strong></li>
          <li>Procenat mišića: <strong>...</strong></li>
          <li>Obim struka: <strong>...</strong></li>
        </ul>
        <h2>Prethodno uneti parametri</h2>
        <tbody>
          {/* {parametri.map(p => (
            <tr key={p.id}>
              <td>{p.naziv}</td>
              <td>{p.vrednost}</td>
              <td>{p.jedinica}</td>
              <td>{p.datumUnosa}</td>
            </tr>
          ))} */}
        </tbody>
      </section>
      

      <section className="card goal">
        <h2>Moji cilj</h2>
        <p>
          Hidriranost
        </p>
        <p>
          Težina
        </p>
        <p>
          Dnevne kalorije
        </p>
      </section>

      
    <section>
       <h2>Planovi ishrane</h2>
        <table className="nutrition-plan-table">
          <thead>
            <tr>
              <th>Naziv obroka</th>
              
              <th>Kalorije</th>
              <th>Proteini (g)</th>
              <th>UH</th>
              <th>Masti (g)</th>
              <th>Datum</th>
            </tr>
          </thead>

          <tbody>
            {/* {planIshrane.map(obrok => (
              <tr key={obrok.id}>
                <td>{obrok.nazivObroka}</td>
                
                <td>{obrok.kalorije}</td>
                <td>{obrok.proteini}</td>
                <td>{obrok.ugljeniHidrati}</td>
                <td>{obrok.masti}</td>
                <td>{obrok.datun}</td>
              </tr>
            ))} */}
          </tbody>
        </table>
    </section>

    <section>
      <h2>Planovi treninga</h2>
         <table className="training-plan-table">
            <thead>
              <tr>
                <th>Naziv treninga</th>
                <th>Tip</th>
                <th>Trajanje (min)</th>
                <th>Intenzitet</th>
                <th>Datum</th>
                <th>Vreme</th>
                <th>Potrosene kalorije</th>
              </tr>
            </thead>

            <tbody>
              {/* {planTreninga.map(trening => (
                <tr key={trening.id}>
                  <td>{trening.naziv}</td>
                  <td>{trening.tip}</td>
                  <td>{trening.trajanje}</td>
                  <td>{trening.intenzitet}</td>
                  <td>{trening.datum}</td>
                  <td>{trening.vreme}</td>
                </tr>
              ))} */}
            </tbody>
          </table>    
    </section>
   
    </div>
  )
}
