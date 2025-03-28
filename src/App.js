import React, { useState, useEffect } from "react";
import { generationToken, messaging } from "./firebase-config.js";
import { onMessage } from "firebase/messaging";
import toast, { Toaster } from "react-hot-toast";

import rainOverlay from "./assets/multimedia/lluvia.webp"

function App() {
  const [isRaining, setIsRaining] = useState(()=>{
    return localStorage.getItem("isRaining") === "true";
  });

  useEffect(() => {
    generationToken();

    onMessage(messaging, (payload) => {
      console.log(payload);
      if (payload.notification.body === "lluvia") {
        setIsRaining(true);
        localStorage.setItem("isRaining", "true");
        toast(payload.notification.body,{
          icon: '🌧️',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff'
          }
        });
      } else if (payload.notification.body === "¡Tu token fue guardado exitosamente!") {
        toast(payload.notification.body,
          {
            icon: '✅',
            style:{
              borderRadius: '10px',
              background: '#333',
              color: '#fff'
            }
          });
        }else if (payload.notification.body === "lluvia detenida") {
          setIsRaining(false);
          localStorage.setItem("isRaining", "false");
          toast(payload.notification.body,{
            icon: '☀️',
            style:{
              borderRadius: '10px',
              background: '#333',
              color: '#fff'
            }
          });
        }
    });
    return 
  }, []);

  return (
    <>
    {isRaining && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: `url(${rainOverlay})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              pointerEvents: "none",
            }}
          ></div>
        )}
        <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
