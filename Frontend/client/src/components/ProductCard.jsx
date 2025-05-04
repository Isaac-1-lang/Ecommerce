import React, { useState, useEffect } from "react";
import { assets } from "../assets/images/greencart_assets/assets";
import { useAppContext } from "../context/AppContext";
import { addToFavourites, removeFromFavourites } from "../redux/wishlistSlice";
import { useDispatch, useSelector } from "react-redux";

const ProductCard = ({ product }) => {
  const { currency, addToCart, removeCartItem, navigate, cartItems } = useAppContext();
  const dispatch = useDispatch();
  const favourites = useSelector((state) => state.wishlist.favourites);
  const isFavourite = favourites.includes(product._id);
  
  // State for favorite notification
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState(""); // "add" or "remove"

  useEffect(() => {
    // Hide notification after 2 seconds
    let timer;
    if (showNotification) {
      timer = setTimeout(() => {
        setShowNotification(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [showNotification]);

  const handleToggleFavourite = (e) => {
    e.stopPropagation();
    
    if (isFavourite) {
      dispatch(removeFromFavourites(product._id));
      setNotificationMessage(`${product.name} removed from favorites`);
      setNotificationType("remove");
    } else {
      dispatch(addToFavourites(product._id));
      setNotificationMessage(`${product.name} added to favorites`);
      setNotificationType("add");
    }
    
    setShowNotification(true);
  };

  if (!product) return null;

  // Calculate discount percentage
  const discountPercentage =
    product.price !== product.offerPrice
      ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
      : 0;

  // Check if item is in cart
  const itemInCart = cartItems[product._id] > 0;

  // Determine if product is on sale
  const isOnSale = product.price !== product.offerPrice;

  const handleProductClick = () => {
    navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
    scrollTo(0, 0);
  };

  const handleCartAction = (e, action) => {
    e.stopPropagation();
    if (action === "add") {
      addToCart(product._id);
    } else if (action === "remove") {
      removeCartItem(product._id);
    }
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full relative group cursor-pointer"
      onClick={handleProductClick}
    >
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          {discountPercentage}% OFF
        </div>
      )}

      {/* Favorite Notification */}
      {showNotification && (
        <div 
          className={`absolute top-3 right-3 px-3 py-2 rounded-lg text-white text-xs font-medium z-20 transition-all duration-300 transform ${
            notificationType === "add" ? "bg-green-600" : "bg-gray-700"
          }`}
        >
          <div className="flex items-center gap-1">
            {notificationType === "add" ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {notificationMessage}
          </div>
        </div>
      )}

      {/* Image Section with gradient overlay on hover */}
      <div className="relative pt-3 px-3 pb-0 flex-shrink-0">
        <div className="aspect-square w-full flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden group-hover:bg-gray-100 transition-all">
          <img
            className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            src={product.image[0]}
            alt={product.name}
          />
        </div>
      </div>

      {/* Product Info Section */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category */}
        <p className="text-gray-500 text-xs uppercase tracking-wide font-medium mb-1">
          {product.category}
        </p>

        {/* Product Name */}
        <h3 className="text-gray-800 font-medium text-sm sm:text-base mb-1 line-clamp-2 h-10">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {Array(5)
            .fill("")
            .map((_, i) => (
              <img
                key={i}
                className="w-4 h-4"
                src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                alt={i < 4 ? "filled star" : "empty star"}
              />
            ))}
          <p className="text-gray-500 text-xs ml-1">(4)</p>
        </div>

        {/* Price and Cart/Favorites Controls */}
        <div className="flex items-center justify-between mt-auto">
          {/* Price */}
          <div className="flex items-baseline gap-1">
            <p className="text-lg font-bold text-gray-800">
              {currency}
              {product.offerPrice}
            </p>
            {isOnSale && (
              <p className="text-sm text-gray-400 line-through">
                {currency}
                {product.price}
              </p>
            )}
          </div>

          {/* Cart and Favorites Controls */}
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {/* Cart Controls */}
            {itemInCart ? (
              <div className="flex items-center rounded-full overflow-hidden border border-gray-200">
                <button
                  onClick={(e) => handleCartAction(e, "remove")}
                  className="w-7 h-7 flex items-center justify-center bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  aria-label="Remove from cart"
                >
                  <span className="text-lg font-medium">-</span>
                </button>
                <span className="w-7 h-7 flex items-center justify-center text-sm font-medium text-gray-700 bg-white">
                  {cartItems[product._id]}
                </span>
                <button
                  onClick={(e) => handleCartAction(e, "add")}
                  className="w-7 h-7 flex items-center justify-center bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  aria-label="Add to cart"
                >
                  <span className="text-lg font-medium">+</span>
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => handleCartAction(e, "add")}
                className="flex items-center gap-1 bg-green-50 text-green-600 border border-green-200 px-3 py-1.5 rounded-full hover:bg-green-100 transition-colors text-sm font-medium"
                aria-label="Add to cart"
              >
                <img src={assets.cart_icon} alt="Cart" className="w-4 h-4" />
                Add
              </button>
            )}

            {/* Favorites Toggle with Animated Heart */}
            <button
              onClick={handleToggleFavourite}
              className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
                isFavourite 
                  ? "bg-red-100 text-red-600 scale-110" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              aria-label={isFavourite ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavourite ? (
                <img 
                  src={assets.favourite_icon} 
                  alt="Favorite" 
                  className="w-5 h-5 animate-pulse"
                />
              ) : (
                <img 
                  src={assets.heart} 
                  alt="Add to favorites" 
                  className="w-5 h-5"
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;