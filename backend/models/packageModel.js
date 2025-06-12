const mongoose = require("mongoose");


const packageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Package name is required'],
        trim: true,
        unique: true
    },
    place_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Place",
        required: [true, 'Place is required']
    },
    location_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
        required: [true, 'Location is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    description: {
        type: String,
        trim: true
    },
    is_fixed_validity: {
        type: Boolean,
        default: false
    },
    validity_days: {
        type: Number,
        required: [true, 'Validity days is required'],
        min: [1, 'Validity days must be at least 1']
    },
    validity_date: {
        type: Date,
        required: [true, 'Validity date is required']
    },
    timeline_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Timeline is required']
    },
    timezone_id: {
        type: String,
        required: [true, 'Timezone is required']
    },
    status: {
        type: String,
        enum: {
            values: ["active", "inactive"],
            message: 'Status must be either active or inactive'
        },
        default: "active"
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    modified_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { 
    timestamps: { 
        createdAt: 'created_at',
        updatedAt: 'modified_at'
    } 
});

module.exports = mongoose.model("Package", packageSchema);