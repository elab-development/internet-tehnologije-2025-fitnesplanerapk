import React, { useEffect, useState } from "react";
import axios from "axios";
import localExercises from "./exercises.json"; // fallback

export default function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      const API_URL = "https://exercisedb-13001.p.rapidapi.com/api/exercises1/GetExercisesByBodyparts?bodypart=lower%20legs&limit=10&offset=0";
      const API_HEADERS = {
        "X-RapidAPI-Key": "010842cd8bmsh8503d42ae8939c9p1fe69cjsna15a540c5095",
        "X-RapidAPI-Host": "exercisedb-13001.p.rapidapi.com",
      };

      try {
        const res = await axios.post(API_URL, {}, { headers: API_HEADERS });
        setExercises(res.data);
      } catch (err) {
        console.log("API ne radi ili limit premašen, učitavamo lokalno.", err);
        setExercises(localExercises); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  if (loading) return <p>Učitavanje vežbi...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
      {exercises.map(ex => (
        <div key={ex.id} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "10px" }}>
          <h3>{ex.name}</h3>
          {ex.gifUrl && <img src={ex.gifUrl} alt={ex.name} style={{ width: "100%", borderRadius: "4px" }} />}
          <p><strong>Body Part:</strong> {ex.bodyPart}</p>
          <p><strong>Target:</strong> {ex.target}</p>
          <p>{ex.equipment.join(", ") || "No equipment"}</p>
        </div>
      ))}
    </div>
  );
}