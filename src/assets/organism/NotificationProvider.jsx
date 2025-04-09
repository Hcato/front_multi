import React, { useState, useEffect, useCallback } from "react";
import {generationToken,messaging} from "../../firebase-config.js"
import { onMessage } from "firebase/messaging";
import toast from "react-hot-toast";

import rainOverlay from "../multimedia/lluvia.webp";
import { NotificationContext } from "../scripts/NotificationContext";

const NotificationProvider = ({ children }) => {
  const [isRaining, setIsRaining] = useState(localStorage.getItem("isRaining") === "true");
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("notifications");
    return saved ? JSON.parse(saved) : [];
  });

  const addNotification = useCallback((notification) => {
    setNotifications(prev => {
      if (prev.some(n => n.id === notification.id)) return prev; // Evita duplicados
      const updated = [notification, ...prev].slice(0, 50);
      localStorage.setItem("notifications", JSON.stringify(updated));
      return updated;
    });

    if (notification.message === "lluvia") {
      setIsRaining(true);
      localStorage.setItem("isRaining", "true");
    } else if (notification.message === "lluvia detenida") {
      setIsRaining(false);
      localStorage.setItem("isRaining", "false");
    }

    toast(notification.message, {
      icon: notification.icon,
      style: { borderRadius: "10px", background: "#333", color: "#fff" },
    });
  }, []);

  const handleForegroundMessage = useCallback((payload) => {
    const notification = {
      id: Date.now(),
      message: payload.notification?.body || payload.data?.body || "Nueva notificación",
      icon: payload.notification?.body?.includes("lluvia") ? "🌧️" : 
            payload.notification?.body?.includes("detenida") ? "☀️" : "🔔",
      date: new Date().toISOString(),
      read: false
    };
    addNotification(notification);
  }, [addNotification]);

  useEffect(() => {
    const initialize = async () => {
      try {
        await generationToken();
        onMessage(messaging, handleForegroundMessage);
        await Notification.requestPermission();
      } catch (error) {
        console.error("Error en notificaciones:", error);
      }
    };
    initialize();
  }, [handleForegroundMessage]);

  return (
    <NotificationContext.Provider value={{ isRaining, notifications, setNotifications }}>
      {isRaining && (
        <div style={{
          position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
          backgroundImage: `url(${rainOverlay})`, backgroundSize: "cover",
          backgroundPosition: "center", backgroundRepeat: "no-repeat", pointerEvents: "none",
        }}></div>
      )}
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
