const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    truck: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Truck',
        required: true
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: true
    },
    shipmentType: {
        type: String,
        required: true
    },
    shipmentWeight: {
        type: Number,
        required: true
    },
    shipmentArea: {
        type: Number,
        required: true
    },
    shipmentDescription: {
        type: String,
        required: true
    },
    shipmentStatus: {
        type: String,
        required: true,
        enum: ['pending', 'in transit', 'delivered'],
        default: 'pending'
    },
    shipmentPickDate: {
        type: Date,
        required: true
    },
    shipmentDeliveryDate: {
        type: Date,
        required: true
    },

    shipmentDestination: {
        location: {
            type: String,
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    shipmentOrigin: {
        location: {
            type: String,
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    shipmentCost: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['cash', 'card'],
        default: 'cash'
    },
    sender: {
        name: {
            type: String,
            required: true
        },
        phone: {
            type: Number,
            required: true
        },
    },
    receiver: {
        name: {
            type: String,
            required: true
        },
        phone: {
            type: Number,
            required: true
        },
    }    
});

module.exports = mongoose.model('shipment', shipmentSchema);