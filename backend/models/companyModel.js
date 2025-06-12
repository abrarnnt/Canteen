const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },    
    password: {
        type: String,
        required: function() {
            return this.isNew; 
        },
    },
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    isSuperAdmin: {
        type: Boolean,
        default: false,
    },    
    logo: {
        type: String,  
        default: null
    },    
    contactNumber: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});



module.exports = mongoose.model("Company", companySchema);


