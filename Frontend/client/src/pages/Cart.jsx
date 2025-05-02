import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [showAddress, setShowAddress] = useState(false);

  const { products, currency, cartItems, removeCartItem, updateCartItems, getCartCount, getCartAmount } = useAppContext();

  // Filter products to only include those in the cart
  const cartProducts = products.filter((product) => cartItems[product._id] > 0);

  // Calculate tax (2% of subtotal)
  const subTotal = getCartAmount();
  const taxRate = 0.02;
  const tax = subTotal * taxRate;
  const totalAmount = subTotal + tax;
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row py-12 max-w-7xl w-full px-4 md:px-8 mx-auto min-h-screen bg-gray-50">
      {/* Cart Items Section */}
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-semibold mb-8 text-gray-800">
          Shopping Cart{" "}
          <span className="text-base text-primary font-medium">
            ({getCartCount()} {getCartCount() === 1 ? "Item" : "Items"})
          </span>
        </h1>

        {cartProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">Your cart is empty.</p>
            <button
              onClick={() => window.history.back()}
              className="mt-4 inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
            >
              <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1"
                  stroke="#4F46E5"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Cart Header */}
            <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-600 text-sm md:text-base font-semibold pb-4 border-b border-gray-200">
              <p className="text-left">Product Details</p>
              <p className="text-center">Subtotal</p>
              <p className="text-center">Action</p>
            </div>

            {/* Cart Items */}
            {cartProducts.map((product) => (
              <div
                key={product._id}
                className="grid grid-cols-[2fr_1fr_1fr] items-center text-gray-600 text-sm md:text-base py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
              >
                {/* Product Details */}
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <img
                      className="max-w-full max-h-full object-cover"
                      src={product.image[0]} // Assuming image is an array
                      alt={product.name}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 md:text-lg">{product.name}</p>
                    <div className="text-gray-500 text-sm mt-1">
                      <p>Size: <span className="font-medium">{product.size || "N/A"}</span></p>
                      <div className="flex items-center gap-2 mt-1">
                        <p>Qty:</p>
                        <select
                          value={cartItems[product._id]}
                          onChange={(e) => updateCartItems(product._id, parseInt(e.target.value))}
                          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                        >
                          {Array(10)
                            .fill("")
                            .map((_, index) => (
                              <option key={index} value={index + 1}>
                                {index + 1}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtotal */}
                <p className="text-center font-medium text-gray-800">
                  {currency}
                  {(product.offerPrice * cartItems[product._id]).toFixed(2)}
                </p>

                {/* Remove Action */}
                <button
                  onClick={() => removeCartItem(product._id)}
                  className="mx-auto p-2 rounded-full hover:bg-red-100 transition-colors duration-200"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="m12.5 7.5-5 5m0-5 5 5m5.833-2.5a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0"
                      stroke="#FF532E"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            ))}

            {/* Continue Shopping Button */}
            <button
              onClick={() => window.history.back()}
              className="group inline-flex items-center mt-8 gap-2 text-primary font-medium hover:text-indigo-800 transition-colors"
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
          </>
        )}
      </div>

      {/* Order Summary Section */}
      <div className="max-w-[360px] w-full bg-white p-6 max-md:mt-12 border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
        <hr className="border-gray-200 my-5" />

        {/* Delivery Address */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 uppercase">Delivery Address</p>
          <div className="relative flex justify-between items-start mt-2">
            <p className="text-gray-600 text-sm">No address found</p>
            <button
              onClick={() => setShowAddress(!showAddress)}
              className="text-primary text-sm font-medium hover:underline"
            >
              Change
            </button>
            {showAddress && (
              <div className="absolute top-10 left-0 py-2 bg-white border border-gray-200 rounded-lg shadow-lg text-sm w-full z-10">
                <p
                  onClick={() => setShowAddress(false)}
                  className="text-gray-600 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  New York, USA
                </p>
                <p
  onClick={() => {
    setShowAddress(false);
    navigate('/address'); // Corrected spelling too
  }}
  className="text-primary text-center px-4 py-2 hover:bg-indigo-50 cursor-pointer"
>
  Add address
</p>

              </div>
            )}
          </div>

          {/* Payment Method */}
          <p className="text-sm font-semibold text-gray-700 uppercase mt-6">Payment Method</p>
          <select className="w-full border border-gray-200 bg-white px-3 py-2 mt-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition">
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <hr className="border-gray-200" />

        {/* Summary Details */}
        <div className="text-gray-600 mt-4 space-y-3">
          <p className="flex justify-between text-sm">
            <span>Price</span>
            <span className="font-medium">
              {currency}
              {subTotal.toFixed(2)}
            </span>
          </p>
          <p className="flex justify-between text-sm">
            <span>Shipping Fee</span>
            <span className="text-green-600 font-medium">Free</span>
          </p>
          <p className="flex justify-between text-sm">
            <span>Tax (2%)</span>
            <span className="font-medium">
              {currency}
              {tax.toFixed(2)}
            </span>
          </p>
          <p className="flex justify-between text-lg font-semibold text-gray-800 mt-4">
            <span>Total Amount:</span>
            <span>
              {currency}
              {totalAmount.toFixed(2)}
            </span>
          </p>
        </div>

        {/* Place Order Button */}
        <button
          onClick={() => navigate('/checkout')}
          className="w-full py-3 mt-6 bg-primary text-white font-medium rounded-lg hover:bg-indigo-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-md"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;