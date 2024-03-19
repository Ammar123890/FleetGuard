const truckModel = require('../../Models/Customer/truck');
const dashcamModel = require('../../Models/Customer/dashcam');
const shipmentModel = require('../../Models/Customer/shipment');
const { ValidateTruck } = require('../../Schemas/truck');


/**
 * @description Add a new truck 
 * @route POST /api/customer/truck/add
 * @access Customer
 */

module.exports.addTruck = async (req, res) => {
    const { error } = ValidateTruck(req.body);
    if (error) {
        return res.status(400).json({ errors: error });
    }

    //check if truck already exists with same registration number
    const truck = await truckModel.findOne({ registration: req.body.registration });
    if (truck) {
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
            data: trucks,
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
            data: truck,
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
    const { shipmentWeight, shipmentArea, shipmentPickDate, shipmentDeliveryDate } = req.query;

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

        return res.status(200).json({ data: availableTrucks });
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
            data: truck,
            status: true,
        });
    } catch (error) {
        return res.status(500).json({ errors: error });
    }
}

/**
 * @description Delete a truck
 * @route DELETE /api/customer/truck/delete/:id
 * @access Customer
 */

module.exports.deleteTruck = async (req, res) => {
    try {
        const truck = await truckModel.findById(req.params.id);
        if (!truck) {
            return res.status(400).json({
                errors: { msg: "Truck not found", status: false },
            });
        }

        if (truck.owner.toString() != req.user.user.toString()) {
            return res.status(400).json({ msg: "Truck not owned by user" });
        }

        // Check if the truck is in shipment where shipment status is in transit 
        const shipment = await shipmentModel.findOne({ truck: req.params.id, shipmentStatus: "in transit" });
        if (shipment) {
            return res.status(400).json({ msg: "Truck is in shipment" });
        }

        await truckModel.deleteOne({ _id: req.params.id });
        return res.status(200).json({
            msg: "Truck deleted",
            status: true,
        });
    } catch (error) {
        return res.status(500).json({ errors: error });
    }
}

/**
 * @description To assign a dashcam to a Truck 
 * @route PUT /api/customer/truck/assigndashcam/:dashcam_id/:truck_id
 * @access Customer
 */

module.exports.assignDashcam = async (req, res) => {
    const { dashcam_id, truck_id } = req.params;

    try {
        const dashcam = await dashcamModel.findById(dashcam_id);
        if (!dashcam) return res.status(404).json({ msg: "Dashcam not found" });

        const truck = await truckModel.findById(truck_id);
        if (!truck) return res.status(404).json({ msg: "Truck not found" });

        // Check if the dashcam is already assigned to a different truck
        const isDashcamAssigned = await truckModel.findOne({ assignedDashcam: dashcam_id });
        if (isDashcamAssigned) return res.status(400).json({ msg: "Dashcam is already assigned to a truck" });

        // Check if the truck already has a dashcam assigned
        if (truck.assignedDashcam) return res.status(400).json({ msg: "Truck already has a dashcam assigned" });

        // Assign dashcam to truck
        truck.assignedDashcam = dashcam._id;
        await truck.save();

        return res.status(200).json({
            msg: "Dashcam assigned to truck successfully",
            status: true,
        });

    } catch (error) {
        console.error("Error in assigning dashcam to truck:", error);
        return res.status(500).json({ msg: "Server error", errors: error.message });
    }
};













