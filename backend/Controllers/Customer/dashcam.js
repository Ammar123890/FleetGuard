const dashcamModel = require("../../Models/Customer/dashcam");
const dashcamStock = require("../../Models/Admin/stock");
const { generateSerialNumber } = require("../../Utils/generateSerial");
const { recordSale } = require("../../Controllers/Admin/statistics");




/** 
 * @description To purchase a dashcam
 * @route POST /api/customer/dashcam/purchase
 * @access Customer
*/

module.exports.purchaseDashcam = async (req, res) => {
    try {
        const { model, quantity } = req.body;

        // Check stock availability
        const stockItem = await dashcamStock.findOne({ model });
        if (!stockItem || stockItem.quantity < quantity) {
            return res.status(400).json({ msg: "Insufficient stock" });
        }

        // Generate individual dashcams
        let newDashcams = [];
        for (let i = 0; i < quantity; i++) {
            let serialNumber = generateSerialNumber(model); // Implement this function
            newDashcams.push(new dashcamModel({
                serialNumber,
                model,
                assignedTo: req.user._id,
                pricePerMonth: stockItem.pricePerMonth,
                dateOfPurchase: Date.now()
            }));
        }

        // Save individual dashcams
        await dashcamModel.insertMany(newDashcams);

         // Record the sale
         const totalPrice = quantity * stockItem.price;
         await recordSale(req.user._id, model, quantity, totalPrice);

        // Update stock
        stockItem.quantity -= quantity;
        await stockItem.save();

        return res.status(200).json({
            msg: "Dashcam purchase successful",
            data: newDashcams.map(d => ({ serialNumber: d.serialNumber }))
        });
    } catch (error) {
        return res.status(500).json({ errors: error });
    }
};

/**
 * @description To get own dashcams
 * @route GET /api/customer/dashcam/getdashcams
 * @access Customer
 */

module.exports.getDashcams = async (req, res) => {
    try {
        const dashcams = await dashcamModel.find({ assignedTo: req.user._id });
        return res.status(200).json({
            data: dashcams,
            status: true,
        });
    } catch (error) {
        return res.status(500).json({ errors: error });
    }
}

/**
 * @description To get dashcam by id in params
 * @route GET /api/customer/dashcam/get/:id
 * @access Customer
 **/

module.exports.getDashcam = async (req, res) => {
    try {
        const dashcam = await dashcamModel.findById(req.params.id);
        if (!dashcam) {
            return res.status(404).json({ msg: "Dashcam not found" });
        }

        if (dashcam.assignedTo.toString() != req.user._id.toString()) {
            return res.status(401).json({ msg: "Unauthorized" });
        }
        return res.status(200).json({
            data: dashcam,
            status: true,
        });
    } catch (error) {
        return res.status(500).json({ errors: error });
    }
}