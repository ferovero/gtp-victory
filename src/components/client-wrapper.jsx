"use client";
import { useEffect, useState } from "react";

const ClientWrapper = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted ? children : null;
};

export default ClientWrapper;
