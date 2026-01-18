import React from 'react'

export default function AdminDashboard() {
  return (
    <div>
        {/* header kao reusable komponenta, kasnije dodajem */}
        
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
        </table>
        </section>
    </div>
  )
}
