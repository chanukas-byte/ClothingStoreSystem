import React, { createContext, useState, useContext } from 'react';
import NotificationToast from '../Components/NotificationToast';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type, duration }]);
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const success = (message, duration) => showNotification(message, 'success', duration);
  const error = (message, duration) => showNotification(message, 'error', duration);
  const info = (message, duration) => showNotification(message, 'info', duration);
  const warning = (message, duration) => showNotification(message, 'warning', duration);

  return (
    <NotificationContext.Provider value={{ success, error, info, warning }}>
      {children}
      <div className="notification-container">
        <AnimatePresence>
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -20, x: 100 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                x: 0,
                transition: {
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 500,
                  damping: 30
                }
              }}
              exit={{ 
                opacity: 0, 
                x: 100,
                transition: {
                  duration: 0.2
                }
              }}
              style={{
                position: 'relative',
                zIndex: notifications.length - index
              }}
            >
              <NotificationToast
                message={notification.message}
                type={notification.type}
                duration={notification.duration}
                onClose={() => removeNotification(notification.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

export default NotificationContext; 