

import { useState, useEffect } from 'react';

export const useUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Read from sessionStorage instead of sessionStorage
    const savedUser = sessionStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const handleStorageChange = () => {
      const savedUser = sessionStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    };

    // Listen for session storage changes (cross-tab)
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return user;
};
