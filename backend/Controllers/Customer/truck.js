const truckModel = require('../../Models/Customer/truck');
const { ValidateTruck } = require('../../Schemas/truck');

/**
 * @description Add a new truck 
 * @route POST /api/customer/truck/add
 * @access Customer
 */

module.exports.addTruck = async (req, res) => {
    const { error } =  ValidateTruck(req.body);
    if (error) {
        return res.status(400).json({ errors: error });
    }

    //check if truck already exists with same registration number
    const truck = await truckModel.findOne({registration:req.body.registration});
    if(truck){
        return res.status(400).json({ msg: "Truck already exists" });
    }

    //get owner id from token
    const ownerId = req.user.user;

    try {
        const newTruck = new truckModel({
            owner: ownerId,
            ...req.body
        });
        await newTruck.save();
        return res.status(200).json({
            msg: "Truck added",
            status: true,
        });
    } catch (error) {
        return res.status(500).json({ errors: error });
    }
}

/**
 * @description Get all owned trucks
 * @route GET /api/customer/truck/get
 * @access Customer
 */

module.exports.getTrucks = async (req, res) => {
    try {
        const trucks = await truckModel.find({ owner: req.user.user });
        return res.status(200).json({
            trucks,
            status: true,
        });
    } catch (error) {
        return res.status(500).json({ errors: error });
    }
}

/**
 * @description Edit a truck
 * @route PUT /api/customer/truck/edit/:id
 * @access Customer
 */

module.exports.editTruck = async (req, res) => {
    const { error } = ValidateTruck(req.body);
    if (error) {
        return res.status(400).json({ errors: error.details });
    }

    try {
        const truck = await truckModel.findOne({ _id: req.params.id, owner: req.user.user });
        if (!truck) {
            return res.status(404).json({ msg: "Truck not found or not owned by user", status: false });
        }

        // Update the truck with the new data
        Object.assign(truck, req.body);
        await truck.save();

        return res.status(200).json({
            msg: "Truck updated successfully",
            truck,
            status: true
        });

    } catch (error) {
        console.error("Edit Truck Error:", error);
        return res.status(500).json({ errors: error.message });
    }
};



/**
 * @description Get all available trucks
 * @route GET /api/customer/truck/available
 * @access Customer
 */

module.exports.getAvailableTrucks = async (req, res) => {
    const { shipmentWeight, shipmentArea, shipmentPickDate, shipmentDeliveryDate } = req.body;

    // Parse the string dates to Date objects
    const parsedShipmentPickDate = new Date(shipmentPickDate);
    const parsedShipmentDeliveryDate = new Date(shipmentDeliveryDate);

    try {
        // Find trucks that have the required capacity and are not booked during the given time frame
        const availableTrucks = await truckModel.find({
            weightCapacity: { $gte: shipmentWeight },
            areaCapacity: { $gte: shipmentArea },
            bookings: {
                $not: {
                    $elemMatch: {
                        pickupDate: { $lt: parsedShipmentDeliveryDate },
                        deliveryDate: { $gt: parsedShipmentPickDate }
                    }
                }
            }
        });

        return res.status(200).json({ availableTrucks });
    } catch (error) {
        // Log the error for debugging
        console.error('Error fetching available trucks:', error);
        return res.status(500).json({ errors: error.message });
    }
};

/**
 * @description Get truck by id in params
 * @route GET /api/customer/truck/get/:id
 * @access Customer
 */

module.exports.getTruck = async (req, res) => {
    try {
        const truck = await truckModel.findById(req.params.id);
        if (!truck) {
            return res.status(400).json({ msg: "Truck not found" });
        }

        if (truck.owner.toString() != req.user.user.toString()) {
            return res.status(400).json({ msg: "Truck not owned by user" });
        }

        return res.status(200).json({
            truck,
            status: true,
        });
    } catch (error) {
        return res.status(500).json({ errors: error });
    }
}










