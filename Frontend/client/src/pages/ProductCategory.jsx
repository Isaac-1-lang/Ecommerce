import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useParams, Link } from "react-router-dom";
import { categories } from "../assets/images/greencart_assets/assets";
import ProductCard from "../components/ProductCard";

const ProductCategory = () => {
  const { products } = useAppContext();
  const { category } = useParams();
  const [sortOption, setSortOption] = useState("default"); // Sorting state
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Find the category from the URL
  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === category?.toLowerCase()
  );

  // Filter and sort products
  useEffect(() => {
    if (!searchCategory) return;

    let updatedProducts = products.filter(
      (product) =>
        product.category?.toLowerCase() === searchCategory.path.toLowerCase()
    );

    // Sort products based on sortOption
    if (sortOption === "name-asc") {
      updatedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "name-desc") {
      updatedProducts.sort((a, b) => b.name.localeCompare(b.name));
    } else if (sortOption === "price-asc") {
      updatedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      updatedProducts.sort((a, b) => b.price - a.price);
    } else if (sortOption === "rating-desc") {
      updatedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setFilteredProducts(updatedProducts);
  }, [products, searchCategory, sortOption]);

  // Handle sort option change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div className="mt-16 px-6 py-8">
      {/* Header Section */}
      {searchCategory ? (
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between w-full mb-6">
          <div className="flex flex-col items-start">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 uppercase tracking-wide">
              {searchCategory.text}
            </h1>
            <div className="w-16 h-1 bg-green-500 rounded-full mt-2"></div>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <label
              htmlFor="sort"
              className="text-sm font-medium text-gray-600 whitespace-nowrap"
            >
              Sort by:
            </label>
            <select
              id="sort"
              value={sortOption}
              onChange={handleSortChange}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="default">Default</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="rating-desc">Rating (High to Low)</option>
            </select>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-2xl font-medium text-gray-800">
            Category not found
          </p>
        </div>
      )}

      {/* Products Grid */}
      {searchCategory && (
        <div className="w-full">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <p className="text-xl md:text-2xl font-medium text-gray-800">
                No products found in {searchCategory.text}.
              </p>
              <p className="text-gray-500 mt-2">
                Check out other categories for more options!
              </p>
              <Link
                to="/products"
                className="mt-4 px-6 py-2 bg-green-500 text-white rounded-md font-medium transition-all duration-300 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
              >
                Explore All Products
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductCategory;