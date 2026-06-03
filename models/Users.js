const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullname: { 
        type: String, 
        required: true, 
        trim: true 
    },
    username: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true,
        lowercase: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    nin: { 
        type: String, 
        required: true,
        unique: true,
        minlength: 16,
        maxlength: 16,
        uppercase: true
    },
    email: { 
        type: String, 
        required: true,
        unique: true 
    },
    phone: { 
        type: String, 
        required: true,
        match: [/^\d{10}$/, "Please enter a valid 10-digit Ugandan phone number (e.g., 0701234567)"]
    },
    role: { 
        type: String, 
        required: true,
        enum: ['admin', 'manager', 'attendant'], 
        default: 'attendant'
    },
    branch: { 
        type: String, 
        required: true,
        enum: ['Entebbe', 'Vvumba'], 
        default: 'Entebbe'
    },
    status: {
        type: String,
        enum: ['active', 'suspended'],
        default: 'active'
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model("User", userSchema);