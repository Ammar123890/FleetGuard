const mongoose = require("mongoose");

const dashcamSchema = new mongoose.Schema({
    serialNumber: { type: String, required: true },
    lastConnected: Date,
    lastDisconnected: Date,
    status:
    {
        type: Boolean,
        required: true,
        default: false,
    },
    price: { type: Number, required: true },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        default: null,
    },
    passcode: {
        type: String,
        required: true,
        select: false
    },
    package: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Package",
        default: null,
    },
});

module.exports = mongoose.model("Dashcam", dashcamSchema);