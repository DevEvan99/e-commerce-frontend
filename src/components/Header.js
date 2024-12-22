import React, { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-transparent  text-white">
      <div className="container mx-auto px-16 py-4 justify-end flex items-center gap-8">
        <div>
          <label className="text-[#162427] font-semibold">ADMIN</label>
        </div>
        <div className="relative">
          <div className="bg-[#001EB9] w-12 h-12 rounded-full"></div>
          <div className="bg-green-400 w-3 h-3 rounded-full absolute right-0 bottom-1"></div>
        </div>
        


        {/* Hamburger Menu */}
        {/* <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            ></path>
          </svg>
        </button>
      */}
      </div> 

      {/* Mobile Menu */}
      {/* {isMenuOpen && (
        <div className="md:hidden bg-blue-700 text-white">
          <nav className="flex flex-col space-y-2 py-2 px-4">
            <a href="/" className="hover:text-gray-300">Home</a>
            <a href="/products" className="hover:text-gray-300">Products</a>
            <a href="/favorites" className="hover:text-gray-300">Favorites</a>
            <a href="/add-product" className="hover:text-gray-300">Add Product</a>
          </nav>
        </div>
      )} */}
    </header>
  );
};

export default Header;
