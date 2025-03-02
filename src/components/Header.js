import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ setToken }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); 
  };

  return (
    <header className="bg-transparent  text-white">
      <div className="container mx-auto px-16 py-4 justify-end flex items-center gap-8">
        <div className="relative">
          <div
            className="text-[#162427] font-semibold cursor-pointer flex items-center gap-2"
            onClick={toggleDropdown} 
          >
            ADMIN
            <img src="/assets/icon/arrow.svg" className="w-5 rotate-90"></img>
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute bg-white text-[#162427] shadow-md rounded-md mt-2 py-2 w-32 border">
              <button
                onClick={handleLogout}
                className="px-4 py-2 w-full hover:bg-blue-200 hover:text-red-500"
              >
                Logout
              </button>
            </div>
          )}
        </div>
        <div className="relative">
          <div className="bg-[#001EB9] w-12 h-12 rounded-full"></div>
          <div className="bg-green-400 w-3 h-3 rounded-full absolute right-0 bottom-1"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
