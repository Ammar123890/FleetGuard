const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
    },
    licenseNumber: {
        type: String,
        required: true,
    },
    licenseExpiry: {
        type: Date,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    experience: {
        type: Number,
        required: true,
    },
    bookings: [{
        pickupDate: Date,
        deliveryDate: Date
    }],
    availability: {
        type: Boolean,
        default: true,
    },
    scores: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DriverScore'
    }]
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Driver", driverSchema);