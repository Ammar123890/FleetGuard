const shipmentModel = require('../../Models/Customer/shipment');
const truckModel = require('../../Models/Customer/truck');
const driverModel = require('../../Models/Customer/driver');
const { ValidateShipment } = require('../../Schemas/shipment');
const scoreModel = require('../../Models/Customer/score');
const mongoose = require('mongoose');



/**
 * @description Add a new shipment
 * @route POST /api/customer/shipment/add
 * @access Customer
 */

module.exports.addShipment = async (req, res) => {
    const { error } = ValidateShipment(req.body);
    if (error) {
        return res.status(400).json({ errors: error });
    }

    const ownerId = req.user.user;
    try {
        const newShipment = new shipmentModel({
            owner: ownerId,
            ...req.body
        });

        await newShipment.save();

        // Update Truck and Driver bookings
        const { truck, driver, shipmentPickDate, shipmentDeliveryDate } = req.body;

        await truckModel.findByIdAndUpdate(truck, {
            $push: { bookings: { pickupDate: shipmentPickDate, deliveryDate: shipmentDeliveryDate } }
        });

        await driverModel.findByIdAndUpdate(driver, {
            $push: { bookings: { pickupDate: shipmentPickDate, deliveryDate: shipmentDeliveryDate } }
        });

        return res.status(200).json({
            msg: "Shipment added and resources updated",
            status: true,
        });
    } catch (error) {
        return res.status(500).json({ errors: error });
    }
};

/**
 * @description Get all owned shipments
 * @route GET /api/customer/shipment/get
 * @access Customer
 */

module.exports.getShipments = async (req, res) => {
    try {
        const shipments = await shipmentModel.find({ owner: req.user.user });
        return res.status(200).json({
            shipments,
            status: true,
        });
    } catch (error) {
        return res.status(500).json({ errors: error });
    }
}

/**
 * @description Get a shipment by ID 
 * @route GET /api/customer/shipment/get/:id
 * @access Customer
*/

module.exports.getShipment = async (req, res) => {
    try {
        const shipment = await shipmentModel.findById(req.params.id);
        if (!shipment) {
            return res.status(404).json({ msg: "Shipment not found" });
        }

        if (shipment.owner.toString() != req.user.user.toString()) {
            return res.status(401).json({ msg: "Unauthorized" });
        }
        return res.status(200).json({
            shipment,
            status: true,
        });
    } catch (error) {
        return res.status(500).json({ errors: error });
    }
}

/**
 * @description Start a shipment
 * @route PUT /api/customer/shipment/start/:id
 * @access Customer
 */

module.exports.startShipment = async (req, res) => {
    try {
        const shipment = await shipmentModel.findById(req.params.id);
        if (!shipment) {
            return res.status(404).json({ msg: "Shipment not found" });
        }

        //check if the driver and the truck are available (available boolean is true)
        try {
            const truck = await truckModel.findById(shipment.truck);
            if (!truck) return res.status(400).json({ msg: "Truck not found" })
            const driver = await driverModel.findById(shipment.driver);
            if (!driver) return res.status(400).json({ msg: "Driver not found" })


            if (!truck.availability || !driver.availability) {
                return res.status(400).json({ msg: "Truck or driver not available" });
            } else {
                truck.availability = false;
                driver.availability = false;
                await truck.save();
                await driver.save();
            }
        }
        catch (error) {
            return res.status(400).json({ msg: "Truck or driver not available" });
        }


        shipment.shipmentStatus = "in transit";
        shipment.pickupDate = Date.now();
        await shipment.save();

        // Initialize driver score for the shipment
        const initialScore = new scoreModel({
            shipment: shipment._id,
            driver: shipment.driver,
            score: 100, // Initial score
            violations: [], // No violations at the start
            totalViolations: 0,
            totalWeight: 1, // Initial weight
        });
        await initialScore.save();

        return res.status(200).json({
            msg: "Shipment started",
            status: true,
        });
    } catch (error) {
        return res.status(500).json({ errors: error });
    }
}

/**
 * @description End a shipment
 * @route PUT /api/customer/shipment/end/:id
 * @access Customer
 */

module.exports.endShipment = async (req, res) => {
    try {
        const shipment = await shipmentModel.findById(req.params.id);
        if (!shipment) {
            return res.status(404).json({ msg: "Shipment not found" });
        }

        shipment.shipmentStatus = "delivered";
        shipment.deliveryDate = Date.now();
        await shipment.save();

        // Update Truck and Driver bookings -- remove the shipment dates
        const { truck, driver, shipmentPickDate, shipmentDeliveryDate } = shipment;

        await truckModel.findByIdAndUpdate(truck, {
            $pull: { bookings: { pickupDate: shipmentPickDate, deliveryDate: shipmentDeliveryDate } },
            availability: true
        });

        await driverModel.findByIdAndUpdate(driver, {
            $pull: { bookings: { pickupDate: shipmentPickDate, deliveryDate: shipmentDeliveryDate } },
            availability: true
        });
        return res.status(200).json({
            msg: "Shipment ended",
            status: true,
        });
    } catch (error) {
        return res.status(500).json({ errors: error });
    }
}


/**
 * @description Update the score of a shipment for a driver
 * @route PUT /api/customer/shipment/score
 * @access Customer
 */

module.exports.updateScore = async (req, res) => {
    const {
        timestamp,
        shipmentId,
        image,
        acceleration,
        latitude,
        longitude,
        ...violations
    } = req.body; // Destructure the new data format

    // Validate the required fields
    if (!timestamp || !shipmentId) {
        return res.status(400).json({ msg: "Missing required fields" });
    }

    try {
        const driverScore = await scoreModel.findOne({
            shipment: new mongoose.Types.ObjectId(shipmentId),

        });

        if (!driverScore) {
            return res.status(404).json({ msg: "Driver score not found" });
        }

        let hasViolations = false;


        Object.keys(violations).forEach(violationType => {
            if (violations[violationType]) {
                hasViolations = true;
                driverScore.violations.push({
                    type: violationType,
                    timestamp,
                    image,
                    acceleration,
                    latitude,
                    longitude
                });


                //Update the total count of violations
                driverScore.totalViolations += 1;
                //Update the total weight of violations after every 50 violations
                if (driverScore.totalViolations % 50 === 0) {
                    driverScore.totalWeight += 0.1;
                }

                const violationDeduction = driverScore.totalWeight * (0.01 * percentageData[violationType]);
                driverScore.score = Math.max(driverScore.score - violationDeduction, 0);
            }
        });

        if (!hasViolations) {
            return res.status(400).json({ msg: "No violations reported" });
        }

        await driverScore.save();
        return res.status(200).json(driverScore);
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({ msg: "Validation error", errors: error.errors });
        } else if (error instanceof mongoose.Error.CastError) {
            return res.status(400).json({ msg: "Invalid ObjectId format", errors: error.message });
        } else {
            return res.status(500).json({ msg: "An error occurred", errors: error.message });
        }
    }
};


const percentageData = {
    "isSpeedLimitCompliance": 28,
    "isFatigueDetection": 20,
    "isSeatbeltCompliance": 10,
    "calling": 26,
    "texting": 26,
    "radio": 1,
    "hair": 1,
    "talkingPassenger": 15,
    "reachingBehind": 7,
    "mealtimeMotion": 2,
};





