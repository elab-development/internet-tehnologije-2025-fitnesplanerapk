import { useEffect, useState } from "react";

function Quote() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/quote") 
      .then((res) => res.json())
      .then((data) => setQuote(`${data.quote} — ${data.author}`));
  }, []);

  return <div>{quote}</div>;
}

export default Quote;