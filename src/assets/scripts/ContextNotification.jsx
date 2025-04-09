import React, { createContext, useContext, useCallback, useState, useEffect } from "react";
import { generationToken, messaging } from "../../firebase-config.js";
import { onMessage } from "firebase/messaging";
import toast from "react-hot-toast";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [isRaining, setIsRaining] = useState(() => {
    return localStorage.getItem("isRaining") === "true";
  });
  
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("notifications");
    return saved ? JSON.parse(saved) : [];
  });

  const addNotification = useCallback((notification) => {
    setNotifications(prev => {
      if (prev.some(n => n.id === notification.id)) {
        console.warn("Notificación duplicada detectada:", notification);
        return prev;
      }

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
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff'
      }
    });
  }, []);

  const handleForegroundMessage = useCallback((payload) => {
    const notification = {
      id: Date.now(),
      message: payload.notification?.body || payload.data?.body || "Nueva notificación",
      icon: payload.notification?.body?.includes("lluvia") ? '🌧️' : 
            payload.notification?.body?.includes("token") ? '✅' :
            payload.notification?.body?.includes("detenida") ? '☀️' : '🔔',
      date: new Date().toISOString(),
      read: false
    };
    addNotification(notification);
  }, [addNotification]);

  const loadNotificationsFromDB = useCallback(async () => {
    if (!('indexedDB' in window)) return [];
    
    return new Promise((resolve) => {
      const request = indexedDB.open('NotificationsDB', 1);
      
      request.onsuccess = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('notifications')) {
          resolve([]);
          return;
        }
        
        const tx = db.transaction('notifications', 'readonly');
        const store = tx.objectStore('notifications');
        const getAllRequest = store.getAll();
        
        getAllRequest.onsuccess = () => {
          resolve(getAllRequest.result || []);
        };
        
        getAllRequest.onerror = () => resolve([]);
      };
      
      request.onerror = () => resolve([]);
    });
  }, []);

  const setupServiceWorkerListeners = useCallback(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'NEW_NOTIFICATION') {
          console.log('Notification received from SW:', event.data.notification);
          addNotification(event.data.notification);
        }
      });
    }
  }, [addNotification]);

  useEffect(() => {
    const initialize = async () => {
      try {
        await generationToken();
        
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/' });
          console.log('SW registered:', registration);
          
          if (registration.active) {
            setupServiceWorkerListeners();
          } else if (registration.installing) {
            registration.installing.addEventListener('statechange', () => {
              if (registration.active) {
                setupServiceWorkerListeners();
              }
            });
          }
        }
        
        const dbNotifications = await loadNotificationsFromDB();
        if (dbNotifications.length > 0) {
          setNotifications(prev => {
            const combined = [...dbNotifications, ...prev]
              .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
              .sort((a, b) => b.id - a.id)
              .slice(0, 50);
            localStorage.setItem("notifications", JSON.stringify(combined));
            return combined;
          });
        }
        
        onMessage(messaging, handleForegroundMessage);
        
        const permission = await Notification.requestPermission();
        console.log('Notification permission:', permission);
        
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };
    
    initialize();
    
    const cleanupInterval = setInterval(async () => {
      const fifteenDaysAgo = new Date();
      fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
      
      setNotifications(prev => {
        const filtered = prev.filter(n => new Date(n.date) > fifteenDaysAgo);
        if (filtered.length !== prev.length) {
          localStorage.setItem("notifications", JSON.stringify(filtered));
          return filtered;
        }
        return prev;
      });
    }, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(cleanupInterval);
  }, [setupServiceWorkerListeners, loadNotificationsFromDB, handleForegroundMessage]);

  const markNotificationAsRead = useCallback((id) => {
    setNotifications(prev => {
      const updated = prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      );
      localStorage.setItem("notifications", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(notif => ({ ...notif, read: true }));
      localStorage.setItem("notifications", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <NotificationContext.Provider value={{
      isRaining,
      notifications,
      addNotification,
      markNotificationAsRead,
      markAllNotificationsAsRead
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};