const mongoose = require("mongoose");

const userModelSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    middleName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    userType: {
        type: String,
        required: true,
        trim: true
    },
    uniqueNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    bloodGroup: {
        type: String,
        trim: true
    },
    uniqueId: {
        type: String,
        required: true,
        unique: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    remarks: {
        type: String,
        required: false,
    },
    photo: {
        type: String,
        default: "https://via.placeholder.com/150",
    },
    address: {
        type: String,
        required: true,
    },
    address2: {
        type: String,
        required: false,
    },
    state: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    mobileNo:{
        type: String,
        required: true,
    },    
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    }
}, { timestamps: true });

module.exports = mongoose.model("UserMaster", userModelSchema);