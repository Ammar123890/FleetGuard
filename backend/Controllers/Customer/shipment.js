const shipmentModel = require('../../Models/Customer/shipment');
const truckModel = require('../../Models/Customer/truck');
const driverModel = require('../../Models/Customer/driver');
const { ValidateShipment } = require('../../Schemas/shipment');



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
        try{
            const truck = await truckModel.findById(shipment.truck);
            const driver = await driverModel.findById(shipment.driver);
            if(!truck.availability || !driver.availability){
                return res.status(400).json({ msg: "Truck or driver not available" });
            }else{
                truck.availability = false;
                driver.availability = false;
                await truck.save();
                await driver.save();
            }
        }
        catch(error){
            return res.status(400).json({ msg: "Truck or driver not available" });
        }


        shipment.status = "In Transit";
        shipment.pickupDate = Date.now();


        await shipment.save();

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


