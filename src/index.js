import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css';
import App from './App';
import Graphics from './assets/pages/Graphics.jsx';
import Dashboard from './assets/pages/User_Page.jsx';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

const router = createBrowserRouter([
  {
    path:"/",
    element: <App/>
  },
  {
    path:"/",
    element: "#aqui ira el login y asi."
  },
  {
    path: "/dashboard",
    element: <Dashboard/>
  },
  { 
    path: "/graphics/:stationId",
    element:<Graphics/>
  }
])
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Registra el service worker de Firebase
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
      .then((registration) => {
        console.log('Service Worker de Firebase registrado con éxito:', registration);
        
        // Opcional: Registra el service worker de PWA si lo necesitas
        serviceWorkerRegistration.register();
      })
      .catch((err) => {
        console.error('Error al registrar el Service Worker:', err);
        // Si falla Firebase, intenta con el service worker de PWA
        serviceWorkerRegistration.register();
      });
  });
} else {
  // Si el navegador no soporta service workers
  console.warn('Este navegador no soporta Service Workers');
  serviceWorkerRegistration.unregister();
}

// Si quieres medir el rendimiento de tu app
reportWebVitals();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
