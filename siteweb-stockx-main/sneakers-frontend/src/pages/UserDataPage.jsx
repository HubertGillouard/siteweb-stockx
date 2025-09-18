import { useEffect, useState } from "react";

export default function UserDataPage() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("http://localhost:4000/api/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUserData(data))
      .catch(err => console.error(err));
  }, []);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "user_data.json";
    a.click();
  };

  const handleDelete = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:4000/api/me", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      alert("Compte supprimé !");
      localStorage.clear();
      window.location.href = "/";
    })
    .catch(err => console.error(err));
  };

  if (!userData) return <div>Chargement...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Mes données personnelles</h1>
      <pre>{JSON.stringify(userData, null, 2)}</pre>
      <button onClick={handleExport} style={{ marginRight: 10 }}>Exporter mes données</button>
      <button onClick={handleDelete} style={{ backgroundColor: "red" }}>Supprimer mon compte</button>
    </div>
  );
}
