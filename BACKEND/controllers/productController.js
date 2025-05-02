const Product = require("../models/Product");

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      image: req.files ? req.files.map(file => file.path) : []
    });
    
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all products with filtering, sorting and pagination
exports.getAllProducts = async (req, res) => {
  try {
    const { category, search, sort, limit = 10, page = 1 } = req.query;
    
    // Build query
    let query = {};
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }
    
    // Sort options
    let sortOption = {};
    if (sort) {
      switch (sort) {
        case "price_asc":
          sortOption = { offerPrice: 1 };
          break;
        case "price_desc":
          sortOption = { offerPrice: -1 };
          break;
        case "newest":
          sortOption = { createdAt: -1 };
          break;
        case "rating":
          sortOption = { rating: -1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
    } else {
      sortOption = { createdAt: -1 };
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query
    const products = await Product.find(query)
      .sort(sortOption)
      .limit(parseInt(limit))
      .skip(skip);
    
    // Get total count for pagination
    const total = await Product.countDocuments(query);
    
    res.json({
      products,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get best sellers
exports.getBestSellers = async (req, res) => {
  try {
    const products = await Product.find({ isBestSeller: true }).limit(8);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get new arrivals
exports.getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({ isNewArrival: true }).limit(8);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get products on sale
exports.getProductsOnSale = async (req, res) => {
  try {
    const products = await Product.find({ isOnSale: true }).limit(8);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // If new images are uploaded, add them to the existing ones
    if (req.files && req.files.length > 0) {
      updateData.image = req.files.map(file => file.path);
    }
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}; 