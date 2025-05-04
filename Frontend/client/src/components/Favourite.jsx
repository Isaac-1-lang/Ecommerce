import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeFromFavourites } from "../redux/wishlistSlice";

const Favorites = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  
  const { products, currency, addToCart } = useAppContext();
  const favourites = useSelector((state) => state.wishlist.favourites);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Filter products to only include those in favorites
  const favoriteProducts = products.filter((product) => favourites.includes(product._id));
  
  const handleRemoveFromFavorites = (product) => {
    dispatch(removeFromFavourites(product._id));
    setNotificationMessage(`${product.name} removed from favorites`);
    setShowNotification(true);
    
    // Hide notification after 2 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 2000);
  };
  
  const handleAddToCart = (product) => {
    addToCart(product._id);
    setNotificationMessage(`${product.name} added to cart`);
    setShowNotification(true);
    
    // Hide notification after 2 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col py-12 max-w-7xl w-full px-4 md:px-8 mx-auto min-h-screen bg-gray-50">
      {/* Notification Banner */}
      {showNotification && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="font-medium">{notificationMessage}</p>
          </div>
        </div>
      )}
      
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-gray-800">
          My Favorites{" "}
          <span className="text-base text-primary font-medium">
            ({favoriteProducts.length} {favoriteProducts.length === 1 ? "Item" : "Items"})
          </span>
        </h1>
        
        {favoriteProducts.length > 0 && (
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-300"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 16C4.9 16 4.01 16.9 4.01 18C4.01 19.1 4.9 20 6 20C7.1 20 8 19.1 8 18C8 16.9 7.1 16 6 16ZM0 0V2H2L5.6 9.59L4.2 12.04C4.08 12.32 4 12.65 4 13C4 14.1 4.9 15 6 15H18V13H6.42C6.28 13 6.17 12.89 6.17 12.75L6.2 12.63L7.1 11H14.55C15.3 11 15.96 10.59 16.3 9.97L19.88 3.5C19.96 3.34 20 3.17 20 3C20 2.45 19.55 2 19 2H4.21L3.27 0H0ZM16 16C14.9 16 14.01 16.9 14.01 18C14.01 19.1 14.9 20 16 20C17.1 20 18 19.1 18 18C18 16.9 17.1 16 16 16Z" fill="white"/>
            </svg>
            View Cart
          </button>
        )}
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-center mb-4">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#E0E0E0"/>
            </svg>
          </div>
          <p className="text-lg text-gray-500 mb-4">Your favorites list is empty.</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-300"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7.5 0.75L14.25 7.5L7.5 14.25M14.25 7.5H0.75"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Explore Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full relative overflow-hidden border border-gray-200"
            >
              {/* Product Image */}
              <div 
                className="relative pt-3 px-3 pb-0 cursor-pointer"
                onClick={() => navigate(`/products/${product.category.toLowerCase()}/${product._id}`)}
              >
                <div className="aspect-square w-full flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden">
                  <img
                    className="w-full h-full object-contain p-4 transition-transform duration-300 hover:scale-105"
                    src={product.image[0]}
                    alt={product.name}
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 flex flex-col flex-grow">
                {/* Category */}
                <p className="text-gray-500 text-xs uppercase tracking-wide font-medium mb-1">
                  {product.category}
                </p>

                {/* Product Name */}
                <h3 
                  className="text-gray-800 font-medium text-base mb-1 line-clamp-2 cursor-pointer"
                  onClick={() => navigate(`/products/${product.category.toLowerCase()}/${product._id}`)}
                >
                  {product.name}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-2 mt-2">
                  <p className="text-lg font-bold text-gray-800">
                    {currency}
                    {product.offerPrice}
                  </p>
                  {product.price !== product.offerPrice && (
                    <p className="text-sm text-gray-400 line-through">
                      {currency}
                      {product.price}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-indigo-600 transition-colors text-sm font-medium"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemoveFromFavorites(product)}
                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    aria-label="Remove from favorites"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {favoriteProducts.length > 0 && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-primary font-medium hover:text-indigo-800 transition-colors"
          >
            <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1"
                stroke="#4fbf8b"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default Favorites;