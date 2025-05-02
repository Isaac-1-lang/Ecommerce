const Address = require('../models/Address');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateAddress = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('street').trim().notEmpty().withMessage('Street is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('zipCode').trim().notEmpty().withMessage('Zip code is required'),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
];

// Create address
exports.createAddress = [
  ...validateAddress,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const address = new Address({
        ...req.body,
        user: req.user.userId,
      });
      await address.save();
      res.status(201).json(address);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },
];

// Get all addresses for a user
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.userId });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update address
exports.updateAddress = [
  ...validateAddress,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const address = await Address.findOneAndUpdate(
        { _id: req.params.id, user: req.user.userId },
        { $set: req.body },
        { new: true }
      );
      if (!address) {
        return res.status(404).json({ message: 'Address not found' });
      }
      res.json(address);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  },
];

// Delete address
exports.deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.json({ message: 'Address deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};