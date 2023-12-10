// models/DriverScore.js
const mongoose = require('mongoose');

const violationSchema = new mongoose.Schema({
    type: String,
    count: Number,
    weight: Number,
    timestamp: [Date]

});

const score = new mongoose.Schema({
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
    violations: [violationSchema]
});

module.exports = mongoose.model('Score', score);
