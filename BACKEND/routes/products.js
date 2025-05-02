const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware = require("../middlewares/auth");
const upload = require("../middlewares/upload");

// Public routes
router.get("/", productController.getAllProducts);
router.get("/category/:category", productController.getProductsByCategory);
router.get("/best-sellers", productController.getBestSellers);
router.get("/new-arrivals", productController.getNewArrivals);
router.get("/on-sale", productController.getProductsOnSale);
router.get("/:id", productController.getProductById);

// Protected routes (admin only)
router.post("/", 
  authMiddleware, 
  upload.array('images', 5), // Allow up to 5 images
  productController.createProduct
);

router.put("/:id", 
  authMiddleware, 
  upload.array('images', 5),
  productController.updateProduct
);

router.delete("/:id", 
  authMiddleware, 
  productController.deleteProduct
);

module.exports = router;