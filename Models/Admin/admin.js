const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        enum: ['admin', 'manager', 'customer support']
    },
});

module.exports = mongoose.model("Admin", adminSchema);