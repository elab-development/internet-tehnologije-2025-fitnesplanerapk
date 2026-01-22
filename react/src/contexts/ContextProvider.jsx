
import { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../views/axios-client";

const StateContext = createContext({
  user: null,
  token: null,
  setUser: () => {},
  setToken: () => {},
});

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));
  const [loading, setLoading] = useState(true);

  const setToken = (token) => {
    _setToken(token);
    if (token) {
        localStorage.setItem("ACCESS_TOKEN", token);
        } else {
        localStorage.removeItem("ACCESS_TOKEN");
        setUser(null);
        }
    };

    useEffect(() => {
        if (!token) {
        setLoading(false);
        return;
    }

    axiosClient
      .get("/me")
      .then(({ data }) => {
        setUser(data);
      })
      .catch(() => {
        setToken(null);
      })
      .finally(() => {
        setLoading(false);
      });
    }, [token]);

    if (loading) {
        return <p>Učitavanje...</p>;
    }

    return (
        <StateContext.Provider
        value={{
            user,
            token,
            setUser,
            setToken,
        }}
        >
        {children}
        </StateContext.Provider>
    );
    };

export const useStateContext = () => useContext(StateContext);
