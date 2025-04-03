import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import './Plan.css';

const Plan = ({ title, features, price }) => {
const paypalOptions = {
  "client-id": "test",  // ¡No requiere registro!
  currency: "MXN",
};

  return (
    <div className="plan-container">
      <h2>{title}</h2>
      {features.map((feature, index) => (
        <p key={index}>{feature}</p>
      ))}
      <div className="price">${price}</div>

      {/* Botón de PayPal */}
      <PayPalScriptProvider options={paypalOptions}>
        <PayPalButtons
          style={{ layout: "vertical" }} // Horizontal o vertical
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: price.toString(), // Precio dinámico
                },
              }],
            });
          }}
          onApprove={(data, actions) => {
            return actions.order.capture().then(details => {
              alert(`Pago completado por ${details.payer.name.given_name}`);
              // Aquí puedes redirigir o guardar el pago en tu backend
            });
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default Plan;