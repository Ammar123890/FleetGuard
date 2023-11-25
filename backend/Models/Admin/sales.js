const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema({
    dashcam: {
        type: String,
        required: true
    },
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
    quantity: {
        type: Number,
        required: true,
    }
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Sales", salesSchema);