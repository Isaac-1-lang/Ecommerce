import React, { useEffect, useState, useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import { LayoutGrid, List, ChevronDown, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// AllProducts Component with Enhanced UI and Animations
const AllProducts = () => {
  // State Management
  const { products, searchQuery } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid"); // grid or list view
  const [productsPerPage, setProductsPerPage] = useState(10);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Extract unique categories from products
  useEffect(() => {
    if (products.length > 0) {
      const uniqueCategories = [...new Set(products.map(product => product.category))];
      setCategories(uniqueCategories);
      
      // Simulate loading
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [products]);

  // Effect for Filtering and Sorting Products
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

    // Apply category filter
    if (selectedCategories.length > 0) {
      updatedProducts = updatedProducts.filter(product => 
        selectedCategories.includes(product.category)
      );
    }

    // Apply price range filter
    updatedProducts = updatedProducts.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

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
  }, [products, searchQuery, sortOption, selectedCategories, priceRange]);

  // Memoized Values
  const inStockCount = useMemo(() => {
    return filteredProducts.filter((product) => product.inStock).length;
  }, [filteredProducts]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const handlePriceRangeChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = Number(value);
    setPriceRange(newRange);
  };

  const toggleFilterMenu = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
    setSortOption("default");
  };

  // Define animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Loading skeleton component
  const ProductSkeleton = () => (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 bg-gray-200 animate-pulse"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
      </div>
    </div>
  );

  // Render
  return (
    <div className="mt-16 flex flex-col w-full px-6 py-8">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between w-full mb-6"
      >
        <div className="flex flex-col items-start">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 uppercase tracking-wide">
            All Products
          </h1>
          <div className="w-16 h-1 bg-green-500 rounded-full mt-2"></div>
          <p className="text-gray-600 mt-2">
            {inStockCount} products available
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 mt-4 sm:mt-0">
          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 flex items-center ${
                viewMode === "grid" ? "bg-green-500 text-white" : "text-gray-700"
              }`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 flex items-center ${
                viewMode === "list" ? "bg-green-500 text-white" : "text-gray-700"
              }`}
            >
              <List size={18} />
            </button>
          </div>
          
          {/* Filter Button (Mobile) */}
          <button 
            onClick={toggleFilterMenu}
            className="md:hidden flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
          >
            <Filter size={16} />
            Filters
          </button>
          
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm font-medium text-gray-600 hidden sm:block">
              Sort by:
            </label>
            <div className="relative">
              <select
                id="sort"
                value={sortOption}
                onChange={handleSortChange}
                className="pl-3 pr-8 py-2 appearance-none border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                <option value="default">Default</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="rating-desc">Rating (High to Low)</option>
              </select>
              <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
          
          {/* Items Per Page */}
          <div className="flex items-center gap-2 ml-2">
            <label htmlFor="perPage" className="text-sm font-medium text-gray-600 hidden sm:block">
              Show:
            </label>
            <select
              id="perPage"
              value={productsPerPage}
              onChange={(e) => setProductsPerPage(Number(e.target.value))}
              className="pl-3 pr-8 py-2 appearance-none border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Main Content with Sidebar */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter Sidebar - Desktop */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden md:block w-64 bg-white p-4 rounded-lg shadow-sm"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">Filters</h3>
            <button 
              onClick={resetFilters}
              className="text-sm text-green-600 hover:text-green-800"
            >
              Reset all
            </button>
          </div>
          
          {/* Categories */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-2">Categories</h4>
            {categories.map(category => (
              <div key={category} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`category-${category}`}
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <label htmlFor={`category-${category}`} className="ml-2 text-sm text-gray-700">
                  {category}
                </label>
              </div>
            ))}
          </div>
          
          {/* Price Range */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Price Range</h4>
            <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
            <div className="relative mb-4">
              <div className="h-1 bg-gray-200 rounded-full">
                <div 
                  className="absolute h-1 bg-green-500 rounded-full"
                  style={{ 
                    left: `${(priceRange[0] / 1000) * 100}%`, 
                    right: `${100 - (priceRange[1] / 1000) * 100}%` 
                  }}
                ></div>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[0]}
                onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                className="absolute top-0 left-0 w-full appearance-none bg-transparent pointer-events-none"
                style={{ height: "4px" }}
              />
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[1]}
                onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                className="absolute top-0 left-0 w-full appearance-none bg-transparent pointer-events-none"
                style={{ height: "4px" }}
              />
            </div>
            <div className="flex gap-2">
              <div className="w-1/2">
                <label htmlFor="min-price" className="sr-only">Min Price</label>
                <input
                  type="number"
                  id="min-price"
                  min="0"
                  max={priceRange[1]}
                  value={priceRange[0]}
                  onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Min"
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="max-price" className="sr-only">Max Price</label>
                <input
                  type="number"
                  id="max-price"
                  min={priceRange[0]}
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filter Mobile Menu */}
        <AnimatePresence>
          {isFilterMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-80 bg-white shadow-lg overflow-y-auto p-4"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-gray-800 text-lg">Filters</h3>
                <button 
                  onClick={toggleFilterMenu}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-4">
                <button 
                  onClick={resetFilters}
                  className="w-full py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                >
                  Reset all filters
                </button>
              </div>
              
              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">Categories</h4>
                {categories.map(category => (
                  <div key={category} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`mobile-category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    />
                    <label htmlFor={`mobile-category-${category}`} className="ml-2 text-sm text-gray-700">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
              
              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">Price Range</h4>
                <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
                <div className="relative mb-4">
                  <div className="h-1 bg-gray-200 rounded-full">
                    <div 
                      className="absolute h-1 bg-green-500 rounded-full"
                      style={{ 
                        left: `${(priceRange[0] / 1000) * 100}%`, 
                        right: `${100 - (priceRange[1] / 1000) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                    className="absolute top-0 left-0 w-full appearance-none bg-transparent pointer-events-none"
                    style={{ height: "4px" }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                    className="absolute top-0 left-0 w-full appearance-none bg-transparent pointer-events-none"
                    style={{ height: "4px" }}
                  />
                </div>
                <div className="flex gap-2">
                  <div className="w-1/2">
                    <input
                      type="number"
                      min="0"
                      max={priceRange[1]}
                      value={priceRange[0]}
                      onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                      className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Min"
                    />
                  </div>
                  <div className="w-1/2">
                    <input
                      type="number"
                      min={priceRange[0]}
                      max="1000"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                      className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
              
              <button 
                onClick={toggleFilterMenu}
                className="w-full py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Apply Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Overlay for mobile filter */}
        {isFilterMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-40 md:hidden"
            onClick={toggleFilterMenu}
          />
        )}

        {/* Products Container */}
        <div className="flex-1">
          {/* Active Filters */}
          {(selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000) && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-gray-50 rounded-md"
            >
              <span className="text-sm font-medium text-gray-700">Active filters:</span>
              
              {selectedCategories.map(category => (
                <span 
                  key={category} 
                  className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-600"
                >
                  {category}
                  <button onClick={() => handleCategoryToggle(category)} className="text-gray-400 hover:text-gray-600">
                    <X size={14} />
                  </button>
                </span>
              ))}
              
              {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-600">
                  ${priceRange[0]} - ${priceRange[1]}
                  <button 
                    onClick={() => setPriceRange([0, 1000])} 
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}
              
              <button 
                onClick={resetFilters}
                className="ml-auto text-xs text-green-600 hover:text-green-800"
              >
                Clear all
              </button>
            </motion.div>
          )}

          {/* Products Display */}
          {isLoading ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={viewMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                : "flex flex-col gap-4"
              }
            >
              {Array.from({ length: 8 }).map((_, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <ProductSkeleton />
                </motion.div>
              ))}
            </motion.div>
          ) : filteredProducts.length > 0 ? (
            <motion.div 
              layout
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={viewMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                : "flex flex-col gap-4"
              }
            >
              <AnimatePresence>
                {currentProducts.map((product, index) => (
                  <motion.div
                    key={product._id || index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className={viewMode === "list" ? "w-full" : ""}
                  >
                    <ProductCard 
                      product={product} 
                      viewMode={viewMode}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <X size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg mb-2">
                {searchQuery.length > 0
                  ? `No products found for "${searchQuery}"`
                  : "No products match your filters."}
              </p>
              <button 
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Reset Filters
              </button>
            </motion.div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && !isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex justify-center items-center mt-8 space-x-2"
            >
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                Previous
              </button>

              {totalPages <= 5 ? (
                Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        currentPage === page
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )
              ) : (
                <>
                  {currentPage > 2 && (
                    <button
                      onClick={() => handlePageChange(1)}
                      className="px-4 py-2 text-sm font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      1
                    </button>
                  )}
                  
                  {currentPage > 3 && <span className="px-2 text-gray-400">...</span>}
                  
                  {currentPage > 1 && (
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="px-4 py-2 text-sm font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      {currentPage - 1}
                    </button>
                  )}
                  
                  <button
                    className="px-4 py-2 text-sm font-medium rounded-md bg-green-500 text-white"
                  >
                    {currentPage}
                  </button>
                  
                  {currentPage < totalPages && (
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="px-4 py-2 text-sm font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      {currentPage + 1}
                    </button>
                  )}
                  
                  {currentPage < totalPages - 2 && <span className="px-2 text-gray-400">...</span>}
                  
                  {currentPage < totalPages - 1 && (
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className="px-4 py-2 text-sm font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      {totalPages}
                    </button>
                  )}
                </>
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                Next
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;