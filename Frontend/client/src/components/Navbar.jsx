import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/images/greencart_assets/assets";
import { useAppContext } from "../context/AppContext";
import { useSelector } from "react-redux"; // Import useSelector to access Redux state

const Navbar = () => {
  const [open, setOpen] = useState(false); // For mobile menu
  const [profileOpen, setProfileOpen] = useState(false); // For profile dropdown
  const {
    user,
    setUser,
    setShowUserLogin,
    navigate,
    setSearchQuery,
    searchQuery,
    cartItems,
  } = useAppContext();

  // Get favorites from Redux state
  const favourites = useSelector((state) => state.wishlist.favourites);
  const favouritesCount = favourites.length; // Calculate favorites count

  const profileRef = useRef(null);

  // Calculate cart item count
  const cartItemCount = Object.values(cartItems).reduce(
    (total, quantity) => total + quantity,
    0
  );

  // Handle click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    setOpen(false);
    setProfileOpen(false);
    navigate("/login"); // Redirect to login after logout
  };

  // Navigate to products page on search
  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/products");
    }
  }, [searchQuery, navigate]);

  // Shared style for nav links
  const navLinkStyle = ({ isActive }) =>
    `transition-colors duration-200 ${
      isActive ? "text-gray-900 font-semibold" : "text-gray-600 hover:text-gray-900"
    }`;

  // Shared style for menu items
  const menuItemStyle =
    "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200";

  // Profile menu items
  const ProfileMenu = () => (
    <div className="profile-menu absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
      <ul className="flex flex-col">
        {user?.role === "admin" && (
          <li>
            <NavLink
              to="/admin/dashboard"
              className={menuItemStyle}
              onClick={() => setProfileOpen(false)}
            >
              Admin Dashboard
            </NavLink>
          </li>
        )}
        <li>
          <NavLink
            to="/my-orders"
            className={menuItemStyle}
            onClick={() => setProfileOpen(false)}
          >
            My Orders
          </NavLink>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className={menuItemStyle}
            aria-label="Logout"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white shadow-md">
      {/* Logo */}
      <NavLink
        to="/"
        aria-label="GreenCart Home"
        onClick={() => setOpen(false)}
      >
        <img
          className="h-8 transition-transform duration-300 hover:scale-105"
          src={assets.logo}
          alt="GreenCart Logo"
        />
      </NavLink>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex items-center gap-8 text-base font-medium">
        <NavLink to="/" className={navLinkStyle}>
          Home
        </NavLink>
        <NavLink to="/products" className={navLinkStyle}>
          All Products
        </NavLink>
        <NavLink to="/contact" className={navLinkStyle}>
          Contact
        </NavLink>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Desktop Search */}
        <div className="hidden md:flex items-center border border-gray-300 rounded-full px-3 py-1">
          <img src={assets.search_icon} alt="Search" className="w-4 h-4 mr-2" />
          <input
            type="text"
            placeholder="Search products"
            className="text-sm text-gray-600 focus:outline-none"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery} // Controlled input
          />
        </div>

        {/* Favorites */}
        <NavLink to="/favourite" className="relative">
          <img
            src={assets.favourite_icon} // Use a heart icon from assets if available
            alt="Favorites"
            className="w-6 h-6"
          />
          {favouritesCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {favouritesCount}
            </span>
          )}
        </NavLink>

        {/* Cart */}
        <NavLink to="/cart" className="relative">
          <img src={assets.nav_cart_icon} alt="Cart" className="w-6 h-6" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </NavLink>

        {/* Profile or Login */}
        {user ? (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              aria-label="Toggle Profile Menu"
              className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <img
                src={assets.profile_icon}
                alt="Profile"
                className="w-6 h-6"
              />
            </button>
            {profileOpen && <ProfileMenu />}
          </div>
        ) : (
          <NavLink
            to="/login"
            className="px-4 py-1 bg-green-500 text-white rounded-full text-sm font-medium transition-all duration-300 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
            onClick={() => setOpen(false)}
          >
            Login
          </NavLink>
        )}

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle Navigation Menu"
          aria-expanded={open}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
        >
          <img
            src={assets.menu_icon}
            alt="Menu"
            className={`w-6 h-6 transition-transform duration-300 ${
              open ? "rotate-90" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Nav */}
      <div
        className={`${
          open ? "flex" : "hidden"
        } md:hidden absolute top-full left-0 w-full bg-white shadow-lg flex-col text-base font-medium transition-all duration-300 ease-in-out`}
      >
        <div className="flex flex-col items-start gap-4 p-6">
          <NavLink
            to="/"
            className={navLinkStyle}
            onClick={() => setOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={navLinkStyle}
            onClick={() => setOpen(false)}
          >
            All Products
          </NavLink>
          <NavLink
            to="/contact"
            className={navLinkStyle}
            onClick={() => setOpen(false)}
          >
            Contact
          </NavLink>
          <NavLink
            to="/favourite"
            className={navLinkStyle}
            onClick={() => setOpen(false)}
          >
            Favorites ({favouritesCount})
          </NavLink>
          <NavLink
            to="/cart"
            className={navLinkStyle}
            onClick={() => setOpen(false)}
          >
            Cart ({cartItemCount})
          </NavLink>

          {/* Mobile Search */}
          <div className="flex items-center border border-gray-300 rounded-full px-3 py-1 w-full">
            <img
              src={assets.search_icon}
              alt="Search"
              className="w-4 h-4 mr-2"
            />
            <input
              type="text"
              placeholder="Search products"
              className="text-sm text-gray-600 focus:outline-none w-full"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery} // Controlled input
            />
          </div>

          {user ? (
            <>
              {user.role === "admin" && (
                <NavLink
                  to="/admin/dashboard"
                  className={navLinkStyle}
                  onClick={() => setOpen(false)}
                >
                  Admin Dashboard
                </NavLink>
              )}
              <NavLink
                to="/my-orders"
                className={navLinkStyle}
                onClick={() => setOpen(false)}
              >
                My Orders
              </NavLink>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-1 bg-red-500 text-white rounded-full text-sm font-medium transition-all duration-300 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className="w-full px-4 py-1 bg-green-500 text-white rounded-full text-sm font-medium transition-all duration-300 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
              onClick={() => setOpen(false)}
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;