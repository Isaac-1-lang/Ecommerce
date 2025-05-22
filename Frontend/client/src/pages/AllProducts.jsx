import React, { useEffect, useState, useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import { LayoutGrid, List, ChevronDown, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigation, useRouteLoaderData } from "react-router-dom";
import Loader from "../components/Loader";

const AllProducts = () => {
  // State Management
  const { products, searchQuery, setProducts } = useAppContext();
  const initialProducts = useRouteLoaderData("products");
  const navigation = useNavigation();
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [productsPerPage] = useState(10);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Show loader during initial route loading
  if (navigation.state === "loading") {
    return <Loader />;
  }

  // Set initial products
  useEffect(() => {
    if (initialProducts) {
      setIsLocalLoading(false);
    }
  }, [initialProducts]);

  // Extract unique categories
  useEffect(() => {
    if (products.length > 0) {
      const uniqueCategories = [...new Set(products.map(p => p.category))];
      setCategories(uniqueCategories);
    }
  }, [products]);

  // Filter and sort products
  useEffect(() => {
    setIsLocalLoading(true);
    
    let updatedProducts = [...products]
      .filter(p => p.inStock)
      .filter(p => 
        searchQuery ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
      )
      .filter(p => 
        selectedCategories.length > 0 
          ? selectedCategories.includes(p.category) 
          : true
      )
      .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sorting logic
    switch (sortOption) {
      case "name-asc": updatedProducts.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "name-desc": updatedProducts.sort((a, b) => b.name.localeCompare(a.name)); break;
      case "price-asc": updatedProducts.sort((a, b) => a.price - b.price); break;
      case "price-desc": updatedProducts.sort((a, b) => b.price - a.price); break;
      case "rating-desc": updatedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      default: break;
    }

    const timer = setTimeout(() => {
      setFilteredProducts(updatedProducts);
      setCurrentPage(1);
      setIsLocalLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [products, searchQuery, sortOption, selectedCategories, priceRange]);

  // Memoized values
  const inStockCount = useMemo(() => (
    filteredProducts.filter(p => p.inStock).length
  ), [filteredProducts]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = useMemo(() => (
    filteredProducts.slice(
      (currentPage - 1) * productsPerPage,
      currentPage * productsPerPage
    )
  ), [filteredProducts, currentPage, productsPerPage]);

  // Handlers
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handlePriceRangeChange = (index, value) => {
    const newValue = Math.min(Math.max(Number(value), 0), 1000);
    const newRange = [...priceRange];
    newRange[index] = newValue;
    if (newRange[0] > newRange[1]) {
      newRange[index] = index === 0 ? Math.min(newRange[1], 1000) : Math.max(newRange[0], 0);
    }
    setPriceRange(newRange);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
    setSortOption("default");
  };

  return (
    <>
      <div className="container mx-auto">
        <div className="mt-16 px-6 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">All Products</h1>
              <p className="text-gray-600">{inStockCount} products available</p>
            </div>
            
            {/* Controls */}
            <div className="flex gap-2 mt-2 sm:mt-0">
              <div className="flex bg-gray-100 rounded-md shadow-sm h-4 justify-center items-center relative top-5">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-1 py-0 text-xs h-6 flex items-center justify-center  ${viewMode === "grid" ? "bg-green-500 text-white" : ""}`}
                >
                  <LayoutGrid size={12} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-1 py-0 text-xs h-6 flex items-center justify-center ${viewMode === "list" ? "bg-green-500 text-white" : ""}`}
                >
                  <List size={12} />
                </button>
              </div>
              
              <button 
                onClick={() => setIsFilterMenuOpen(true)}
                className="md:hidden flex items-center gap-1 px-1 py-0.5 bg-white border rounded-md text-xs "
              >
                <Filter size={13} />
                Filters
              </button>
              
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="pl-3 pr-8 py-0 border rounded-md text-xs h-8 relative top-3 bg-gray-100"
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

          {/* Main Content */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Desktop Filters */}
            <div className="hidden md:block w-64 bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between mb-4">
                <h3 className="font-semibold">Filters</h3>
                <button onClick={resetFilters} className="text-green-600 text-sm">
                  Reset all
                </button>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium mb-2">Categories</h4>
                {categories.map(category => (
                  <div key={category} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="w-4 h-4 text-green-600 rounded"
                    />
                    <label className="ml-2 text-sm">{category}</label>
                  </div>
                ))}
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Price Range</h4>
                <div className="mb-4">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                    className="w-full mb-2"
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                    className="w-full"
                  />
                  <div className="flex gap-2 mt-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                      className="w-full p-2 border rounded"
                      min="0"
                      max={priceRange[1]}
                    />
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                      className="w-full p-2 border rounded"
                      min={priceRange[0]}
                      max="1000"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Filters */}
            <AnimatePresence>
              {isFilterMenuOpen && (
                <>
                  <motion.div
                    initial={{ x: -300 }}
                    animate={{ x: 0 }}
                    exit={{ x: -300 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed top-0 left-0 bottom-0 w-80 bg-white z-50 p-4 overflow-y-auto"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold">Filters</h3>
                      <button onClick={() => setIsFilterMenuOpen(false)}>
                        <X size={20} />
                      </button>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="font-medium mb-2">Categories</h4>
                      {categories.map(category => (
                        <div key={category} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category)}
                            onChange={() => handleCategoryToggle(category)}
                            className="w-4 h-4 text-green-600 rounded"
                          />
                          <label className="ml-2 text-sm">{category}</label>
                        </div>
                      ))}
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Price Range</h4>
                      <div className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span>${priceRange[0]}</span>
                          <span>${priceRange[1]}</span>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="range"
                            min="0"
                            max="1000"
                            value={priceRange[0]}
                            onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                            className="w-full"
                          />
                          <input
                            type="range"
                            min="0"
                            max="1000"
                            value={priceRange[1]}
                            onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black z-40"
                    onClick={() => setIsFilterMenuOpen(false)}
                  />
                </>
              )}
            </AnimatePresence>

            {/* Products */}
            <div className="flex-1">
              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <motion.div
                  layout
                  className={viewMode === "grid" 
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                    : "flex flex-col gap-4"
                  }
                >
                  <AnimatePresence>
                    {currentProducts.map(product => (
                      <motion.div
                        key={`product-${product._id}`}
                        layoutId={`product-${product._id}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ProductCard product={product} viewMode={viewMode} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {searchQuery ? `No results for "${searchQuery}"` : "No products found"}
                  </p>
                  <button 
                    onClick={resetFilters}
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md"
                  >
                    Reset Filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-100 rounded-md disabled:opacity-50"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    const page = currentPage <= 3 
                      ? i + 1 
                      : currentPage >= totalPages - 2 
                        ? totalPages - 4 + i 
                        : currentPage - 2 + i;
                    
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-md ${
                          currentPage === page ? "bg-green-500 text-white" : "bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-100 rounded-md disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllProducts;