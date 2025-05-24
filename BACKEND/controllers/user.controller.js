const User = require('../models/user.model');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Error fetching user profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, address, phone } = req.body;
    
    // Don't allow updating email or role through this endpoint
    const updateData = {
      name,
      address,
      phone
    };

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Error updating user profile' });
  }
}; 