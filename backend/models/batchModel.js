const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    batch_name: {
        type: String,
        required: [true, 'Batch name is required'],
        trim: true,
        unique: true
    },
    year: {
        type: Number,
        required: [true, 'Year is required'],
        min: [2000, 'Year cannot be less than 2000'],
        max: [2100, 'Year cannot be greater than 2100']
    },
    place_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
        required: [true, 'Place is required']
    },
    location_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: [true, 'Location is required']
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    modified_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'modified_at'
    }
});

// Create indexes
batchSchema.index({ batch_name: 1 });
batchSchema.index({ place_id: 1 });
batchSchema.index({ location_id: 1 });
batchSchema.index({ status: 1 });

const Batch = mongoose.model('Batch', batchSchema);

module.exports = Batch;
