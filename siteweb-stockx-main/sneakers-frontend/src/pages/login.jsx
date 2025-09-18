import React, { useState } from "react";
import { login, register } from "../api/api";
import { TextField, Button, Typography } from "@mui/material";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = isRegister
        ? { email, password, first_name: firstName, last_name: lastName }
        : { email, password };
      const res = isRegister ? await register(data) : await login(data);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user.role);
        onLogin(res.data.user);
      } else {
        alert("Identifiants invalides");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Erreur serveur");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20 }}>
      <Typography variant="h5">{isRegister ? "Inscription" : "Connexion"}</Typography>
      {isRegister && (
        <>
          <TextField label="Prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} sx={{ display: "block", my: 1 }} />
          <TextField label="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} sx={{ display: "block", my: 1 }} />
        </>
      )}
      <TextField type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} sx={{ display: "block", my: 1 }} />
      <TextField type="password" label="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} sx={{ display: "block", my: 1 }} />
      <Button type="submit" variant="contained" sx={{ my: 1 }}>{isRegister ? "S'inscrire" : "Se connecter"}</Button>
      <Typography variant="body2" sx={{ mt: 1, cursor: "pointer", color: "blue" }} onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? "Déjà un compte ? Se connecter" : "Pas de compte ? S'inscrire"}
      </Typography>
    </form>
  );
}
