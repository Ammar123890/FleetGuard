const shipmentModel = require('../Models/Customer/shipment');

/**
 * @description This function is used to get the most upcoming shipment details of a truck
 * @route GET /api/shipment/upcoming/:truckId
 * @param {string} truckId
 * @returns {object} shipment
 * @access public
 */

module.exports.getShipment = async (req, res) => {
    try {
        const truckId = req.params.truckId;

        // Find the shipment that is most upcoming (next to occur in the future) for the given truck
        const shipment = await shipmentModel.findOne({
            truck: truckId,
            shipmentStatus: "pending", 
            shipmentPickDate: { $gte: new Date() } // Ensure the pick date is in the future
        })
        .select('shipmentDestination shipmentOrigin _id shipmentPickDate')
        .sort({ shipmentPickDate: 1 }); // Sort by the earliest pick date that hasn't occurred yet

        if (!shipment) {
            return res.status(404).json({ msg: "No upcoming shipment found for the specified truck." });
        }

        res.json({
            data: shipment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

/**
 * @description This function is used t0 start the shipment
 * @route PUT /api/shipment/start/:shipmentId
 * @param {string} shipmentId
 */

module.exports.startShipment = async (req, res) => {
    try {
        const shipmentId = req.params.shipmentId;

        // Find the shipment by ID
        const shipment = await shipmentModel.findById(shipmentId);

        if (!shipment) {
            return res.status(404).json({ msg: "Shipment not found." });
        }

        // Check if the shipment status is "pending"
        if (shipment.shipmentStatus !== "pending") {
            return res.status(400).json({ msg: "Shipment has already started or been delivered." });
        }

        // Update the shipment status to "in transit"
        shipment.shipmentStatus = "in transit";
        await shipment.save();

        res.json({
            msg: "Shipment started successfully."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}