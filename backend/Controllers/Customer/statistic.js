const truckModel = require('../../Models/Customer/truck');
const dashcamModel = require('../../Models/Customer/dashcam');
const shipmentModel = require('../../Models/Customer/shipment');

/**
 * @description To get the statistics of the customer
 * @route GET /api/customer/statistics/get
 * @access Customer
 */

module.exports.getStatistics = async (req, res) => {

    // this function will return the total number of trucks, dashcams and shipments and the revenue generated by the shipments
    try {
        const totalTrucks = await truckModel.countDocuments({ owner: req.user.user });
        const totalDashcams = await dashcamModel.countDocuments({ assignedTo: req.user._id });
        const totalShipments = await shipmentModel.countDocuments({ owner: req.user.user });
        const totalRevenue = await shipmentModel.aggregate([
            { $match: { owner: req.user.user } },
            { $group: { _id: null, total: { $sum: "$shipmentCost" } } }
        ]);

        const response = {
            totalTrucks,
            totalDashcams,
            totalShipments,
            totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching statistics:", error);
        res.status(500).json({ message: "Error fetching statistics." });
    }

   
}
