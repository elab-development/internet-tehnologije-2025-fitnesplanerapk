
// import React, { useState, useEffect } from "react";
// import axiosClient from "./axios-client.js";
// import Header from '../components/Header.jsx';
// export default function AdminDashboard() {
//     const [users, setUsers] = useState([]);
//     // const [exercises, setExercises] = useState({
//     //   gornji: [],
//     //   donji: [],
//     //   kardio: []
//     // });
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
    
//       const fetchData = async () => {
//         try {
//           const usersResponse = await axiosClient.get("/admin/users"); // backend endpoint
//           //const exercisesResponse = await axiosClient.get("/admin/exercises"); // backend endpoint

//           setUsers(usersResponse.data);
//           //setExercises(exercisesResponse.data);
//           setLoading(false);
//         } catch (err) {
//           console.log(err);
//           setError("Greška prilikom učitavanja podataka.");
//           setLoading(false);
//         }
//       };

//       fetchData();
//     }, []);

//     if (loading) return <p>Učitavanje podataka...</p>;
//     if (error) return <p style={{ color: "red" }}>{error}</p>;

//    return (
//     <div>
//       <Header></Header>
//       <header className="admin-header">
//         <h1>Admin Dashboard</h1>
//         <p>Upravljanje korisnicima i vežbama</p>
//       </header>

//       <section className="card users-section">
//         <h2>Lista korisnika</h2>
//         <table className="users-table">
//           <thead>
//             <tr>
//               <th>Ime</th>
//               <th>Prezime</th>
//               <th>Email</th>
//               <th>Username</th>
//               <th>Datum registracije</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.length > 0 ? (
//               users.map((u) => (
//                 <tr key={u.id}>
//                   <td>{u.ime}</td>
//                   <td>{u.prezime}</td>
//                   <td>{u.email}</td>
//                   <td>{u.username}</td>
//                   <td>{new Date(u.created_at).toLocaleDateString()}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5">Nema korisnika</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </section>

//       <section className="card exercises-section">
//         <h2>Lista vežbi</h2>
//         <table className="exercises-table">
//           <thead>
//             <tr>
//               <th>Gornji deo tela</th>
//               <th>Donji deo tela</th>
//               <th>Kardio vežbe</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td colSpan="3">Podaci o vežbama će biti dodati kasnije</td>
//             </tr>
//           </tbody>
//         </table>
//       </section>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import axiosClient from "./axios-client.js";
import Header from '../components/Header.jsx';
import Button from "../components/Button.jsx";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

   const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("sr-RS");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axiosClient.get("/admin/users");
        setUsers(usersResponse.data);
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-8">

        {/* ===== LISTA KORISNIKA ===== */}
        <section className="mb-10">
          <h1 className="text-3xl font-bold text-textPrimary mb-4">Lista korisnika</h1>
          <div className="bg-surface rounded-xl p-6 shadow overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2 text-left">Ime</th>
                  <th className="border px-4 py-2 text-left">Prezime</th>
                  <th className="border px-4 py-2 text-left">Email</th>
                  <th className="border px-4 py-2 text-left">Username</th>
                  <th className="border px-4 py-2 text-left">Datum registracije</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-100">
                      <td className="border px-4 py-2">{u.ime}</td>
                      <td className="border px-4 py-2">{u.prezime}</td>
                      <td className="border px-4 py-2">{u.email}</td>
                      <td className="border px-4 py-2">{u.username}</td>
                      <td className="border px-4 py-2">{formatDate(new Date(u.created_at).toLocaleDateString())}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">Nema korisnika</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ===== PANEL ZA VEŽBE ===== */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-textPrimary">Lista vežbi</h1>
            <Button type="button">Dodaj vežbu</Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="col-span-full bg-surface rounded-xl p-6 shadow text-center text-gray-500">
              Trenutno nema unetih vežbi
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
