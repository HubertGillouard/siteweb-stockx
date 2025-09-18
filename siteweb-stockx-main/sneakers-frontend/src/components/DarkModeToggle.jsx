// src/components/DarkModeToggle.jsx
import React, { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) setDarkMode(savedMode === "true");
  }, []);

  useEffect(() => {
    if (darkMode) document.body.classList.add("dark-mode");
    else document.body.classList.remove("dark-mode");
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        padding: "0.5rem 1rem",
        borderRadius: 5,
        backgroundColor: darkMode ? "#333" : "#eee",
        color: darkMode ? "#fff" : "#000",
        border: "none",
        cursor: "pointer",
        zIndex: 1000,
      }}
    >
      {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}
