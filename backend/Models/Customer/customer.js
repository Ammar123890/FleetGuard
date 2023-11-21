const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        max: 50,
        unique: true,
        required: true,
        index: true
    },
    password: {
        type: String,
        minlength: [6, "Password must be at least 6 characters"],
        maxlength: [1024, "Password cannot exceed 1024 characters"],
        select: false,
    },
    phone: { type: String, required: true },
    companyName: String,
    companyAddress: String,
    companyEmail: {
        type: String,
        unique: true,
        index: true
    },
    ownedDevices: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Device",
    }],
});