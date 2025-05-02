import React from "react";
import { assets } from "../assets/images/greencart_assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
  const { currency, addToCart, removeCartItem, navigate, cartItems } = useAppContext();

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
    if (action === 'add') {
      addToCart(product._id);
    } else if (action === 'remove') {
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

        {/* Price and Cart Controls */}
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

          {/* Cart Controls */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center"
          >
            {itemInCart ? (
              <div className="flex items-center rounded-full overflow-hidden border border-gray-200">
                <button
                  onClick={(e) => handleCartAction(e, 'remove')}
                  className="w-7 h-7 flex items-center justify-center bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  aria-label="Remove from cart"
                >
                  <span className="text-lg font-medium">-</span>
                </button>
                <span className="w-7 h-7 flex items-center justify-center text-sm font-medium text-gray-700 bg-white">
                  {cartItems[product._id]}
                </span>
                <button
                  onClick={(e) => handleCartAction(e, 'add')}
                  className="w-7 h-7 flex items-center justify-center bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  aria-label="Add to cart"
                >
                  <span className="text-lg font-medium">+</span>
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => handleCartAction(e, 'add')}
                className="flex items-center gap-1 bg-green-50 text-green-600 border border-green-200 px-3 py-1.5 rounded-full hover:bg-green-100 transition-colors text-sm font-medium"
                aria-label="Add to cart"
              >
                <img src={assets.cart_icon} alt="" className="w-4 h-4" />
                Add
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;