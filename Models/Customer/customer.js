const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({

    profilPic: {
        type: String,
        default: null,
    },
    name: {
        type: String,
        required: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    location: {
        country: String,
        address: String,
        city: String,
    },


}
    ,
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Customer", customerSchema);