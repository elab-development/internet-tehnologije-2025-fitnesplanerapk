
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import axiosClient from "./axios-client.js";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import "../styles/Login.css";
export default function Login() {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const { setUser, setToken } = useStateContext();
  const [errors, setErrors] = useState(null);
  const [message, setMessage] = useState(null); 
  const [messageType, setMessageType] = useState(""); 
  const navigate = useNavigate();  
  const onSubmit = (ev) => {
    ev.preventDefault();

    const loginData = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };

    axiosClient
      .post("/login", loginData)
      .then(({ data }) => {
        console.log("LOGIN RESPONSE:", data);
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("ACCESS_TOKEN", data.token);
        setErrors(null);
        setMessage("Uspešno ste ulogovani!");
        setMessageType("success");
        if (data.user.uloga_id === 2) {
          navigate("/admin_dashboard");
        } 
        else if(data.user.uloga_id === 3)
          {navigate("/trenerStranica");}
        else {
          navigate("/dashboard");
        }
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 422 || err.response.status === 401) {
            setErrors(err.response.data.errors || { login: [err.response.data.message] });
            setMessage("Login neuspešan. Proverite podatke.");
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
    <div className="login-container">
      <form onSubmit={onSubmit} className="login-form">
        <h1>Ulogujte se u svoj nalog!</h1>

       
        {message && (
          <div
            style={{
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              color: "#fff",
              backgroundColor: messageType === "success" ? "green" : "red",
            }}
          >
            {message}
          </div>
        )}

        {errors &&
          Object.keys(errors).map((key) => (
            <p key={key} style={{ color: "red" }}>
              {errors[key][0]}
            </p>
          ))}

        <input ref={usernameRef} type="text" placeholder="Korisničko ime" />
        <input ref={passwordRef} type="password" placeholder="Šifra" />
        <Button type="submit" className="w-full">Login</Button>
        <p>
          Nemate nalog? <Link to="/register">Napravite svoj nalog!</Link>
        </p>
      </form>
    </div>
  );
}
