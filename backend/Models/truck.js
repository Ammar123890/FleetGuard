const mongoose  = require("mongoose");

const truckSchema = new mongoose.Schema({
    truckNumber: { type: String, required: true },
    make : { type: String, required: true },
    year : { type: String, required: true },
    registration : { type: String, required: true },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        default: null,
    },
});

module.exports = mongoose.model("Truck", truckSchema);