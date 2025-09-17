import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import ProductList from "./components/ProductList";
import Header from "./components/Header";
import { setToken } from "./api";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
      setLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={loggedIn ? <ProductList /> : <Login onLogin={() => setLoggedIn(true)} />} />
      </Routes>
    </Router>
  );
}
