import React from "react";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function ProfilePage() {
  const { user } = useAuth();
  return (
    <div className="card">
      <h2>Mon profil</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
