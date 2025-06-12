const Package = require("../models/packageModel");
const mongoose = require("mongoose");

// Get all packages with populated references
exports.getAllPackages = async (req, res) => {
    const packages = await Package.find()
        .populate('place_id', 'name')
        .populate('location_id', 'name')
        .populate('created_by', 'name')
        .populate('modified_by', 'name')
        .sort({ created_at: -1 })
        .lean();
    
    // Sort active packages first
    packages.sort((a, b) => {
        if (a.status === 'active' && b.status !== 'active') return -1;
        if (a.status !== 'active' && b.status === 'active') return 1;
        return 0;
    });
    
    res.json(packages);
};

// Get package by ID
exports.getPackageById = async (req, res) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid package ID" });
    }

    const package = await Package.findById(id)
        .populate('place_id', 'name')
        .populate('location_id', 'name')
        .populate('created_by', 'name')
        .populate('modified_by', 'name')
        .lean();

    if (!package) {
        return res.status(404).json({ message: "Package not found" });
    }

    res.json(package);
};

// Create a new package
exports.createPackage = async (req, res) => {
    const {
        name,
        place_id,
        location_id,
        price,
        is_fixed_validity,
        validity_days,
        validity_date,
        timeline_id,
        timezone_id,
        status
    } = req.body;

    if (!name || !place_id || !location_id || !price) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const package = await Package.create({
        ...req.body,
        created_by: req.user._id,
        modified_by: req.user._id
    });

    const populatedPackage = await Package.findById(package._id)
        .populate('place_id', 'name')
        .populate('location_id', 'name')
        .populate('created_by', 'name')
        .populate('modified_by', 'name')
        .lean();

    res.status(201).json(populatedPackage);
};

// Update a package
exports.updatePackage = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid package ID" });
    }

    const package = await Package.findById(id);
    if (!package) {
        return res.status(404).json({ message: "Package not found" });
    }

    const updatedPackage = await Package.findByIdAndUpdate(
        id,
        {
            ...req.body,
            modified_by: req.user._id,
            modified_at: new Date()
        },
        { new: true }
    )
    .populate('place_id', 'name')
    .populate('location_id', 'name')
    .populate('created_by', 'name')
    .populate('modified_by', 'name')
    .lean();

    res.json(updatedPackage);
};

// Delete a package
exports.deletePackage = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid package ID" });
    }

    const package = await Package.findById(id);
    if (!package) {
        return res.status(404).json({ message: "Package not found" });
    }

    await Package.findByIdAndDelete(id);
    res.json({ message: "Package deleted successfully" });
};
