const salesModel = require("../../Models/Admin/sales");


//helper functions
async function aggregateSalesByMonth(SalesModel, startDate, endDate) {
    return SalesModel.aggregate([
        { $match: { date: { $gte: startDate, $lte: endDate } } },
        { $group: {
            _id: { $month: "$date" },
            totalSales: { $sum: "$price" },
            count: { $sum: 1 }
        } },
        { $sort: { "_id": 1 } }
    ]);
}

async function aggregateSalesByYear(SalesModel, startDate, endDate) {
    return SalesModel.aggregate([
        { $match: { date: { $gte: startDate, $lte: endDate } } },
        { $group: {
            _id: { $year: "$date" },
            totalSales: { $sum: "$price" },
            count: { $sum: 1 }
        } },
        { $sort: { "_id": 1 } }
    ]);
}

module.exports.recordSale = async (customerId, dashcamModel, totalQuantity, totalPrice) => {

    try {
        const newPurchase = new salesModel({
            dashcam: dashcamModel,
            customer: customerId,
            date: new Date(),
            price: totalPrice,
            quantity: totalQuantity
        });
        await newPurchase.save();
        return true;
    } catch (error) {
        console.error("Error recording sale:", error);
        throw error; 
    }
};




//controllers


/**
 * @description To get all sales by month and year (based upon filters)
 * @route GET /api/sales/getSales
 * @access Admin
 */


module.exports.getSalesData = async (req, res) => {
    try {
        const { year, month } = req.query;
        let salesData;

        if (year && month) {
            // Calculate the start date 7 months ago from the given year and month
            let startMonth = new Date(parseInt(year), parseInt(month) - 7, 1);
            // Calculate the end date at the end of the given month
            let endMonth = new Date(parseInt(year), parseInt(month), 0);

            salesData = await aggregateSalesByMonth(salesModel, startMonth, endMonth);
        } else if (year) {
            // Calculate the date 6 years ago from the given year
            let startYear = new Date(parseInt(year) - 6, 0, 1);
            // Calculate the end date at the end of the given year
            let endYear = new Date(parseInt(year), 11, 31);

            salesData = await aggregateSalesByYear(salesModel, startYear, endYear);
        } else {
            return res.status(400).json({ message: "Year is required for querying sales data." });
        }

        res.status(200).json(salesData);
    } catch (error) {
        console.error("Error fetching sales data:", error);
        res.status(500).json({ message: "Error fetching sales data." });
    }
};


