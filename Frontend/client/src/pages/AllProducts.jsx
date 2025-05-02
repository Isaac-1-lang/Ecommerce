import React, { useEffect, useState, useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";

const AllProducts = () => {
  const { products, searchQuery } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const productsPerPage = 10; // Number of products per page

  // Filter and sort products
  useEffect(() => {
    let updatedProducts = [...products];

    // Apply search query filter
    if (searchQuery.length > 0) {
      updatedProducts = updatedProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter for in-stock products
    updatedProducts = updatedProducts.filter((product) => product.inStock);

    // Sort products based on sortOption
    if (sortOption === "name-asc") {
      updatedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "name-desc") {
      updatedProducts.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOption === "price-asc") {
      updatedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      updatedProducts.sort((a, b) => b.price - a.price);
    } else if (sortOption === "rating-desc") {
      updatedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setFilteredProducts(updatedProducts);
    setCurrentPage(1); // Reset to page 1 when filters or sorting changes
  }, [products, searchQuery, sortOption]);

  // Handle sort option change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Memoize the in-stock product count
  const inStockCount = useMemo(() => {
    return filteredProducts.filter((product) => product.inStock).length;
  }, [filteredProducts]);

  // Calculate pagination details
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
    }
  };

  return (
    <div className="mt-16 flex flex-col w-full px-6 py-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between w-full mb-6">
        <div className="flex flex-col items-start">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 uppercase tracking-wide">
            All Products
          </h1>
          <div className="w-16 h-1 bg-green-500 rounded-full mt-2"></div>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <label htmlFor="sort" className="text-sm font-medium text-gray-600">
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

      {/* Products Grid */}
      <div className="w-full">
        {filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {currentProducts.map((product, index) => (
                <ProductCard key={product._id || index} product={product} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  Previous
                </button>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        currentPage === page
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchQuery.length > 0
                ? `No products found for "${searchQuery}"`
                : "No products are currently in stock."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;