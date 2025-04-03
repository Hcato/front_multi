// pages/PurchasePlan.jsx
import React from 'react';
// import userService from '../services/userService';

const PurchasePlan = () => {
  const handlePurchase = (planType) => {
    // Llamar a la API para comprar plan
    // userService.purchasePlan(planType)
    console.log('Comprado plan:', planType);
  };

  return (
    <div>
      <h2>Elige tu plan</h2>
      <div>
        <h3>Plan Básico</h3>
        <p>Características: ...</p>
        <button onClick={() => handlePurchase('basic')}>Comprar Básico</button>
      </div>
      <div>
        <h3>Plan Básico+</h3>
        <p>Características: ...</p>
        <button onClick={() => handlePurchase('basic+')}>Comprar Básico+</button>
      </div>
    </div>
  );
};

export default PurchasePlan;
