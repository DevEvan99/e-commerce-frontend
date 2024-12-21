import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import MainPage from "./pages/MainPage";



function App() {
  return (
    <Router>
      <Header />
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<MainPage />} />

        </Routes>
      </main>
    </Router>
  );
}

export default App;
