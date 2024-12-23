import React, { useState, useRef  } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Navigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    sku: "",
    name: "",
    quantity: "",
    description: "",
    price: "",
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };
 
  // Click the hidden file input
  const fileInputRef = useRef(null);
  const handleButtonClick = () => {
    fileInputRef.current.click(); 
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    // Generate previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      
      formData.append('sku', productData.sku);
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', productData.price);
      formData.append('quantity', productData.quantity);
      
      images.forEach((image) => {
        formData.append('images', image);
      });

      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      // Send data to backend
      const response = await axios.post('http://localhost:5000/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(true);
      Swal.fire({
        icon: 'success',
        title: 'Product Created',
        text: 'The product has been successfully created!',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-[#001EB9] text-white px-6 py-2 rounded-sm mx-4',
        },
        buttonsStyling: false,
      }).then(() => {
        navigate(`/`);
      });

      setProductData({ 
        sku: "", 
        name: "", 
        quantity: "", 
        description: "", 
        price: "" 
      });
      setImages([]);
      setImagePreviews([]);
      
      console.log('Product created:', response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating product');
      console.error('Error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.response?.data?.message,
        confirmButtonText: 'Try Again',
        customClass: {
          confirmButton: 'bg-[#001EB9] text-white px-6 py-2 rounded-sm mx-4',
        },
        buttonsStyling: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-wrap items-center gap-2">
        <a href="/" className="text-2xl sm:text-3xl font-bold">PRODUCTS</a>
        <img src="/assets/icon/arrow.svg" className="w-4 sm:w-5"></img>
        <label className="text-[#001EB9] font-semibold text-base sm:text-lg">Add new product</label>
      </div>
  
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 mt-6 text-sm gap-x-6 sm:gap-x-20 gap-y-6 sm:gap-y-10 text-[#162427] font-medium"
      >
        {/* SKU */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-10">
          <label className="mb-2 sm:mb-0">SKU</label>
          <input
            type="text"
            name="sku"
            value={productData.sku}
            onChange={handleChange}
            className="w-full p-2 bg-[#F7F7F7] rounded-md focus:ring-2 focus:ring-blue-600 focus-visible:outline-none"
            required
          />
        </div>
  
        {/* Price */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-8">
          <label className="mb-2 sm:mb-0">Price</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            step="0.01"
            className="w-full p-2 bg-[#F7F7F7] rounded-md focus:ring-2 focus:ring-blue-600 focus-visible:outline-none"
            required
          />
        </div>
  
        {/* Product Name */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-7">
          <label className="mb-2 sm:mb-0">Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full p-2 bg-[#F7F7F7] rounded-md focus:ring-2 focus:ring-blue-600 focus-visible:outline-none"
            required
          />
        </div>
  
        {/* QTY */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-9">
          <label className="mb-2 sm:mb-0">QTY</label>
          <input
            type="number"
            name="quantity"
            value={productData.quantity}
            onChange={handleChange}
            className="w-full p-2 bg-[#F7F7F7] rounded-md focus:ring-2 focus:ring-blue-600 focus-visible:outline-none"
            required
          />
        </div>
  
        {/* Description */}
        <div className="flex flex-col col-span-1 sm:col-span-2">
          <label>Product Description</label>
          <label className="text-[#969191] text-xs font-normal mt-2">A small description about the product</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            className="w-full p-2 mt-4 bg-[#F7F7F7] rounded-md focus:ring-2 focus:ring-blue-600 focus-visible:outline-none"
            rows="4"
            required
          ></textarea>
        </div>
  
        {/* Image Upload */}
        <div className="flex flex-col col-span-1 sm:col-span-2 gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-20">
            <label>Product Images</label>
            <button
              type="button"
              onClick={handleButtonClick}
              className="text-[#001EB9] underline"
            >
              Add Images
            </button>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
              className="hidden"
              required
            />
          </div>
          <label className="text-[#969191] text-xs font-normal">
            JPEG, PNG, SVG or GIF <br />(Maximum file size 50MB)
          </label>
  
          {imagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 w-fit">
              {imagePreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Preview ${index}`}
                  className="w-16 h-16 object-cover rounded-lg border"
                />
              ))}
            </div>
          )}
        </div>
  
        <div className="col-span-1 sm:col-span-2 flex justify-end items-end">
          <button
            type="submit"
            disabled={loading}
            className={`py-2 px-14 rounded-lg text-white ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Adding Product...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
  
};

export default AddProduct;