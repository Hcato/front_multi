import React, { useEffect, useState } from "react";
import { getTokenOnly } from "../../firebase-config";
import { getUserByToken } from "../../Api";
import { useNotifications } from "../scripts/ContextNotification.jsx";
import questionIcon from "../multimedia/question.png";
import bandejaIcon from "../multimedia/bandeja.png";
import "./nav.css"; 

const Nav = () => {
  const [user, setUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
  } = useNotifications();
  
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await getTokenOnly();
        if (token) {
          const userData = await getUserByToken(token);
          setUser(userData);
        }
      } catch (error) {
        console.error("Error obteniendo el usuario:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    setUnreadCount(notifications.filter(notif => !notif.read).length);
  }, [notifications]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <nav>
      <div style={{ flex: 1 }}></div>

      {user ? (
        <div className="user-container">
          <img src={user.image} alt={user.username} className="user-image" />
          <span>{user.username}</span>
        </div>
      ) : (
        <span>Cargando usuario...</span>
      )}

      <div className="icons-container">
        <button 
          className="icon-button"
          onClick={() => setShowNotifications(!showNotifications)}
          aria-label="Notificaciones"
        >
          <img src={bandejaIcon} alt="Bandeja" className="icon" />
          {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
        </button>
        
        {showNotifications && (
          <div className="dropdown">
            <div className="dropdown-header">
              <h3 style={{ margin: 0 }}>Notificaciones</h3>
              {notifications.length > 0 && (
                <button 
                  onClick={markAllNotificationsAsRead}
                  className="mark-all-button"
                >
                  Marcar todas como leídas
                </button>
              )}
            </div>
            
            {notifications.length === 0 ? (
              <div className="empty-notifications">
                No hay notificaciones
              </div>
            ) : (
              <div className="notifications-list">
                {[...new Map(notifications.map(notif => [notif.id, notif])).values()].map(notif => (
                  <div 
                    key={notif.id}
                    onClick={() => markNotificationAsRead(notif.id)}
                    className={`notification-item ${notif.read ? 'read' : 'unread'}`}
                  >
                    <div className="notification-content">
                      <span className="notification-icon">{notif.icon}</span>
                      <div>
                        <div style={{ fontWeight: notif.read ? 'normal' : 'bold' }}>
                          {notif.message}
                        </div>
                        <div className="notification-date">
                          {formatDate(notif.date)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <button className="icon-button" aria-label="Ayuda">
          <img src={questionIcon} alt="Question" className="icon" />
        </button>
      </div>
    </nav>
  );
};

export default Nav;