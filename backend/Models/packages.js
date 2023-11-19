const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    packageName: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    validity: {
        type: String,
        required: true,
        enum: ['per month', 'per year']
    },
    // max hours of use in a day
    maxActivity: {
        type: Number,
        required: true,
        min: 0 
    }
});

const Package = mongoose.model('Package', packageSchema);

module.exports = Package; 
