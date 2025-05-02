import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const ProductDetails = () => {
  const { products, addToCart } = useAppContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [thumbnail, setThumbnail] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState("description");
  const [showNotification, setShowNotification] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Find the product based on the ID
  useEffect(() => {
    const foundProduct = products.find((p) => p._id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setThumbnail(foundProduct.image);
      
      // Generate mock reviews
      const mockReviews = generateMockReviews(foundProduct.name);
      setReviews(mockReviews);
      
      // Find related products
      const related = products
        .filter(p => p.category === foundProduct.category && p._id !== id)
        .slice(0, 4);
      setRelatedProducts(related);
    }
  }, [id, products]);

  // Generate fake reviews for demo purposes
  const generateMockReviews = (productName) => {
    return [
      {
        id: 1,
        name: "Alex Johnson",
        date: "March 28, 2025",
        rating: 5,
        comment: `This ${productName} is fantastic! Exactly what I needed and the quality is outstanding.`
      },
      {
        id: 2, 
        name: "Sarah Miller",
        date: "March 15, 2025",
        rating: 4,
        comment: `Really happy with my ${productName}, shipping was quick and product works great.`
      },
      {
        id: 3,
        name: "Michael Lee",
        date: "February 22, 2025",
        rating: 5,
        comment: `I've tried many similar products but this ${productName} is by far the best one.`
      }
    ];
  };

  // Handle quantity change
  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  // Handle direct quantity input
  const handleQuantityInput = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    } else if (e.target.value === "") {
      setQuantity("");
    }
  };

  const handleQuantityBlur = () => {
    if (quantity === "" || quantity < 1) {
      setQuantity(1);
    }
  };

  // Handle Add to Cart with animation
  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product._id);
      }
      // Show notification
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }
  };

  // Handle image zoom
  const handleImageMouseMove = (e) => {
    if (!isZoomed) return;
    
    const image = e.currentTarget;
    const { left, top, width, height } = image.getBoundingClientRect();
    
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomPosition({ x, y });
  };

  const handleBuyNow = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product._id);
      }
      navigate("/checkout");
    }
  };

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <div className="animate-pulse">
          <div className="h-8 w-64 mx-auto bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-32 mx-auto bg-gray-200 rounded"></div>
        </div>
        <Link
          to="/products"
          className="mt-6 inline-block px-6 py-2 bg-green-500 text-white rounded-md font-medium transition-all duration-300 hover:bg-green-600"
        >
          Explore All Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Notification */}


      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-green-600 transition-colors">
          Home
        </Link>{" "}
        /{" "}
        <Link to="/products" className="hover:text-green-600 transition-colors">
          Products
        </Link>{" "}
        /{" "}
        <Link
          to={`/products/${product.category?.toLowerCase()}`}
          className="hover:text-green-600 transition-colors"
        >
          {product.category}
        </Link>{" "}
        /{" "}
        <span className="text-green-600">{product.name}</span>
      </nav>

      {/* Product Details */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-16">
        {/* Image Gallery */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-3">
            {[product.image, ...(product.images || [])].map((image, index) => (
              <div
                key={index}
                onClick={() => setThumbnail(image)}
                className={`border border-gray-300 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                  thumbnail === image
                    ? "border-green-500 shadow-md"
                    : "hover:border-green-500 hover:shadow-sm"
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-20 h-20 object-cover"
                />
              </div>
            ))}
          </div>

          <div 
            className="border border-gray-300 rounded-lg overflow-hidden flex-1 max-w-md relative"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleImageMouseMove}
          >
            <img
              src={thumbnail}
              alt="Selected product"
              className="w-full h-96 object-cover"
            />
            {isZoomed && (
              <div className="absolute inset-0 bg-white overflow-hidden pointer-events-none">
                <img
                  src={thumbnail}
                  alt="Zoomed product"
                  className="absolute w-full h-full object-cover"
                  style={{ 
                    transform: 'scale(2)',
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                  }}
                />
              </div>
            )}
            <div className="absolute bottom-3 right-3 bg-white/80 px-2 py-1 rounded text-xs text-gray-600">
              Hover to zoom
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 text-sm">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${
                  i < Math.round(product.rating || 0)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <p className="text-base ml-2 text-gray-600">
              ({product.rating || 0})
            </p>
            <span className="ml-2 text-green-600 cursor-pointer hover:underline" onClick={() => setSelectedTab("reviews")}>
              See all reviews
            </span>
          </div>

          {/* Price */}
          <div className="mt-6">
            {product.offerPrice && product.offerPrice < product.price ? (
              <div className="flex items-baseline gap-2">
                <p className="text-gray-500 line-through">
                  MRP: ${product.price.toFixed(2)}
                </p>
                <p className="text-2xl font-semibold text-gray-800">
                  ${product.offerPrice.toFixed(2)}
                </p>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                  Save ${(product.price - product.offerPrice).toFixed(2)}
                </span>
              </div>
            ) : (
              <p className="text-2xl font-semibold text-gray-800">
                ${product.price.toFixed(2)}
              </p>
            )}
            <span className="text-gray-500 text-xs">
              (inclusive of all taxes)
            </span>
          </div>

          {/* Availability */}
          <div className="mt-4 flex items-center">
            <span className="h-3 w-3 bg-green-500 rounded-full mr-2"></span>
            <span className="text-green-600 font-medium">In Stock</span>
          </div>

          {/* Tabs */}
          <div className="mt-8 border-b border-gray-200">
            <div className="flex -mb-px">
              {["description", "specifications", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-4 py-2 font-medium text-sm capitalize transition-colors ${
                    selectedTab === tab
                      ? "border-b-2 border-green-500 text-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="py-4">
            {selectedTab === "description" && (
              <div className="text-gray-600">
                <ul className="list-disc ml-4 space-y-2">
                  {(product.description || []).map((desc, index) => (
                    <li key={index}>{desc}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedTab === "specifications" && (
              <div className="text-gray-600">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 p-2">Brand</div>
                  <div className="p-2">Organic Greens</div>
                  <div className="bg-gray-50 p-2">Weight</div>
                  <div className="p-2">500g</div>
                  <div className="bg-gray-50 p-2">Origin</div>
                  <div className="p-2">Local Farm</div>
                  <div className="bg-gray-50 p-2">Storage</div>
                  <div className="p-2">Refrigerated</div>
                </div>
              </div>
            )}

            {selectedTab === "reviews" && (
              <div>
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <div className="text-4xl font-bold text-gray-800">
                      {product.rating || 0}
                    </div>
                    <div className="ml-4">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.round(product.rating || 0)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <div className="text-sm text-gray-500">Based on {reviews.length} reviews</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4">
                      <div className="flex justify-between">
                        <div className="font-medium">{review.name}</div>
                        <div className="text-gray-500 text-sm">{review.date}</div>
                      </div>
                      <div className="flex mt-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? "text-yellow-400" : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>

                <button className="mt-4 text-green-600 hover:text-green-700 font-medium">
                  Write a Review
                </button>
              </div>
            )}
          </div>

          {/* Quantity Selector and Buttons */}
          <div className="mt-8">
            <div className="flex items-center gap-4 mb-4">
              <p className="text-sm font-medium text-gray-600">Quantity:</p>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  -
                </button>
                <input
                  type="text"
                  value={quantity}
                  onChange={handleQuantityInput}
                  onBlur={handleQuantityBlur}
                  className="w-12 py-1 text-center text-gray-800 focus:outline-none"
                />
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleAddToCart}
                className="w-full py-3 font-medium bg-green-500 text-white rounded-md transition-all duration-300 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
                Add to Cart
              </button>
              <button 
                onClick={handleBuyNow}
                className="w-full py-3 font-medium bg-gray-800 text-white rounded-md transition-all duration-300 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
              >
                Buy Now
              </button>
            </div>
          </div>
          
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">You might also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <Link
                key={item._id}
                to={`/products/${item._id}`}
                className="group"
              >
                <div className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 group-hover:shadow-md">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-800 group-hover:text-green-600 transition-colors">
                      {item.name}
                    </h3>
                    <p className="mt-1 font-semibold">
                      ${item.offerPrice || item.price}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;