import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext.jsx";

export default function CartPage() {
  const { items, updateItem, removeItem, clear } = useCart();

  const total = items.reduce((n, it) => n + (it.price || 0) * (it.qty || 0), 0);

  return (
    <div className="card">
      <h2>Panier</h2>
      {items.length === 0 ? (
        <p>Votre panier est vide. <Link to="/catalog">Voir le catalogue</Link></p>
      ) : (
        <>
          <table className="table">
            <thead><tr><th>Produit</th><th>Taille</th><th>Qté</th><th>Prix</th><th></th></tr></thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={i}>
                  <td>#{it.productId}</td>
                  <td>{it.size}</td>
                  <td>
                    <input className="input" type="number" min={0} value={it.qty}
                      onChange={(e)=>updateItem({ productId: it.productId, size: it.size }, Number(e.target.value))} />
                  </td>
                  <td>{it.price ? `${(it.price * it.qty).toFixed(2)} €` : "—"}</td>
                  <td><button className="btn danger" onClick={()=>removeItem({ productId: it.productId, size: it.size })}>Supprimer</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="row" style={{justifyContent:"space-between", marginTop:12}}>
            <button className="btn secondary" onClick={clear}>Vider le panier</button>
            <div className="row" style={{gap:10, alignItems:"center"}}>
              <div>Total : <b>{total.toFixed(2)} €</b></div>
              <Link className="btn" to="/checkout">Passer au paiement</Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
