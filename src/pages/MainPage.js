import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const  MainPage  = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Add to favorites function
  const addToFavorites = (product) => {
    const storedFavorites = JSON.parse(localStorage.getItem("favoriteProducts")) || [];
    if (!storedFavorites.some((fav) => fav._id === product._id)) {
      const updatedFavorites = [...storedFavorites, product];
      localStorage.setItem("favoriteProducts", JSON.stringify(updatedFavorites));
      Swal.fire({
        icon: 'success',
        title: `${product.name} added to favorites!`,
        text: 'You can view your favorites anytime.',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-[#001EB9] text-white px-6 py-2 rounded-sm mx-4',
        },
        buttonsStyling: false,
      });
    } else {
      Swal.fire({
        icon: 'info',
        title: `${product.name} is already in favorites!`,
        text: 'This product is already in your favorites list.',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Remove',
        customClass: {
          confirmButton: 'bg-[#001EB9] text-white px-10 py-2 rounded-sm mx-4',
          cancelButton: 'border border-red-600 text-red-600 px-6 py-2 rounded-sm mx-4',
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.isDismissed && result.dismiss === Swal.DismissReason.cancel) {
          removeFromFavorites(product);
        }
      });
    }
  };

  // Remove to favorites function
  const removeFromFavorites = (product) => {
    const storedFavorites = JSON.parse(localStorage.getItem("favoriteProducts")) || [];

    const productIndex = storedFavorites.findIndex((fav) => fav._id === product._id);
  
    if (productIndex !== -1) {
      storedFavorites.splice(productIndex, 1);
      localStorage.setItem("favoriteProducts", JSON.stringify(storedFavorites));
  
      Swal.fire({
        icon: 'success',
        title : 'Removed',
        text: `${product.name} has been removed from favorites.`,
        confirmButtonText: '',
        customClass: {
          confirmButton: 'hidden',
        },
        buttonsStyling: false,
        timer: 1500,
      });
    } else {
      // If product is not found in favorites
      Swal.fire({
        icon: 'info',
        title: `${product.name} is not in favorites!`,
        text: 'This product is not in your favorites list.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#17a2b8',
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">PRODUCTS</h1>
      <div className="flex justify-between text-sm mb-10">
        <div className="flex justify-between rounded-3xl py-3 px-4 bg-[#F7F7F7] w-3/5">
          <input className="bg-transparent focus-visible:outline-none" type="text" placeholder="Search for products"/>
          <button className="bg-[#001EB9] text-white px-8 py-1 rounded-2xl flex items-center gap-2"><img src="https://img.icons8.com/ios_filled/200/FFFFFF/search.png" className="w-5"></img>Search</button>
        </div>
        <div className="flex items-center gap-2">
          <a href="/add-product" className="bg-[#001EB9] text-white px-10 py-2 rounded-md">New Product</a>
          <a className="border border-[#001EB9] text-white px-3 py-2 rounded-md"><img src="/assets/icon/star.svg" className="w-5"></img></a>
        </div>
      </div>
      

      {products.length === 0 ? (
        <div className="text-center text-gray-500">
          No products available.
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
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 text-sm font-medium">
                  <td className="px-4 py-4 border-b text-[#969191] cursor-pointer hover:underline" onClick={() => navigate(`/product/${product._id}`)}>{product.sku}</td>
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
                        <img src="/assets/icon/edit-icon.svg" className="w-5"></img>
                      </button>
                      <button
                        onClick={() => addToFavorites(product)}
                        className="px-4 py-4 rounded-lg hover:bg-slate-200 transition-colors duration-300"
                      >
                      <img src="/assets/icon/star.svg" className="w-5"></img>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      )}
    </div>
  );
};

export default MainPage;