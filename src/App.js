import React, { useEffect } from "react";
import { generationToken, messaging } from "./firebase-config.js";
import { onMessage } from "firebase/messaging";
import toast, {Toaster} from 'react-hot-toast';

function App() {
  useEffect(() => {
    generationToken();
    onMessage(messaging, (payload) =>{
      console.log(payload);
      if (payload.notification.body === "lluvia") {
        toast(payload.notification.body,
          {
            icon: '🌧️',
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff'
            }
          }
        );
      } else if (payload.notification.body === "¡Tu token fue guardado exitosamente!") {
        toast(payload.notification.body,
          {
            icon: '✅',
            style:{
              borderRadius: '10px',
              background: '#333',
              color: '#fff'
            }
          }
        );
      }
    })
  }, []);

  return (
  <Toaster position="top-right"
  reverseOrder={false}/>
  );
}

export default App;