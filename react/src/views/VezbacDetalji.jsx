// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axiosClient from "./axios-client.js";
// import Header from "../components/Header.jsx";
// import Footer from "../components/Footer.jsx";
// import Button from "../components/Button.jsx";
// import { Chart } from "react-google-charts";

// export default function VezbacDetalji() {
//   const { id } = useParams();
//   const [vezbac, setVezbac] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [isEditingParam, setIsEditingParam] = useState(false);
//   const [isEditingCilj, setIsEditingCilj] = useState(false);

//   const [isTrener] = useState(true); 

  
//   const todayDate = () => {
//     const today = new Date();
//     const yyyy = today.getFullYear();
//     const mm = String(today.getMonth() + 1).padStart(2, "0");
//     const dd = String(today.getDate()).padStart(2, "0");
//     return `${yyyy}-${mm}-${dd}`;
//   };

//   const [newParam, setNewParam] = useState({
//     date: todayDate(),
//     tezina: "",
//     visina: "",
//     bmi: "",
//     masti: "",
//     misici: "",
//     obim_struka: ""
//   });

//   const [newCilj, setNewCilj] = useState({
//     hidriranost: "",
//     tezina: "",
//     kalorije: ""
//   });

//   useEffect(() => {
//     const fetchVezbacData = async () => {
//       try {
//         const { data } = await axiosClient.get(`/users/${id}`);
//         setVezbac(data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchVezbacData();
//   }, [id]);

//   const handleAddParam = async () => {
//     try {
//       const payload = {
//         ...newParam,
//         tezina: Number(newParam.tezina),
//         visina: Number(newParam.visina),
//         bmi: Number(newParam.bmi),
//         masti: Number(newParam.masti),
//         misici: Number(newParam.misici),
//         obim_struka: Number(newParam.obim_struka)
//       };

//       const { data } = await axiosClient.post(
//         `/users/${id}/parametri`,
//         payload
//       );

//       setVezbac({ ...vezbac, parametri: [...vezbac.parametri, data] });
//       setNewParam({
//         date: todayDate(),
//         tezina: "",
//         visina: "",
//         bmi: "",
//         masti: "",
//         misici: "",
//         obim_struka: ""
//       });
//       setIsEditingParam(false);
//     } catch (err) {
//       console.error(err);
//       alert("Greška prilikom čuvanja parametra.");
//     }
//   };

//   const handleAddCilj = async () => {
//     try {
//       const payload = {
//         ...newCilj,
//         hidriranost: Number(newCilj.hidriranost),
//         tezina: Number(newCilj.tezina),
//         kalorije: Number(newCilj.kalorije)
//       };

//       const { data } = await axiosClient.post(`/users/${id}/ciljevi`, payload);
//       setVezbac({ ...vezbac, ciljevi: [...vezbac.ciljevi, data] });
//       setNewCilj({ hidriranost: "", tezina: "", kalorije: "" });
//       setIsEditingCilj(false);
//     } catch (err) {
//       console.error(err);
//       alert("Greška prilikom čuvanja cilja.");
//     }
//   };

//   if (loading)
//     return <p className="p-6 text-gray-600">Učitavanje...</p>;
//   if (!vezbac)
//     return <p className="p-6 text-red-500">Vezbač nije pronađen.</p>;

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100">
//       <Header />

//       <main className="flex-1 p-6 space-y-6">
//         {/* Osnovne informacije */}
//         <div className="p-4 bg-white rounded-lg shadow-md">
//           <h1 className="text-2xl font-bold mb-2">{vezbac.ime} {vezbac.prezime}</h1>
//           <p><strong>Email:</strong> {vezbac.email}</p>
//           {vezbac.telefon && <p><strong>Telefon:</strong> {vezbac.telefon}</p>}
//           <p><strong>Datum rođenja:</strong> {vezbac.datumRodjenja}</p>
//           <p><strong>Pol:</strong> {vezbac.pol}</p>
//         </div>

//         {/* Parametri */}
//         <div>
//           <div className="flex justify-between items-center mb-2">
//             <h2 className="text-xl font-bold">Parametri</h2>
//             {isTrener && <Button onClick={() => setIsEditingParam(!isEditingParam)}>Dodaj</Button>}
//           </div>

//           {isEditingParam && (
//             <div className="mb-4 bg-white p-4 rounded-lg shadow-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
//               <input type="date"
//                 value={newParam.date}
//                 onChange={e => setNewParam({ ...newParam, date: e.target.value })}
//                 className="border p-2 rounded"
//               />
//               <input type="number" placeholder="Težina (kg)" value={newParam.tezina} onChange={e => setNewParam({ ...newParam, tezina: e.target.value })} className="border p-2 rounded" />
//               <input type="number" placeholder="Visina (cm)" value={newParam.visina} onChange={e => setNewParam({ ...newParam, visina: e.target.value })} className="border p-2 rounded" />
//               <input type="number" placeholder="BMI" value={newParam.bmi} onChange={e => setNewParam({ ...newParam, bmi: e.target.value })} className="border p-2 rounded" />
//               <input type="number" placeholder="Masti (%)" value={newParam.masti} onChange={e => setNewParam({ ...newParam, masti: e.target.value })} className="border p-2 rounded" />
//               <input type="number" placeholder="Mišići (%)" value={newParam.misici} onChange={e => setNewParam({ ...newParam, misici: e.target.value })} className="border p-2 rounded" />
//               <input type="number" placeholder="Obim struka (cm)" value={newParam.obim_struka} onChange={e => setNewParam({ ...newParam, obim_struka: e.target.value })} className="border p-2 rounded" />
//               <Button onClick={handleAddParam}>Sačuvaj</Button>
//             </div>
//           )}

//           {vezbac.parametri.length > 0 ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {vezbac.parametri.map(param => (
//                 <div key={param.id} className="bg-white p-4 rounded-lg shadow-md">
//                   <p><strong>Datum:</strong> {param.date}</p>
//                   <p><strong>Težina:</strong> {param.tezina} kg</p>
//                   <p><strong>Visina:</strong> {param.visina} cm</p>
//                   <p><strong>BMI:</strong> {param.bmi}</p>
//                   <p><strong>Masti:</strong> {param.masti}%</p>
//                   <p><strong>Mišići:</strong> {param.misici}%</p>
//                   <p><strong>Obim struka:</strong> {param.obim_struka} cm</p>
//                 </div>
//               ))}
//             </div>
//           ) : <p className="text-gray-600">Nema unetih parametara.</p>}
//           {vezbac.parametri.length > 0 && (
//   <div className="mt-4 bg-red-50 rounded-xl p-4 shadow">
//     <Chart
//       chartType="LineChart"
//       width="100%"
//       height="300px"
//       data={[
//         ["Datum", "Težina", "BMI"],
//         ...vezbac.parametri.map(p => [p.date, p.tezina || 0, p.bmi || 0])
//       ]}
//       options={{
//         title: "Napredak parametara",
//         curveType: "function",
//         legend: { position: "bottom", alignment: "center" },
//         colors: ["#EF4444", "#3B82F6"], // crvena i plava linija
//         pointSize: 5,
//         lineWidth: 3,
//         hAxis: {
//           title: "Datum",
//           textStyle: { fontSize: 12, color: "#333" },
//           slantedText: true,
//           slantedTextAngle: 45
//         },
//         vAxis: {
//           title: "Vrednost",
//           minValue: 0,
//           gridlines: { color: "#e0e0e0" }
//         },
//         tooltip: { isHtml: true, textStyle: { fontSize: 12 } },
//         chartArea: { left: 60, right: 20, top: 50, bottom: 80 },
//         backgroundColor: "#fef3f2"
//       }}
//     />
//   </div>
// )}
//         </div>

//         {/* Ciljevi */}
//         <div>
//           <div className="flex justify-between items-center mb-2">
//             <h2 className="text-xl font-bold">Ciljevi</h2>
//             {isTrener && <Button onClick={() => setIsEditingCilj(!isEditingCilj)}>Dodaj</Button>}
//           </div>

//           {isEditingCilj && (
//             <div className="mb-4 bg-white p-4 rounded-lg shadow-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
//               <input type="number" placeholder="Hidriranost (l)" value={newCilj.hidriranost} onChange={e => setNewCilj({ ...newCilj, hidriranost: e.target.value })} className="border p-2 rounded" />
//               <input type="number" placeholder="Težina (kg)" value={newCilj.tezina} onChange={e => setNewCilj({ ...newCilj, tezina: e.target.value })} className="border p-2 rounded" />
//               <input type="number" placeholder="Kalorije" value={newCilj.kalorije} onChange={e => setNewCilj({ ...newCilj, kalorije: e.target.value })} className="border p-2 rounded" />
//               <Button onClick={handleAddCilj}>Sačuvaj</Button>
//             </div>
//           )}

//           {vezbac.ciljevi.length > 0 ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {vezbac.ciljevi.map(cilj => (
//                 <div key={cilj.id} className="bg-white p-4 rounded-lg shadow-md">
//                   {cilj.hidriranost && <p><strong>Hidriranost:</strong> {cilj.hidriranost} l</p>}
//                   {cilj.tezina && <p><strong>Težina:</strong> {cilj.tezina} kg</p>}
//                   {cilj.kalorije && <p><strong>Kalorije:</strong> {cilj.kalorije} kcal</p>}
//                   <p><strong>Datum kreiranja:</strong> {new Date(cilj.created_at).toLocaleDateString()}</p>
//                 </div>
//               ))}
//             </div>
//           ) : <p className="text-gray-600">Nema postavljenih ciljeva.</p>}
//           {vezbac.ciljevi.length > 0 && (
//   <div className="mt-4 bg-blue-50 rounded-xl p-4 shadow">
//     <Chart
//       chartType="LineChart"
//       width="100%"
//       height="300px"
//       data={[
//         ["Datum", "Težina", "Hidriranost"],
//         ...vezbac.ciljevi.map(c => [new Date(c.created_at).toLocaleDateString("sr-RS"), c.tezina || 0, c.hidriranost || 0])
//       ]}
//       options={{
//         title: "Napredak ciljeva",
//         curveType: "function",
//         legend: { position: "bottom", alignment: "center" },
//         colors: ["#4F46E5", "#10B981"], // plava i zelena linija
//         pointSize: 6,
//         lineWidth: 3,
//         hAxis: {
//           title: "Datum",
//           textStyle: { fontSize: 12, color: "#333" },
//           slantedText: true,
//           slantedTextAngle: 45
//         },
//         vAxis: {
//           title: "Vrednost",
//           minValue: 0,
//           gridlines: { color: "#e0e0e0" }
//         },
//         tooltip: { isHtml: true, textStyle: { fontSize: 12 } },
//         chartArea: { left: 60, right: 20, top: 50, bottom: 80 },
//         backgroundColor: "#f9fafb"
//       }}
//     />
//   </div>
// )}
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "./axios-client.js";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Button from "../components/Button.jsx";
import { Chart } from "react-google-charts";

export default function VezbacDetalji() {
  const { id } = useParams();
  const [vezbac, setVezbac] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditingParam, setIsEditingParam] = useState(false);
  const [isEditingCilj, setIsEditingCilj] = useState(false);
  const [isTrener] = useState(true);

  const todayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const [newParam, setNewParam] = useState({
    date: todayDate(),
    tezina: "",
    visina: "",
    bmi: "",
    masti: "",
    misici: "",
    obim_struka: ""
  });

  const [newCilj, setNewCilj] = useState({
    hidriranost: "",
    tezina: "",
    kalorije: ""
  });

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("sr-RS");
  };

  useEffect(() => {
    const fetchVezbacData = async () => {
      try {
        const { data } = await axiosClient.get(`/users/${id}`);
        setVezbac(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVezbacData();
  }, [id]);

  const handleAddParam = async () => {
    try {
      const payload = {
        ...newParam,
        tezina: Number(newParam.tezina),
        visina: Number(newParam.visina),
        bmi: Number(newParam.bmi),
        masti: Number(newParam.masti),
        misici: Number(newParam.misici),
        obim_struka: Number(newParam.obim_struka)
      };
      const { data } = await axiosClient.post(`/users/${id}/parametri`, payload);
      setVezbac({ ...vezbac, parametri: [...vezbac.parametri, data] });
      setNewParam({
        date: todayDate(),
        tezina: "",
        visina: "",
        bmi: "",
        masti: "",
        misici: "",
        obim_struka: ""
      });
      setIsEditingParam(false);
    } catch (err) {
      console.error(err);
      alert("Greška prilikom čuvanja parametra.");
    }
  };

  const handleAddCilj = async () => {
    try {
      const payload = {
        ...newCilj,
        hidriranost: Number(newCilj.hidriranost),
        tezina: Number(newCilj.tezina),
        kalorije: Number(newCilj.kalorije)
      };
      const { data } = await axiosClient.post(`/users/${id}/ciljevi`, payload);
      setVezbac({ ...vezbac, ciljevi: [...vezbac.ciljevi, data] });
      setNewCilj({ hidriranost: "", tezina: "", kalorije: "" });
      setIsEditingCilj(false);
    } catch (err) {
      console.error(err);
      alert("Greška prilikom čuvanja cilja.");
    }
  };

  if (loading) return <p className="p-6 text-gray-600">Učitavanje...</p>;
  if (!vezbac) return <p className="p-6 text-red-500">Vezbač nije pronađen.</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-1 p-6 space-y-6">
        {/* Osnovne informacije */}
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-2">{vezbac.ime} {vezbac.prezime}</h1>
          <p><strong>Email:</strong> {vezbac.email}</p>
          {vezbac.telefon && <p><strong>Telefon:</strong> {vezbac.telefon}</p>}
          <p><strong>Datum rođenja:</strong> {formatDate(vezbac.datumRodjenja)}</p>
          <p><strong>Pol:</strong> {vezbac.pol}</p>
        </div>

        {/* PARAMETRI */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between mb-2">
            <h2 className="text-xl font-bold">Parametri</h2>
            {isTrener && <Button onClick={() => setIsEditingParam(!isEditingParam)}>Dodaj parametar</Button>}
          </div>

          {isEditingParam && (
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <input type="date" value={newParam.date} onChange={e => setNewParam({...newParam, date: e.target.value})} className="border p-2 rounded"/>
              <input type="number" placeholder="Težina (kg)" value={newParam.tezina} onChange={e => setNewParam({...newParam, tezina: e.target.value})} className="border p-2 rounded"/>
              <input type="number" placeholder="Visina (cm)" value={newParam.visina} onChange={e => setNewParam({...newParam, visina: e.target.value})} className="border p-2 rounded"/>
              <input type="number" placeholder="BMI" value={newParam.bmi} onChange={e => setNewParam({...newParam, bmi: e.target.value})} className="border p-2 rounded"/>
              <input type="number" placeholder="Masti (%)" value={newParam.masti} onChange={e => setNewParam({...newParam, masti: e.target.value})} className="border p-2 rounded"/>
              <input type="number" placeholder="Mišići (%)" value={newParam.misici} onChange={e => setNewParam({...newParam, misici: e.target.value})} className="border p-2 rounded"/>
              <input type="number" placeholder="Obim struka (cm)" value={newParam.obim_struka} onChange={e => setNewParam({...newParam, obim_struka: e.target.value})} className="border p-2 rounded"/>
              <Button onClick={handleAddParam}>Sačuvaj</Button>
            </div>
          )}

          {vezbac.parametri.length > 0 ? (
            <>
              <table className="w-full text-sm border border-gray-200 rounded-lg mb-4">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2">Datum</th>
                    <th className="px-3 py-2">Težina (kg)</th>
                    <th className="px-3 py-2">Visina (cm)</th>
                    <th className="px-3 py-2">BMI</th>
                    <th className="px-3 py-2">Masti (%)</th>
                    <th className="px-3 py-2">Mišići (%)</th>
                    <th className="px-3 py-2">Obim struka (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {vezbac.parametri.map(param => (
                    <tr key={param.id} className="border-t hover:bg-gray-50">
                      <td className="px-3 py-2">{formatDate(param.date)}</td>
                      <td className="px-3 py-2">{param.tezina}</td>
                      <td className="px-3 py-2">{param.visina}</td>
                      <td className="px-3 py-2">{param.bmi}</td>
                      <td className="px-3 py-2">{param.masti}</td>
                      <td className="px-3 py-2">{param.misici}</td>
                      <td className="px-3 py-2">{param.obim_struka}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Grafikoni parametri */}
              <Chart
                chartType="LineChart"
                width="100%"
                height="300px"
                data={[
                  ["Datum", "Težina", "BMI"],
                  ...vezbac.parametri.map(p => [formatDate(p.date), p.tezina || 0, p.bmi || 0])
                ]}
                options={{
                  title: "Napredak parametara",
                  curveType: "function",
                  legend: { position: "bottom" },
                  colors: ["#EF4444", "#3B82F6"],
                  pointSize: 5,
                  lineWidth: 3,
                  hAxis: { slantedText: true, slantedTextAngle: 45 },
                  vAxis: { minValue: 0 },
                  chartArea: { left: 60, right: 20, top: 50, bottom: 80 }
                }}
              />
            </>
          ) : <p className="text-gray-600">Nema unetih parametara.</p>}
        </div>

        {/* CILJEVI */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between mb-2">
            <h2 className="text-xl font-bold">Ciljevi</h2>
            {isTrener && <Button onClick={() => setIsEditingCilj(!isEditingCilj)}>Dodaj cilj</Button>}
          </div>

          {isEditingCilj && (
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <input type="number" placeholder="Hidriranost (L)" value={newCilj.hidriranost} onChange={e => setNewCilj({...newCilj, hidriranost: e.target.value})} className="border p-2 rounded"/>
              <input type="number" placeholder="Težina (kg)" value={newCilj.tezina} onChange={e => setNewCilj({...newCilj, tezina: e.target.value})} className="border p-2 rounded"/>
              <input type="number" placeholder="Kalorije" value={newCilj.kalorije} onChange={e => setNewCilj({...newCilj, kalorije: e.target.value})} className="border p-2 rounded"/>
              <Button onClick={handleAddCilj}>Sačuvaj</Button>
            </div>
          )}

          {vezbac.ciljevi.length > 0 ? (
            <>
              <table className="w-full text-sm border border-gray-200 rounded-lg mb-4">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2">Hidriranost (L)</th>
                    <th className="px-3 py-2">Težina (kg)</th>
                    <th className="px-3 py-2">Kalorije</th>
                    <th className="px-3 py-2">Datum</th>
                  </tr>
                </thead>
                <tbody>
                  {vezbac.ciljevi.map(c => (
                    <tr key={c.id} className="border-t hover:bg-gray-50">
                      <td className="px-3 py-2">{c.hidriranost}</td>
                      <td className="px-3 py-2">{c.tezina}</td>
                      <td className="px-3 py-2">{c.kalorije}</td>
                      <td className="px-3 py-2">{formatDate(c.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Grafikoni ciljevi */}
              <Chart
                chartType="LineChart"
                width="100%"
                height="300px"
                data={[
                  ["Datum", "Težina", "Hidriranost"],
                  ...vezbac.ciljevi.map(c => [formatDate(c.created_at), c.tezina || 0, c.hidriranost || 0])
                ]}
                options={{
                  title: "Napredak ciljeva",
                  curveType: "function",
                  legend: { position: "bottom" },
                  colors: ["#4F46E5", "#10B981"],
                  pointSize: 6,
                  lineWidth: 3,
                  hAxis: { slantedText: true, slantedTextAngle: 45 },
                  vAxis: { minValue: 0 },
                  chartArea: { left: 60, right: 20, top: 50, bottom: 80 }
                }}
              />
            </>
          ) : <p className="text-gray-600">Nema postavljenih ciljeva.</p>}
        </div>

      </main>
      <Footer />
    </div>
  );
}