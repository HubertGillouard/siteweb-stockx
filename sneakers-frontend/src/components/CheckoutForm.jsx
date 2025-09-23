import React, { useState } from "react";

export default function CheckoutForm({ onSubmit, submitting }) {
  const [form, setForm] = useState({
    email: "",
    name: "",
    address: "",
    city: "",
    zip: "",
    cardNumber: "",
    exp: "",
    cvc: "",
  });

  function up(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="card">
      <h3>Informations client</h3>
      <div className="row wrap">
        <div style={{flex:1, minWidth:260}}>
          <label>Email</label>
          <input className="input" type="email" required value={form.email} onChange={e=>up("email", e.target.value)} />
        </div>
        <div style={{flex:1, minWidth:260}}>
          <label>Nom</label>
          <input className="input" required value={form.name} onChange={e=>up("name", e.target.value)} />
        </div>
      </div>

      <h3 style={{marginTop:16}}>Adresse</h3>
      <div className="row wrap">
        <div style={{flex:2, minWidth:260}}>
          <label>Adresse</label>
          <input className="input" required value={form.address} onChange={e=>up("address", e.target.value)} />
        </div>
        <div style={{flex:1, minWidth:160}}>
          <label>Ville</label>
          <input className="input" required value={form.city} onChange={e=>up("city", e.target.value)} />
        </div>
        <div style={{width:140}}>
          <label>Code postal</label>
          <input className="input" required value={form.zip} onChange={e=>up("zip", e.target.value)} />
        </div>
      </div>

      <h3 style={{marginTop:16}}>Paiement (fictif)</h3>
      <div className="row wrap">
        <div style={{flex:2, minWidth:220}}>
          <label>Numéro de carte</label>
          <input className="input" required value={form.cardNumber} onChange={e=>up("cardNumber", e.target.value)} placeholder="4242 4242 4242 4242" />
        </div>
        <div style={{width:120}}>
          <label>Expiration</label>
          <input className="input" required value={form.exp} onChange={e=>up("exp", e.target.value)} placeholder="10/28" />
        </div>
        <div style={{width:100}}>
          <label>CVC</label>
          <input className="input" required value={form.cvc} onChange={e=>up("cvc", e.target.value)} placeholder="123" />
        </div>
      </div>

      <div className="row" style={{justifyContent:"flex-end", marginTop:16}}>
        <button className="btn" disabled={submitting}>Valider et payer</button>
      </div>
    </form>
  );
}
