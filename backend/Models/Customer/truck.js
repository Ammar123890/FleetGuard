const mongoose  = require("mongoose");

const truckSchema = new mongoose.Schema({
    truckNumber: { type: String, required: true },
    make : { type: String, required: true },
    year : { type: String, required: true },
    type: { type: String, required: true, enum : ["4-5 Axle", "6 Axle", "2-3 Axle"]},
    registration : { type: String, required: true },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
    },
    weightCapacity: { type: Number, required: true },
    areaCapacity: { type: Number, required: true },

    bookings: [{
        pickupDate: Date,
        deliveryDate: Date
    }],
    availability: {
        type: Boolean,
        default: true,
    },
    assignedDashcam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dashcam",
        default: null,
    },
});

module.exports = mongoose.model("Truck", truckSchema);