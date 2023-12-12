const mongoose = require('mongoose');

const violationSchema = new mongoose.Schema({
    type: String,
    timestamp: Date,
    image: String,
    acceleration: Number,
    latitude: Number,
    longitude: Number,  
});

const scoreSchema = new mongoose.Schema({
    shipment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'shipment',
        required: true
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: true
    },
    score: {
        type: Number,
        default: 100
    },
    violations: [violationSchema],
    totalViolations: { type: Number, default: 0 },
    totalWeight: { type: Number, default: 1 },
}, { timestamps: true });

module.exports = mongoose.model('Score', scoreSchema);
