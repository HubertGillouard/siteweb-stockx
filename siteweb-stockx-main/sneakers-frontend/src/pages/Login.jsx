import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("admin");
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      await login(email, password);
      nav("/");
    } catch (e) {
      setErr(e?.message || "Login échoué");
    }
  }

  return (
    <form onSubmit={submit} className="card" style={{maxWidth:420, margin:"0 auto"}}>
      <h2>Connexion</h2>
      <label>Email</label>
      <input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} />
      <label>Mot de passe</label>
      <input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
      {err ? <p style={{color:"#f99"}}>{err}</p> : null}
      <div className="row" style={{justifyContent:"space-between", marginTop:10}}>
        <button className="btn">Se connecter</button>
        <small>Comptes : admin/admin, seller/seller, user/user</small>
      </div>
    </form>
  );
}
