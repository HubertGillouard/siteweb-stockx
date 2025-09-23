// sneakers-frontend/src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="alert">
      <h2>Page introuvable</h2>
      <p><Link to="/">Retour au catalogue</Link></p>
    </div>
  );
}
