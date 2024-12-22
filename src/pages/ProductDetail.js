import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ProductDetails = () => {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching product details");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
      >
        Back
      </button>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {product.images && product.images.length > 0 && (
          <img
            src={`http://localhost:5000${product.images[0]}`}
            alt={product.name}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        )}
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-700 mb-4">{product.description}</p>
        <p className="text-lg font-bold text-blue-600 mb-4">${product.price.toFixed(2)}</p>
        <p className="text-sm text-gray-500">Stock: {product.quantity}</p>
        <p className="text-sm text-gray-500">SKU: {product.sku}</p>
      </div>
    </div>
  );
};

export default ProductDetails;
