const Batch = require('../models/batchModel');
const mongoose = require('mongoose');

// Get all batches
exports.getAllBatches = async (req, res) => {
    const batches = await Batch.find()
        .populate('place_id', 'name')
        .populate('location_id', 'locationName')
        .populate('created_by', 'name')
        .populate('modified_by', 'name')
        .sort({ created_at: -1 })
        .lean();

    // Sort active batches first
    batches.sort((a, b) => {
        if (a.status === 'active' && b.status !== 'active') return -1;
        if (a.status !== 'active' && b.status === 'active') return 1;
        return 0;
    });

    res.json(batches);
};

// Get batch by ID
exports.getBatchById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid batch ID' });
    }

    const batch = await Batch.findById(id)
        .populate('place_id', 'name')
        .populate('location_id', 'locationName')
        .populate('created_by', 'name')
        .populate('modified_by', 'name')
        .lean();

    if (!batch) {
        return res.status(404).json({ message: 'Batch not found' });
    }

    res.json(batch);
};

// Create batch
exports.createBatch = async (req, res) => {
    const {
        batch_name,
        year,
        place_id,
        location_id,
        description,
        status
    } = req.body;

    if (!batch_name || !year || !place_id || !location_id) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const batch = await Batch.create({
        ...req.body,
        created_by: req.user._id,
        modified_by: req.user._id
    });

    const populatedBatch = await Batch.findById(batch._id)
        .populate('place_id', 'name')
        .populate('location_id', 'locationName')
        .populate('created_by', 'name')
        .populate('modified_by', 'name')
        .lean();

    res.status(201).json(populatedBatch);
};

// Update batch
exports.updateBatch = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid batch ID' });
    }

    const batch = await Batch.findById(id);
    if (!batch) {
        return res.status(404).json({ message: 'Batch not found' });
    }

    const updatedBatch = await Batch.findByIdAndUpdate(
        id,
        {
            ...req.body,
            modified_by: req.user._id,
            modified_at: new Date()
        },
        { new: true }
    )
    .populate('place_id', 'name')
    .populate('location_id', 'locationName')
    .populate('created_by', 'name')
    .populate('modified_by', 'name')
    .lean();

    res.json(updatedBatch);
};

// Delete batch
exports.deleteBatch = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid batch ID' });
    }

    const batch = await Batch.findById(id);
    if (!batch) {
        return res.status(404).json({ message: 'Batch not found' });
    }

    await Batch.findByIdAndDelete(id);
    res.json({ message: 'Batch deleted successfully' });
};
