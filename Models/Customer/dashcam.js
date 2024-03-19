const mongoose = require("mongoose");

const dashcamSchema = new mongoose.Schema({
    serialNumber: { type: String, required: true, unique: true },
    model: { type: String, required: true },
    status: {
        type: Boolean,
        required: true,
        default: false,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        default: null,
    },
    dateOfPurchase: {
        type: Date,
        required: true,
    },
    pricePerMonth: {
        type: Number,
        required: true,
    },
},
    {
        timestamps: true,
    }
    );

module.exports = mongoose.model("Dashcam", dashcamSchema);
