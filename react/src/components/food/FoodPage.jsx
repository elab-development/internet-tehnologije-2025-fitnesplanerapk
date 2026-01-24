import React from 'react';
import Obroci from './Obroci.jsx'; // ⬅️ OVDE moraš importovati komponentu

export default function FoodPage() {
  return (
    <div>
      <h1>Praćenje ishrane</h1>
      <Obroci />
    </div>
  );
}
