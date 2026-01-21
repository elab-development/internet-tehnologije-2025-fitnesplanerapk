
import React, { useState, useEffect } from "react";
import axiosClient from "./axios-client.js";

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    // const [exercises, setExercises] = useState({
    //   gornji: [],
    //   donji: [],
    //   kardio: []
    // });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    
      const fetchData = async () => {
        try {
          const usersResponse = await axiosClient.get("/admin/users"); // backend endpoint
          //const exercisesResponse = await axiosClient.get("/admin/exercises"); // backend endpoint

          setUsers(usersResponse.data);
          //setExercises(exercisesResponse.data);
          setLoading(false);
        } catch (err) {
          console.log(err);
          setError("Greška prilikom učitavanja podataka.");
          setLoading(false);
        }
      };

      fetchData();
    }, []);

    if (loading) return <p>Učitavanje podataka...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

   return (
    <div>
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Upravljanje korisnicima i vežbama</p>
      </header>

      <section className="card users-section">
        <h2>Lista korisnika</h2>
        <table className="users-table">
          <thead>
            <tr>
              <th>Ime</th>
              <th>Prezime</th>
              <th>Email</th>
              <th>Username</th>
              <th>Datum registracije</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u.id}>
                  <td>{u.ime}</td>
                  <td>{u.prezime}</td>
                  <td>{u.email}</td>
                  <td>{u.username}</td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">Nema korisnika</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="card exercises-section">
        <h2>Lista vežbi</h2>
        <table className="exercises-table">
          <thead>
            <tr>
              <th>Gornji deo tela</th>
              <th>Donji deo tela</th>
              <th>Kardio vežbe</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="3">Podaci o vežbama će biti dodati kasnije</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
