import React, { useState, useEffect } from "react";

const FavoriteProducts = () => {
  const [favoriteProducts, setFavoriteProducts] = useState([]);

  // Load favorite products from local storage on component mount
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favoriteProducts")) || [];
    setFavoriteProducts(storedFavorites);
  }, []);

  // Remove a product from the favorites list
  const removeFavorite = (productId) => {
    const updatedFavorites = favoriteProducts.filter((product) => product.id !== productId);
    setFavoriteProducts(updatedFavorites);
    localStorage.setItem("favoriteProducts", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Favorite Products</h1>

      {favoriteProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.description}</p>
              <p className="text-blue-600 font-bold">{product.price}</p>
              <button
                onClick={() => removeFavorite(product.id)}
                className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Remove from Favorites
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No favorite products found.</p>
      )}
    </div>
  );
};

export default FavoriteProducts;
