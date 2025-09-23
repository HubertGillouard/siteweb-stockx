import React, { useEffect, useMemo, useState } from "react";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../api";

const empty = {
  name: "", brand: "", price: 0, category: "sneakers", gender: "unisex", link: "/images/placeholder.jpg",
  description: "", stockBySize: { "40": 0, "41": 0, "42": 0, "43": 0 }
};

export default function AdminPage() {
  const [items, setItems] = useState([]);
  const [edit, setEdit] = useState(null);

  async function reload() {
    const list = await getProducts().catch(() => []);
    setItems(list);
  }
  useEffect(() => { reload(); }, []);

  const total = useMemo(() =>
    items.reduce((n, p) => n + Object.values(p.stockBySize || {}).reduce((s, q) => s + Number(q || 0), 0), 0),
    [items]
  );

  function openNew() { setEdit({ ...empty }); }
  function openEdit(p) { setEdit(JSON.parse(JSON.stringify(p))); }

  async function save() {
    const payload = { ...edit, price: Number(edit.price || 0) };
    if (payload.id) await updateProduct(payload.id, payload);
    else await createProduct(payload);
    setEdit(null);
    reload();
  }

  async function remove(id) {
    if (!confirm("Supprimer ce produit ?")) return;
    await deleteProduct(id);
    reload();
  }

  return (
    <div>
      <div className="card">
        <h2>Admin — Produits</h2>
        <div className="row" style={{justifyContent:"space-between"}}>
          <div>{items.length} produits · {total} unités en stock</div>
          <button className="btn" onClick={openNew}>Nouveau produit</button>
        </div>
      </div>

      <table className="table">
        <thead><tr><th>ID</th><th>Nom</th><th>Prix</th><th>Catégorie</th><th>Genre</th><th>Actions</th></tr></thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.price?.toFixed?.(2)} €</td>
              <td>{p.category}</td>
              <td>{p.gender}</td>
              <td className="row">
                <button className="btn secondary" onClick={()=>openEdit(p)}>Éditer</button>
                <button className="btn danger" onClick={()=>remove(p.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {edit && (
        <div className="card" style={{marginTop:16}}>
          <h3>{edit.id ? `Éditer #${edit.id}` : "Nouveau produit"}</h3>
          <div className="row wrap">
            <div style={{flex:2, minWidth:260}}>
              <label>Nom</label>
              <input className="input" value={edit.name} onChange={e=>setEdit({...edit, name:e.target.value})} />
              <label>Marque</label>
              <input className="input" value={edit.brand} onChange={e=>setEdit({...edit, brand:e.target.value})} />
              <label>Prix (€)</label>
              <input className="input" type="number" value={edit.price} onChange={e=>setEdit({...edit, price:e.target.value})} />
            </div>
            <div style={{flex:1, minWidth:200}}>
              <label>Catégorie</label>
              <input className="input" value={edit.category} onChange={e=>setEdit({...edit, category:e.target.value})} />
              <label>Genre</label>
              <select className="input" value={edit.gender} onChange={e=>setEdit({...edit, gender:e.target.value})}>
                <option value="men">hommes</option>
                <option value="women">femmes</option>
                <option value="kids">enfants</option>
                <option value="unisex">unisex</option>
              </select>
              <label>Image (chemin API)</label>
              <input className="input" value={edit.link} onChange={e=>setEdit({...edit, link:e.target.value})} placeholder="/images/placeholder.jpg" />
            </div>
          </div>
          <label>Description</label>
          <textarea className="input" rows={4} value={edit.description} onChange={e=>setEdit({...edit, description:e.target.value})} />

          <h4>Stock par taille</h4>
          <div className="row wrap">
            {Object.entries(edit.stockBySize || {}).map(([s, qty]) => (
              <div key={s} style={{minWidth:100}}>
                <label>{s}</label>
                <input className="input" type="number" value={qty} onChange={e=>{
                  const val = Number(e.target.value);
                  setEdit((cur)=>({ ...cur, stockBySize: { ...(cur.stockBySize||{}), [s]: val } }));
                }} />
              </div>
            ))}
          </div>

          <div className="row" style={{justifyContent:"flex-end", gap:10, marginTop:12}}>
            <button className="btn secondary" onClick={()=>setEdit(null)}>Annuler</button>
            <button className="btn" onClick={save}>Enregistrer</button>
          </div>
        </div>
      )}
    </div>
  );
}
