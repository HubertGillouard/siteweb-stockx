export const getProducts = async () => {
    const res = await fetch('http://localhost:3000/api/products');
    return res.json();
  };
  