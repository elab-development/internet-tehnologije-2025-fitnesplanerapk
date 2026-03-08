import { useEffect, useState } from "react";
import axiosClient from "../views/axios-client";
function Quote() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    
    axiosClient.get('/quote') 
      .then(({ data }) => {
        
        setQuote(`${data.quote} — ${data.author}`);
      })
      .catch((err) => {
        console.error("Greška pri preuzimanju citata:", err);
        setQuote("Nije uspelo učitavanje citata.");
      });
  }, []);

  return <div>{quote}</div>;
}

export default Quote;