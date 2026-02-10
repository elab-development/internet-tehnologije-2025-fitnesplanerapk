import { Link } from "react-router-dom";
import React, { useRef, useState } from "react";
import axiosClient from "./axios-client.js";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css"
import Button from "../components/Button.jsx";
export default function Register() {
  const imeRef = useRef();
  const prezimeRef = useRef();
  const emailRef = useRef();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const polRef = useRef();
  const datumRodjenjaRef = useRef();
  const { setUser, setToken } = useStateContext();
  const [errors, setErrors] = useState(null);
  const [message, setMessage] = useState(null); 
  const [messageType, setMessageType] = useState(""); 
  const navigate = useNavigate();

  const onSubmit = (ev) => {
    ev.preventDefault();
    const information = {
      ime: imeRef.current.value,
      prezime: prezimeRef.current.value,
      email: emailRef.current.value,
      username: usernameRef.current.value,
      password: passwordRef.current.value,
      pol: polRef.current.value,
      datumRodjenja: datumRodjenjaRef.current.value,
    };

    axiosClient
      .post("/register", information)
      .then(({ data }) => {
        setUser(data.user);
        setToken(data.token);
        setErrors(null);
        setMessage("Uspešno ste registrovani!"); 
        setMessageType("success");
        navigate("/userSetup");
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 422) {
            setErrors(err.response.data.errors);
            setMessage("Registracija nije uspela! Proverite podatke."); 
            setMessageType("error");
          } else {
            console.log(err.response.status);
            console.log(err.response.data);
            setMessage("Došlo je do greške. Pokušajte kasnije.");
            setMessageType("error");
          }
        } else {
          console.log("Network / CORS error");
          setMessage("Network / CORS error. Pokušajte kasnije.");
          setMessageType("error");
        }
      });
  };

  return (
  <div className="register-container">
    <form className="register-form" onSubmit={onSubmit}>
      <h1>Napravite svoj nalog!</h1>

      
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      
      {errors && (
        <div>
          {Object.keys(errors).map((key) => (
            <p key={key} className="error-text">
              {errors[key][0]}
            </p>
          ))}
        </div>
      )}

    
      <input ref={imeRef} type="text" placeholder="Ime" />
      <input ref={prezimeRef} type="text" placeholder="Prezime" />
      <input ref={emailRef} type="email" placeholder="Email adresa" />
      <input ref={usernameRef} type="text" placeholder="Korisničko ime" />
      <input ref={passwordRef} type="password" placeholder="Lozinka" />

      
      <select ref={polRef} name="pol" defaultValue="">
        <option value="" disabled>Izaberite pol</option>
        <option value="muski">Muški</option>
        <option value="zenski">Ženski</option>
      </select>

      <input ref={datumRodjenjaRef} type="date" placeholder="Datum rođenja" />

    
      <Button type="submit">Register</Button>

      
      <p>
        Imate nalog? <Link to="/login">Ulogujte se u svoj nalog!</Link>
      </p>
    </form>
  </div>
);

}
