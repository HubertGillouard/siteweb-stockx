import { useState } from "react";
import { login, setToken } from "../api";
import { TextField, Button, Typography } from "@mui/material";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ username: email, password });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        onLogin(); // actualise l'état du front
      } else {
        alert("Identifiants invalides");
      }
    } catch (err) {y
      alert(err.response?.data?.message || "Erreur serveur");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20 }}>
      <Typography variant="h5">Connexion Admin</Typography>
      <TextField
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ display: "block", my: 1 }}
      />
      <TextField
        type="password"
        label="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ display: "block", my: 1 }}
      />
      <Button type="submit" variant="contained" sx={{ my: 1 }}>
        Se connecter
      </Button>
    </form>
  );
}
