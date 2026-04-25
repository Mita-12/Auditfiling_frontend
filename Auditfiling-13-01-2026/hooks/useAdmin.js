// src/hooks/useAdmin.js
import { useState, useEffect } from "react";

export const useAdmin = () => {
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const storedAdmin = sessionStorage.getItem("admin");
    console.log(storedAdmin);

    if (storedAdmin) {
      setAdminData(JSON.parse(storedAdmin));
      console.log(adminData);

    }
  }, []);

  return adminData;
};