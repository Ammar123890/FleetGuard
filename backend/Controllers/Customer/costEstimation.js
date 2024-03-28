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

        res.json({
            data: costEstimation
        });
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

        res.json({
            data:updatedCostEstimation,
            message: "Cost estimation updated successfully."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

/**
 * @description This function is used to estimate the cost of a shipment based on the truck type and distance
 * @route POST /api/cost-estimation/estimate
 * @access private (customer)
 */

module.exports.estimateCost = async (req, res) => {
    try {
        const { truckType, distance } = req.query;
        if(!truckType || !distance) {
            return res.status(400).json({ msg: "Please provide truckType and distance." });
        }

        // Check for valid truckType
        const validTruckTypes = ['2-3 Axle', '4-5 Axle', '6 Axle'];
        if (!validTruckTypes.includes(truckType)) {
            return res.status(400).json({ msg: "Invalid truck type provided." });
        }

        // Find the cost estimation for the given truck type for the user
        const costEstimation = await truckCostEstimationModel.findOne({
            _id: { $in: req.user.costEstimation },
            truckType: truckType
        });

        if (!costEstimation) {
            return res.status(404).json({ msg: "Cost estimation for the specified truck type not found." });
        }



        // Calculate the cost
        const labourCost = costEstimation.labourCost.costPerKm * distance;
        const fuelCost = costEstimation.fuelCost.costPerKm * distance;
        const routineMaintenanceCost = costEstimation.routineMaintenanceCost.costPerKm * distance;
        const tireCost = costEstimation.tireCostPerKm.costPerKm * distance;
        const repairCost = costEstimation.repairCostPerKm.costPerKm * distance;
        const miscCost = costEstimation.miscCostPerKm.costPerKm * distance;

        const totalCost = labourCost + fuelCost + routineMaintenanceCost + tireCost + repairCost + miscCost;

        const data = {
            labourCost,
            fuelCost,
            routineMaintenanceCost,
            tireCost,
            totalCost,
            repairCost,
            miscCost,
        };
        res.json({
            data: data,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}