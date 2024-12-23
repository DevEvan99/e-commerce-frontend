import React, { useState, useEffect, useRef  } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const MainPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoriteProducts, setFavoriteProducts] = useState(
    JSON.parse(localStorage.getItem("favoriteProducts")) || []
  );

   // New search states
   const [searchTerm, setSearchTerm] = useState("");
   const [suggestions, setSuggestions] = useState([]);
   const [showSuggestions, setShowSuggestions] = useState(false);
   const searchRef = useRef(null);
 
   // Close suggestions when clicking outside
   useEffect(() => {
     const handleClickOutside = (event) => {
       if (searchRef.current && !searchRef.current.contains(event.target)) {
         setShowSuggestions(false);
       }
     };
 
     document.addEventListener("mousedown", handleClickOutside);
     return () => document.removeEventListener("mousedown", handleClickOutside);
   }, []);

  // Fetch products and favorites from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsResponse, favoritesResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/products"),
          axios.get("http://localhost:5000/api/favorites", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

        setProducts(productsResponse.data);
        setFavoriteProducts(favoritesResponse.data);
        localStorage.setItem("favoriteProducts", JSON.stringify(favoritesResponse.data));
        
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Search functionality
  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(value.toLowerCase()) ||
      product.sku.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions(filtered.slice(0, 5)); // Limit to 5 suggestions
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (productId) => {
    setShowSuggestions(false);
    setSearchTerm("");
    navigate(`/product/${productId}`);
  };

  // Add & Remove to favorites function
  const toggleFavorite = async (product) => {
    try {
      const storedFavorites = JSON.parse(localStorage.getItem("favoriteProducts")) || [];
      const isFavorite = storedFavorites.some((fav) => fav._id === product._id);
  
      const updatedFavorites = isFavorite
        ? storedFavorites.filter((fav) => fav._id !== product._id)
        : [...storedFavorites, product]; 
  
      localStorage.setItem("favoriteProducts", JSON.stringify(updatedFavorites));
  
      const productIds = updatedFavorites.map((fav) => fav._id);
  
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/favorites/update",
        { productIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setFavoriteProducts(updatedFavorites);
  
      Swal.fire({
        icon: isFavorite ? "info" : "success",
        title: isFavorite
          ? `${product.name} removed from favorites!`
          : `${product.name} added to favorites!`,
        text: "Your favorites have been updated.",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: 'bg-[#001EB9] text-white px-6 py-2 rounded-sm mx-4',
        },
        buttonsStyling: false,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to update favorites. Please try again.",
      });
    }
  };

  // Delete product
  const handleDelete = async (productId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You will not be able to undo this action if you proceed!",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Delete',
      customClass: {
        confirmButton: 'bg-[#001EB9] text-white px-6 py-2 rounded-sm mx-4',
        cancelButton: 'border outline-[#001EB9] px-6 py-2 text-[#162427]'
      },
      buttonsStyling: false,
    });
  
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${productId}`);
        setProducts(products.filter((product) => product._id !== productId));
        
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Product has been deleted.',
          confirmButtonText: '',
          customClass: {
            confirmButton: 'hidden',
          },
          buttonsStyling: false,
          timer: 1500,
        });
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error deleting product!',
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  // Filter products based on showFavorites state
  const displayedProducts = showFavorites
    ? products.filter(product => 
        favoriteProducts.some(fav => fav._id === product._id)
      )
    : products;

  return (
    <div className="container mx-auto p-4"> 
      <h1 className="text-3xl font-bold mb-6">{showFavorites ? "FAVORITE PRODUCTS" : "PRODUCTS"}</h1>
      <div className="flex flex-col md:flex-row justify-between text-sm mb-10 w-100">
      <div className="relative flex justify-between rounded-3xl py-3 px-4 bg-[#F7F7F7] w-100 md:w-3/5" ref={searchRef}>
          <input 
            className="bg-transparent focus-visible:outline-none w-full mr-4" 
            type="text" 
            placeholder="Search for products"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
          />
          <button 
            className="bg-[#001EB9] text-white px-8 py-1 rounded-2xl flex items-center gap-2"
            onClick={() => {
              if (suggestions.length > 0) {
                handleSuggestionClick(suggestions[0]._id);
              }
            }}
          >
            <img src="https://img.icons8.com/ios_filled/200/FFFFFF/search.png" className="w-5" alt="search"/>
            Search
          </button>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion._id}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3 border-b last:border-b-0"
                  onClick={() => handleSuggestionClick(suggestion._id)}
                >
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <div className="text-sm text-[#001EB9]">SKU: {suggestion.sku}</div>
                      <div className="text-lg font-semibold text-[#162427] mt-2">{suggestion.name}</div>
                      <div className="text-sm text-[#969191] mt-2">{suggestion.description}</div> 
                    </div>   
                    <img src="/assets/icon/arrow.svg" className="w-5"></img>               
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center justify-center md:justify-start gap-2 mt-4 md:mt-0">
          <a href="/add-product" className="bg-[#001EB9] text-white px-10 py-2 rounded-md">New Product</a>
          <button 
            className={`border border-[#001EB9] px-3 py-2 rounded-md ${
              showFavorites ? 'bg-[#001EB9]' : 'bg-white'
            }`}
            onClick={() => setShowFavorites(!showFavorites)}
          >
            <img 
              src="/assets/icon/star.svg" 
              className={`w-5 ${showFavorites ? 'filter brightness-0 invert' : ''}`}
              alt="favorites"
            />
          </button>
        </div>
      </div>

      {displayedProducts.length === 0 ? (
        <div className="text-center text-gray-500">
          {showFavorites ? "No favorite products." : "No products available."}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="text-[#001EB9]">
                <th className="px-4 py-2 border-b text-left">SKU</th>
                <th className="px-4 py-2 border-b text-left">IMAGE</th>
                <th className="px-4 py-2 border-b text-left">PRODUCT NAME</th>  
                <th className="px-4 py-2 border-b text-left">PRICE</th>
                <th className="px-4 py-2 border-b text-left"></th>
              </tr>
            </thead>
            <tbody>
              {displayedProducts.map((product) => {
                const isFavorite = favoriteProducts.some((fav) => fav._id === product._id);

                return (
                  <tr key={product._id} className="hover:bg-gray-50 text-sm font-medium">
                    <td
                      className="px-4 py-4 border-b text-[#969191] cursor-pointer hover:underline"
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      {product.sku}
                    </td>
                    <td className="px-4 py-4 border-b">
                      {product.images && product.images.length > 0 && (
                        <img
                          src={`http://localhost:5000${product.thumbnail}`}
                          alt={product.name}
                          className="w-14 h-14 object-cover rounded-md"
                        />
                      )}
                    </td>
                    <td className="px-4 py-4 border-b">{product.name}</td>
                    <td className="px-4 py-4 border-b">${product.price.toFixed(2)}</td>
                    <td className="px-4 py-4 border-b">
                      <div className="flex">
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="px-4 py-4 rounded-lg hover:bg-red-100 transition-colors duration-300"
                        >
                          <img src="/assets/icon/delete-icon.svg" className="w-5" alt="Delete" />
                        </button>
                        <button
                          onClick={() => navigate(`/edit-product/${product._id}`)}
                          className="px-4 py-4 rounded-lg hover:bg-slate-200 transition-colors duration-300"
                        >
                          <img src="/assets/icon/edit-icon.svg" className="w-5" alt="Edit" />
                        </button>
                        <button
                          onClick={() => toggleFavorite(product)}
                          className={`px-4 py-4 rounded-lg hover:bg-slate-200 transition-colors duration-300 ${
                            isFavorite ? "bg-[#001EB9]" : "bg-transparent"
                          }`}
                        >
                          <img src="/assets/icon/star.svg" className="w-5" alt="Favorite" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MainPage;