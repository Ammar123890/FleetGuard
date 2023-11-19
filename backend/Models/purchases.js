const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
    dashcam: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dashcam",
        default: null,
    }],
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Purchase", purchaseSchema);