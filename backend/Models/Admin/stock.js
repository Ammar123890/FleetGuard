const mongoose = require("mongoose");

const stock = new mongoose.Schema({
    model: { type: String, required: true },
    pricePerMonth: { type: Number, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    description: { type: String, required: true },
});

module.exports = mongoose.model("Stock", stock);