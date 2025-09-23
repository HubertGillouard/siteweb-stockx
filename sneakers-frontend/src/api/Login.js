import { useState } from "react";
import { login, setToken } from "./api";
import { TextField, Button, Typography } from "@mui/material";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password });
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user?.role || "user");
        setToken(res.data.token);
        onLogin?.();
      } else {
        alert("Identifiants invalides");
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Erreur serveur");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20, maxWidth: 400 }}>
      <Typography variant="h5">Connexion</Typography>
      <TextField fullWidth type="email" label="Email" value={email} onChange={e=>setEmail(e.target.value)} sx={{ my: 1 }} />
      <TextField fullWidth type="password" label="Mot de passe" value={password} onChange={e=>setPassword(e.target.value)} sx={{ my: 1 }} />
      <Button type="submit" variant="contained">Se connecter</Button>
      <Typography variant="body2" sx={{ mt:1 }}>Admin test : admin@test.com / admin</Typography>
      <Typography variant="body2">Client test : user@test.com / user</Typography>
    </form>
  );
}
