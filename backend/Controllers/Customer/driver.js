const driverModel = require('../../Models/Customer/driver');
const shipmentModel = require('../../Models/Customer/shipment');
const { ValidateDriver} = require('../../Schemas/driver');

/**
 * @description Add a new driver
 * @route POST /api/customer/driver/add
 * @access Customer
 */

module.exports.addDriver = async (req, res) => {
    const { error } =ValidateDriver(req.body);
    if (error) {
        return res.status(400).json({ errors: error });
    }

    //check if driver already exists with same license number
    const driver = await driverModel.findOne({licenseNumber:req.body.licenseNumber});
    if(driver){
        return res.status(400).json({ msg: "Driver already exists" });
    }

    //get owner id from token
    const ownerId = req.user.user;

    try {
        const newDriver = new driverModel({
            owner: ownerId,
            ...req.body
        });
        await newDriver.save();
        return res.status(200).json({
            msg: "Driver added",
            status: true,
        });
    } catch (error) {
        return res.status(500).json({ errors: error });
    }
}

/**
 * @description Get all owned drivers
 * @route GET /api/customer/driver/get
 * @access Customer
 */

module.exports.getDrivers = async (req, res) => {
    try {
        const drivers = await driverModel.find({owner:req.user.user});
        return res.status(200).json({
            drivers,
            status: true,
        });
    } catch (error) {
        return res.status(500).json({ errors: error });
    }
}

/**
 * @description Edit a driver
 * @route PUT /api/customer/driver/edit/:id
 * @access Customer
 */

module.exports.editDriver = async (req, res) => {
    const { error } = ValidateDriver(req.body);
    if (error) {
        return res.status(400).json({ errors: error });
    }

    try {
        const driver = await driverModel.findById(req.params.id);
        if (!driver ) {
            return res.status(400).json({ msg: "Driver not found" });
        }

        await driverModel.findByIdAndUpdate(req.params.id, req.body);
        return res.status(200).json({
            msg: "Driver updated",
            status: true,
        });
    } catch (error) {
        return res.status(500).json({ errors: error });
    }
}

/**
 * @description Get available drivers
 * @route GET /api/customer/driver/available
 * @access Customer
 */

module.exports.getAvailableDrivers = async (req, res) => {
    const { shipmentPickDate, shipmentDeliveryDate } = req.query;

    // Parse the string dates to Date objects
    const parsedShipmentPickDate = new Date(shipmentPickDate);
    const parsedShipmentDeliveryDate = new Date(shipmentDeliveryDate);

    try {
        // Find drivers that are not booked during the given time frame
        const availableDrivers = await driverModel.find({
            bookings: {
                $not: {
                    $elemMatch: {
                        pickupDate: { $lt: parsedShipmentDeliveryDate },
                        deliveryDate: { $gt: parsedShipmentPickDate }
                    }
                }
            }
        });

        return res.status(200).json({ availableDrivers });
    } catch (error) {
        // Log the error for debugging
        console.error('Error fetching available drivers:', error);
        return res.status(500).json({ errors: error.message });
    }
};

/**
 * @description Get driver by id in params
 * @route GET /api/customer/driver/get/:id
 * @access Customer
 */

module.exports.getDriver = async (req, res) => {
    try {
        const driver = await driverModel.findById(req.params.id);
        if (!driver) {
            return res.status(400).json({ msg: "Driver not found" });
        }
        if(driver.owner.toString() != req.user.user.toString()){
            return res.status(400).json({ msg: "Driver not found" });
        }
        return res.status(200).json({
            driver,
            status: true,
        });
    } catch (error) {
        return res.status(500).json({ errors: error });
    }
}

/**
 * @description Delete a driver
 * @route DELETE /api/customer/driver/delete/:id
 * @access Customer
 */

module.exports.deleteDriver = async (req, res) => {
    try {
        const driver = await driverModel.findById(req.params.id);
        if (!driver) {
            return res.status(400).json({
                errors: { msg: "Driver not found", status: false },
            });
        }

        //check if the driver is in shipment where status is in transit
        const shipment = await shipmentModel.findOne({ driver: req.params.id, shipmentStatus: "in transit" });
        if (shipment) {
            return res.status(400).json({
                errors: { msg: "Driver is in transit", status: false },
            });
        }

        await driverModel.deleteOne({ _id: req.params.id });
        return res.status(200).json({
            msg: "Driver deleted",
            status: true,
        });
    } catch (error) {
        return res.status(500).json({ errors: error });
    }
}



