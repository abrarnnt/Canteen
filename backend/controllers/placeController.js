const Place = require('../models/placeModel');
const mongoose = require('mongoose');

// Get all places
exports.getAllPlaces = async (req, res) => {
    const places = await Place.find()
        .populate('created_by', 'name')
        .populate('modified_by', 'name')
        .sort({ created_at: -1 })
        .lean();

    // Sort active places first
    places.sort((a, b) => {
        if (a.status === 'active' && b.status !== 'active') return -1;
        if (a.status !== 'active' && b.status === 'active') return 1;
        return 0;
    });

    res.json(places);
};

// Get place by ID
exports.getPlaceById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid place ID' });
    }

    const place = await Place.findById(id)
        .populate('created_by', 'name')
        .populate('modified_by', 'name')
        .lean();

    if (!place) {
        return res.status(404).json({ message: 'Place not found' });
    }

    res.json(place);
};

// Create place
exports.createPlace = async (req, res) => {
    const { name, description, gst_no, fssai_no, pan_no, status } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Place name is required' });
    }

    // Validate GST number if provided
    if (gst_no && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst_no)) {
        return res.status(400).json({ message: 'Invalid GST number format' });
    }

    // Validate FSSAI number if provided
    if (fssai_no && !/^[0-9]{14}$/.test(fssai_no)) {
        return res.status(400).json({ message: 'Invalid FSSAI number format' });
    }

    // Validate PAN number if provided
    if (pan_no && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan_no)) {
        return res.status(400).json({ message: 'Invalid PAN number format' });
    }

    const place = await Place.create({
        ...req.body,
        created_by: req.user._id,
        modified_by: req.user._id
    });

    const populatedPlace = await Place.findById(place._id)
        .populate('created_by', 'name')
        .populate('modified_by', 'name')
        .lean();

    res.status(201).json(populatedPlace);
};

// Update place
exports.updatePlace = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid place ID' });
    }

    const place = await Place.findById(id);
    if (!place) {
        return res.status(404).json({ message: 'Place not found' });
    }

    // Validate GST number if provided
    if (req.body.gst_no && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(req.body.gst_no)) {
        return res.status(400).json({ message: 'Invalid GST number format' });
    }

    // Validate FSSAI number if provided
    if (req.body.fssai_no && !/^[0-9]{14}$/.test(req.body.fssai_no)) {
        return res.status(400).json({ message: 'Invalid FSSAI number format' });
    }

    // Validate PAN number if provided
    if (req.body.pan_no && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(req.body.pan_no)) {
        return res.status(400).json({ message: 'Invalid PAN number format' });
    }

    const updatedPlace = await Place.findByIdAndUpdate(
        id,
        {
            ...req.body,
            modified_by: req.user._id,
            modified_at: new Date()
        },
        { new: true }
    )
    .populate('created_by', 'name')
    .populate('modified_by', 'name')
    .lean();

    res.json(updatedPlace);
};

// Delete place
exports.deletePlace = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid place ID' });
    }

    const place = await Place.findById(id);
    if (!place) {
        return res.status(404).json({ message: 'Place not found' });
    }

    await Place.findByIdAndDelete(id);
    res.json({ message: 'Place deleted successfully' });
};
