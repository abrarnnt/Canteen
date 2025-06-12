const User = require("../models/userMasterModel");

// Get all users
exports.getAllUsers = async (req, res) => {
  const users = await User.find()
    .sort({ createdAt: -1 })
    .lean();
  res.json(users);
};

// Create a user
exports.createUser = async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
};

// Update a user
exports.updateUser = async (req, res) => {
  const updated = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  ).lean();
  
  if (!updated) {
    return res.status(404).json({ message: "User not found" });
  }
  
  res.json(updated);
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(400).json({ error: "Delete failed", message: err.message });
  }
};
