
import {Link} from "react-router-dom";
import React from 'react'

export default function Register() {

  const onSubmit =(ev)=>{

      ev.preventDefault()
  }

  return (
     <div>
            <div>
                <form onSubmit={onSubmit}>
                    <h1>Napravite svoj nalog!</h1>
                    <input type="ime" placeholder="Ime" />
                    <input type="prezime" placeholder="Prezime" />
                    <input type="mail" placeholder="Mail adresa" />
                    <input type="username" placeholder="Korisničko ime" />
                    <input type="password" placeholder="Lozinka" />
                    <input type="pol" placeholder="Pol" />
                    <input type="datumRodjenja" placeholder="Datum rodjenja" />
                    <button>Login</button>
                    <p>
                        Imate nalog? <Link to="/login">Ulogujte se u svoj nalog!</Link>
                    </p>
                </form>
            </div>
        </div>
  )
}

