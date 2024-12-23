import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/main.css';
import Swal from "sweetalert2";

const EditProduct = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    description: "",
    price: "",
    quantity: "",
    thumbnail: "",
  });
  const [selectedImages, setSelectedImages] = useState([]); 
  const [imagePreviews, setImagePreviews] = useState([]); 
  const [existingImages, setExistingImages] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product details by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
        console.log(response.data);

        setFormData({
          sku: response.data.sku,
          name: response.data.name,
          description: response.data.description,
          price: response.data.price,
          quantity: response.data.quantity,
          thumbnail: response.data.thumbnail, 
        });
        
        setExistingImages(response.data.images || []); 
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching product details");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle new image uploads
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);

    // Generate previews for the new images
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // Set the thumbnail
  const handleSetThumbnail = (image) => {
    setFormData({ ...formData, thumbnail: image });
    console.log("Selected Thumbnail:", image);

  };
  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("sku", formData.sku);
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("price", formData.price);
    form.append("quantity", formData.quantity);
    form.append("thumbnail", formData.thumbnail); // Include selected thumbnail
    selectedImages.forEach((file) => form.append("images", file));

    try {
      const response = await axios.put(`http://localhost:5000/api/products/${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.fire ({
        title: 'Product updated successfully!',
        text: "Your product details are updated",
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-[#001EB9] text-white px-6 py-2 rounded-sm mx-4',   
        },
        buttonsStyling: false,
      }).then (() => {
        navigate(`/product/${id}`);
      })
    } catch (err) {
      setError(err.response?.data?.message || "Error updating product");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to update favorites. Please try again.",
      });
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
      <div className="flex flex-wrap items-center gap-2">
        <a href="/" className="text-2xl sm:text-3xl font-bold">PRODUCTS</a>
        <img src="/assets/icon/arrow.svg" className="w-4 sm:w-5"></img>
        <label className="text-[#001EB9] font-semibold text-base sm:text-lg">Edit product</label>
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
            value={formData.sku}
            onChange={handleChange}
            className="w-full p-2 bg-[#F7F7F7] rounded-md focus:ring-2 focus:ring-blue-600 focus-visible:outline-none"
          />
        </div>
  
        {/* Price */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-8">
          <label className="mb-2 sm:mb-0">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 bg-[#F7F7F7] rounded-md focus:ring-2 focus:ring-blue-600 focus-visible:outline-none"
          />
        </div>
  
        {/* Name */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-7">
          <label className="mb-2 sm:mb-0">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 bg-[#F7F7F7] rounded-md focus:ring-2 focus:ring-blue-600 focus-visible:outline-none"
          />
        </div>
  
        {/* Quantity */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-9">
          <label className="mb-2 sm:mb-0">QTY</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full p-2 bg-[#F7F7F7] rounded-md focus:ring-2 focus:ring-blue-600 focus-visible:outline-none"
          />
        </div>
  
        {/* Description */}
        <div className="flex flex-col col-span-1 sm:col-span-2">
          <label className="">Product Description</label>
          <label className="text-[#969191] text-xs font-normal mt-2">
            A small description about the product
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 mt-4 bg-[#F7F7F7] rounded-md focus:ring-2 focus:ring-blue-600 focus-visible:outline-none"
            rows="4"
          ></textarea>
        </div>
  
        {/* Existing Images */}
        <div className="flex flex-col xl:flex-row gap-4">
          <div className="flex flex-col sm:flex-col sm:items-start sm:gap-4">
            <label>Product Images</label>
            <label className="text-[#969191] text-xs font-normal mt-2 sm:mt-0">
              JPEG, PNG, SVG or GIF <br />(Maximum file size 50MB)
            </label>
          </div>
  
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {existingImages.map((image, index) => (
              <div
                key={index}
                className={`w-16 h-16 border ${
                  formData.thumbnail === image ? "border-blue-500" : "border-gray-300"
                } rounded-lg p-1 cursor-pointer`}
                onClick={() => handleSetThumbnail(image)}
              >
                <img
                  src={`http://localhost:5000/${image}`}
                  alt={`Existing Image ${index + 1}`}
                  className="w-full h-full object-cover rounded"
                />
                {formData.thumbnail === image && (
                  <p className="text-xs text-blue-500 text-center mt-1">Thumbnail</p>
                )}
              </div>
            ))}
          </div>
        </div>
  
        {/* New Images */}
        <div className="flex flex-col sm:flex-col xl:flex-row md:items-center gap-4">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="fileInput"
          />
          <button
            type="button"
            onClick={() => document.getElementById("fileInput").click()}
            className="text-[#001EB9] underline"
          >
            Edit Images
          </button>
  
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {imagePreviews.map((preview, index) => (
                <div
                  key={index}
                  className={`w-16 h-16 border ${
                    formData.thumbnail === preview ? "border-blue-500" : "border-gray-300"
                  } rounded-lg p-1 cursor-pointer`}
                  onClick={() => handleSetThumbnail(preview)}
                >
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                  {formData.thumbnail === preview && (
                    <p className="text-xs text-blue-500 text-center mt-1">Thumbnail</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
  
        <div className="col-span-1 sm:col-span-2 flex justify-end">
          <button
            type="submit"
            className="py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
  
};

export default EditProduct;
