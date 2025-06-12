const AdminUser = require('../models/adminUserModel');
const bcrypt = require('bcryptjs');

// Get all admin users
exports.getAllAdminUsers = async (req, res) => {
  const users = await AdminUser.find()
    .populate('companyId', 'name')
    .populate('locationId', 'locationName')
    .lean();
  res.json(users);
};

// Get single admin user
exports.getAdminUser = async (req, res) => {
  const user = await AdminUser.findById(req.params.id)
    .populate('companyId', 'name')
    .populate('locationId', 'locationName')
    .lean();
  if (!user) {
    return res.status(404).json({ message: 'Admin user not found' });
  }
  res.json(user);
};

// Create admin user
exports.createAdminUser = async (req, res) => {
  const { name, email, phone, password, companyId, locationId } = req.body;

  // Check if user already exists
  const existingUser = await AdminUser.findOne({
    $or: [{ email }, { phone }]
  }).lean();
  
  if (existingUser) {
    return res.status(400).json({
      message: 'User with this email or phone number already exists'
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await AdminUser.create({
    name,
    email,
    phone,
    password: hashedPassword,
    companyId,
    locationId,
    isActive: true
  });

  const populatedUser = await AdminUser.findById(user._id)
    .populate('companyId', 'name')
    .populate('locationId', 'locationName')
    .lean();

  res.status(201).json(populatedUser);
};

// Update admin user
exports.updateAdminUser = async (req, res) => {
  const { name, email, phone, role, companyId, locationId, password } = req.body;
  const userId = req.params.id;

  // Check if email/phone is already in use by another user
  const existingUser = await AdminUser.findOne({
    $or: [{ email }, { phone }],
    _id: { $ne: userId }
  }).lean();

  if (existingUser) {
    return res.status(400).json({
      message: 'Email or phone number is already in use'
    });
  }

  const updateData = {
    name,
    email,
    phone,
    role,
    companyId,
    locationId
  };

  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  const user = await AdminUser.findByIdAndUpdate(
    userId,
    updateData,
    { new: true }
  )
  .populate('companyId', 'name')
  .populate('locationId', 'locationName')
  .lean();

  if (!user) {
    return res.status(404).json({ message: 'Admin user not found' });
  }

  res.json(user);
};

// Delete admin user
exports.deleteAdminUser = async (req, res) => {
  const user = await AdminUser.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'Admin user not found' });
  }
  res.json({ message: 'Admin user deleted successfully' });
};
