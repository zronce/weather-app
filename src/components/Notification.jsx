// Notification.js
import React, { useEffect, useState } from 'react';
import './Notification.css';

const Notification = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 500); // Allow time for fade-out effect before calling onClose
    }, 2000); // Notification duration

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification ${isVisible ? 'fade-in' : 'fade-out'}`}>
      <p>{message}</p>
    </div>
  );
};

export default Notification;
