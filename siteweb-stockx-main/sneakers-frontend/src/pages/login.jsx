// src/components/Login.jsx
import { useState } from "react";
import { login } from "../api/api";
import { TextField, Button, Typography } from "@mui/material";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ username, password });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        onLogin(res.data.user); // passe l'admin à App.jsx
      } else {
        alert("Identifiants invalides");
      }
    } catch (err) {
      alert("Erreur de connexion");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20 }}>
      <Typography variant="h5">Connexion Admin</Typography>
      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        sx={{ display: "block", my: 1 }}
      />
      <TextField
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ display: "block", my: 1 }}
      />
      <Button type="submit" variant="contained">
        Se connecter
      </Button>
    </form>
  );
}
