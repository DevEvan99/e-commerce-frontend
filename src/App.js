import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import MainPage from "./pages/MainPage";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import ProductDetails from "./pages/ProductDetail";
import FavoriteProducts from "./pages/FavoriteProducts";




function App() {
  return (
    <Router>
      <Header />
      <main className="container mx-auto py-4 px-16">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/edit-product/:id" element={<EditProduct/>} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/favorites" element={<FavoriteProducts/>} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
