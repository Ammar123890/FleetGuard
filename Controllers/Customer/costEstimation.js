const truckCostEstimationModel = require('../../Models/Customer/costEstimation')
const userModel = require('../../Models/user');


/**
 * @description This function is used to get the cost estimation details of a truck
 * @route GET /api/cost-estimation
 * @query {string} truckType (2-3 Axle, 4-5 Axle, 6 Axle)
 * @returns {object} costEstimation
 * @access private (customer)
 */
module.exports.getCostEstimation = async (req, res) => {
    try {
        const truckType = req.query.truckType;
        const userId = req.user._id; // Set from authentication middleware

        // Check for valid truckType
        const validTruckTypes = ['2-3 Axle', '4-5 Axle', '6 Axle'];
        if (!validTruckTypes.includes(truckType)) {
            return res.status(400).json({ msg: "Invalid truck type provided." });
        }

        // Find the user to get their costEstimation references
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found." });
        }

        // Find the cost estimation for the given truck type
        const costEstimation = await truckCostEstimationModel.findOne({
            _id: { $in: user.costEstimation },
            truckType: truckType
        });

        if (!costEstimation) {
            return res.status(404).json({ msg: "Cost estimation for the specified truck type not found." });
        }

        res.json(costEstimation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


/**
 * @description This function is used to update the cost estimation details of a truck 
 * @route PUT /api/cost-estimation/:type
 * @param {string} type (2-3 Axle, 4-5 Axle, 6 Axle)
 * @access private (customer)
 */

module.exports.updateCostEstimation = async (req, res) => {
    try {
        const truckType = req.params.type;
        const userId = req.user._id; // Set from authentication middleware

        // Check for valid truckType
        const validTruckTypes = ['2-3 Axle', '4-5 Axle', '6 Axle'];
        if (!validTruckTypes.includes(truckType)) {
            return res.status(400).json({ msg: "Invalid truck type provided." });
        }

        // Find the user to get their costEstimation references
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found." });
        }

        // Find the cost estimation for the given truck type
        const costEstimation = await truckCostEstimationModel.findOne({
            _id: { $in: user.costEstimation },
            truckType: truckType
        });

        if (!costEstimation) {
            return res.status(404).json({ msg: "Cost estimation for the specified truck type not found." });
        }

        // Update the cost estimation
        const updatedCostEstimation = await truckCostEstimationModel.findByIdAndUpdate(costEstimation._id, req.body, { new: true });

        res.json(updatedCostEstimation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
