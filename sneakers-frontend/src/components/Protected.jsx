import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Protected({ roles = [], children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="card">Chargement…</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles.length) {
    const rs = user.roles || [];
    if (!roles.some((r) => rs.includes(r))) return <Navigate to="/" />;
  }
  return children;
}
