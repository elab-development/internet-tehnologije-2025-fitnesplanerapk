
import { Link } from "react-router-dom";
import React, { useRef, useState } from "react";
import axiosClient from "./axios-client.js";
import { useStateContext } from "../contexts/ContextProvider.jsx";

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
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 422) {
            setErrors(err.response.data.errors);
          } else {
            console.log(err.response.status);
            console.log(err.response.data);
          }
        } else {
          console.log("Network / CORS error");
        }
      });
  };

  return (
    <div>
      <h1>Napravite svoj nalog!</h1>
      {errors && (
        <div className="alert">
          {Object.keys(errors).map((key) => (
            <p key={key}>{errors[key][0]}</p>
          ))}
        </div>
      )}
      <form onSubmit={onSubmit}>
        <input ref={imeRef} type="text" placeholder="Ime" />
        <input ref={prezimeRef} type="text" placeholder="Prezime" />
        <input ref={emailRef} type="email" placeholder="Email adresa" />
        <input ref={usernameRef} type="text" placeholder="Korisničko ime" />
        <input ref={passwordRef} type="password" placeholder="Lozinka" />
        <input ref={polRef} type="text" placeholder="Pol" />
        <input ref={datumRodjenjaRef} type="date" placeholder="Datum rodjenja" />
        <button type="submit">Register</button>
      </form>
      <p>
        Imate nalog? <Link to="/login">Ulogujte se u svoj nalog!</Link>
      </p>
    </div>
  );
}
