// import React from 'react'

// export default function Dashboard() {
//   return (
//     <div class="dashboard">
//       {/* header aplikacije ubacujem kao reusable komponentu posle */}
//       <header className="dashboard-header">
//         <h1>Moj fitness dashboard</h1>
//         <p>Pregled tvog napretka i plana</p>
//       </header>
//     <section className="card user-info">
//         <h2>Moji podaci</h2>
//         <ul>
//           <li>Ime: <strong>Ime Prezime</strong></li>
//           <li>Prezme: <strong>Ime Prezime</strong></li>
//           <li>Pol: <strong>Ženski</strong></li>
//           <li>Datum rodjenja: <strong>25</strong></li>
//         </ul>
//       </section>

//       <section className="card parametri">
//         <h2>Trenutni parametri</h2>
//         <ul>
//           <li>Datum unosa: <strong>...</strong></li>
//           <li>Težina: <strong>...</strong></li>
//           <li>Visina: <strong>...</strong></li>
//           <li>BMI: <strong>...</strong></li>
//           <li>Procenat masti: <strong>...</strong></li>
//           <li>Procenat mišića: <strong>...</strong></li>
//           <li>Obim struka: <strong>...</strong></li>
//         </ul>
//         <h2>Prethodno uneti parametri</h2>
//         <tbody>
//           {/* {parametri.map(p => (
//             <tr key={p.id}>
//               <td>{p.naziv}</td>
//               <td>{p.vrednost}</td>
//               <td>{p.jedinica}</td>
//               <td>{p.datumUnosa}</td>
//             </tr>
//           ))} */}
//         </tbody>
//       </section>
      

//       <section className="card goal">
//         <h2>Moji cilj</h2>
//         <p>
//           Hidriranost
//         </p>
//         <p>
//           Težina
//         </p>
//         <p>
//           Dnevne kalorije
//         </p>
//       </section>

      
//     <section>
//        <h2>Planovi ishrane</h2>
//         <table className="nutrition-plan-table">
//           <thead>
//             <tr>
//               <th>Naziv obroka</th>
              
//               <th>Kalorije</th>
//               <th>Proteini (g)</th>
//               <th>UH</th>
//               <th>Masti (g)</th>
//               <th>Datum</th>
//             </tr>
//           </thead>

//           <tbody>
//             {/* {planIshrane.map(obrok => (
//               <tr key={obrok.id}>
//                 <td>{obrok.nazivObroka}</td>
                
//                 <td>{obrok.kalorije}</td>
//                 <td>{obrok.proteini}</td>
//                 <td>{obrok.ugljeniHidrati}</td>
//                 <td>{obrok.masti}</td>
//                 <td>{obrok.datun}</td>
//               </tr>
//             ))} */}
//           </tbody>
//         </table>
//     </section>

//     <section>
//       <h2>Planovi treninga</h2>
//          <table className="training-plan-table">
//             <thead>
//               <tr>
//                 <th>Naziv treninga</th>
//                 <th>Tip</th>
//                 <th>Trajanje (min)</th>
//                 <th>Intenzitet</th>
//                 <th>Datum</th>
//                 <th>Vreme</th>
//                 <th>Potrosene kalorije</th>
//               </tr>
//             </thead>

//             <tbody>
//               {/* {planTreninga.map(trening => (
//                 <tr key={trening.id}>
//                   <td>{trening.naziv}</td>
//                   <td>{trening.tip}</td>
//                   <td>{trening.trajanje}</td>
//                   <td>{trening.intenzitet}</td>
//                   <td>{trening.datum}</td>
//                   <td>{trening.vreme}</td>
//                 </tr>
//               ))} */}
//             </tbody>
//           </table>    
//     </section>
   
//     </div>
//   )
// }
import React, { useEffect, useState } from 'react';
import { useStateContext } from '../contexts/ContextProvider.jsx';
import axiosClient from './axios-client.js';

export default function Dashboard() {
  const { user } = useStateContext();

  const [parametri, setParametri] = useState([]);
  const [ciljevi, setCiljevi] = useState([]);

  // useEffect(() => {
  //   if (!user) return;

  //   axiosClient.get('/parametri')
  //     .then(res => {
        
  //       const sorted = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
  //       setParametri(sorted);
  //     })
  //     .catch(err => console.log(err));

    
  //   axiosClient.get('/cilj')
  //     .then(res => {
  //       const sorted = res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  //       setCiljevi(sorted);
  //     })
  //     .catch(err => console.log(err));

  // }, [user]);
  useEffect(() => {
    if (!user) return;

    axiosClient.get('/all-parametri')
      .then(res => setParametri(res.data))
      .catch(err => console.log(err));

    axiosClient.get('/all-ciljevi')
      .then(res => setCiljevi(res.data))
      .catch(err => console.log(err));
  }, [user]);


  // Helper za prikaz poslednjeg unosa ili "–"
  const lastParam = parametri[0] || {};
  const lastCilj = ciljevi[0] || {};

  return (
    <div className="dashboard">

      <header className="dashboard-header">
        <h1>Moj fitness dashboard</h1>
        <p>Pregled tvog napretka i plana</p>
      </header>

      <section className="card user-info">
        <h2>Moji podaci</h2>
        <table>
          <tbody>
            <tr><td>Ime</td><td>{user?.ime || '-'}</td></tr>
            <tr><td>Prezime</td><td>{user?.prezime || '-'}</td></tr>
            <tr><td>Pol</td><td>{user?.pol || '-'}</td></tr>
            <tr><td>Datum rođenja</td><td>{user?.datumRodjenja || '-'}</td></tr>
          </tbody>
        </table>
      </section>

      <section className="card parametri">
        <h2>Trenutni parametri</h2>
        <table>
          <thead>
            <tr>
              <th>Datum unosa</th>
              <th>Težina</th>
              <th>Visina</th>
              <th>BMI</th>
              <th>Masti (%)</th>
              <th>Mišići (%)</th>
              <th>Obim struka (cm)</th>
            </tr>
          </thead>
          <tbody>
            {parametri.map(p => (
              <tr key={p.id}>
                <td>{p.date}</td>
                <td>{p.tezina}</td>
                <td>{p.visina}</td>
                <td>{p.bmi}</td>
                <td>{p.masti}</td>
                <td>{p.misici}</td>
                <td>{p.obim_struka}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card ciljevi">
        <h2>Moji ciljevi</h2>
        <table>
          <thead>
            <tr>
              <th>Hidriranost</th>
              <th>Težina</th>
              <th>Dnevne kalorije</th>
              <th>Datum unosa</th>
            </tr>
          </thead>
          <tbody>
            {ciljevi.map(c => (
              <tr key={c.id}>
                <td>{c.hidriranost}</td>
                <td>{c.tezina}</td>
                <td>{c.kalorije}</td>
                <td>{c.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card nutrition-plan">
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
         
          </tbody>
        </table>
      </section>

      <section className="card training-plan">
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
            
          </tbody>
        </table>
      </section>

    </div>
  )
}
