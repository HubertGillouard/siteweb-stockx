import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

console.log("APP: boot @", new Date().toISOString());

const rootEl =
  document.getElementById("root") ||
  (() => {
    const d = document.createElement("div");
    d.id = "root";
    document.body.appendChild(d);
    return d;
  })();

createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

setTimeout(() => {
  console.log("APP: React rendu, banner retiré");
}, 0);
