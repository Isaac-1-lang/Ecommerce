const express = require('express');
const router = express.Router();
const {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} = require('../controllers/addressController');
const authMiddleware = require('../middlewares/auth.js');

router.use(authMiddleware); // Protect all address routes

router.post('/', createAddress);
router.get('/', getAddresses);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);

module.exports = router;