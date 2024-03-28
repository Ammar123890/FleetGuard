const salesModel = require("../../Models/Admin/sales");
const customerModel = require("../../Models/Customer/customer");
const shipmentModel = require("../../Models/Customer/shipment");
const truckModel = require("../../Models/Customer/truck");
const driverModel = require("../../Models/Customer/driver");




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

/**
 * @description To get all sales by month and year (based upon filters)
 * @route GET /api/admin/sales/get
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

        res.status(200).json({
            data: salesData
         });
    } catch (error) {
        console.error("Error fetching sales data:", error);
        res.status(500).json({ message: "Error fetching sales data." });
    }
};

/**
 * @description To get all total revenue, total users, total dascam sold, total orders
 * @route GET /api/admin/statistics/get
 * @access Admin
 */


module.exports.getStatistics = async (req, res) => {
    try {
        // Helper function to get the start date of the month
        const getStartDate = (monthsBack) => {
            let date = new Date();
            date.setMonth(date.getMonth() - monthsBack);
            date.setDate(1);
            return date;
        };

        // Dates for filtering
        const startOfLastMonth = getStartDate(1);
        const startOfTwoMonthsAgo = getStartDate(2);

        // Helper function to build aggregation pipeline for sales
        const buildSalesPipeline = (startDate, endDate) => ([
            { $match: { date: { $gte: startDate, $lt: endDate } } },
            { $group: { _id: null, total: { $sum: "$price" }, count: { $sum: 1 }, totalQuantity: { $sum: "$quantity" } } }
        ]);

        // Helper function to build aggregation pipeline for customers
        const buildCustomerPipeline = (startDate, endDate) => ([
            { $match: { createdAt: { $gte: startDate, $lt: endDate } } },
            { $group: { _id: null, total: { $sum: 1 } } }
        ]);

        // Aggregation for last month (sales and customers)
        const lastMonthSales = await salesModel.aggregate(buildSalesPipeline(startOfLastMonth, new Date()));
        const lastMonthCustomers = await customerModel.aggregate(buildCustomerPipeline(startOfLastMonth, new Date()));

        // Aggregation for the month before last month (sales and customers)
        const prevMonthSales = await salesModel.aggregate(buildSalesPipeline(startOfTwoMonthsAgo, startOfLastMonth));
        const prevMonthCustomers = await customerModel.aggregate(buildCustomerPipeline(startOfTwoMonthsAgo, startOfLastMonth));

        // Function to safely extract statistic value
        const getStatValue = (stats, key) => {
            return stats.length > 0 ? stats[0][key] : 0;
        };

        // Function to calculate change percentage
        const calculateChange = (current, previous) => {
            if (previous === 0) {
                return current !== 0 ? 100 : 0;
            }
            return ((current-previous) /  current) * 100;
        };

        // Extracting statistics
        const totalRevenueLastMonth = getStatValue(lastMonthSales, 'total');
        const totalRevenuePrevMonth = getStatValue(prevMonthSales, 'total');
        // ... similar extraction for other statistics

        // Preparing response
        const response = {
            totalRevenue: totalRevenueLastMonth,
            totalOrders: getStatValue(lastMonthSales, 'count'),
            totalDashcamSold: getStatValue(lastMonthSales, 'totalQuantity'),
            totalUsers: getStatValue(lastMonthCustomers, 'total'),
            changePercentage: {
                revenue: calculateChange(totalRevenueLastMonth, totalRevenuePrevMonth),
                orders: calculateChange(getStatValue(lastMonthSales, 'count'), getStatValue(prevMonthSales, 'count')),
                dashcamSold: calculateChange(getStatValue(lastMonthSales, 'totalQuantity'), getStatValue(prevMonthSales, 'totalQuantity')),
                users: calculateChange(getStatValue(lastMonthCustomers, 'total'), getStatValue(prevMonthCustomers, 'total'))
            }
        };

        res.status(200).json({
            data: response
        });
    } catch (error) {
        console.error("Error fetching statistics:", error);
        res.status(500).json({ message: "Error fetching statistics." });
    }
};


/**
 * @description To get the users (customers)
 * @route GET /api/admin/statistics/getUsers
 * @access Admin
 */

module.exports.getUsers = async (req, res) => {
    try {
        const users = await customerModel.find({});
        res.status(200).json({
            data: users
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users." });
    }
}


/**
 * @description To get the shipments (orders) 
 * @route GET /api/admin/statistics/getShipments
 * @query {status}  'pending', 'in transit', 'delivered'
 * @access Admin
 */

module.exports.getShipments = async (req, res) => {
    const { status } = req.query;
    if (!status) {
        return res.status(400).json({
            success: false,
            message: "Status is required"
        });
    }

    try {
        let shipments = await shipmentModel.find({ shipmentStatus: status })
            .select(' shipmentDescription shipmentStatus shipmentPickDate shipmentDeliveryDate shipmentCost')
            .populate({
                path: 'owner',
                select: 'name company phone -_id' 
            })
            .populate({
                path: 'driver',
                select: 'name phone -_id',
            })
            .populate('truck', 'truckNumber -_id')
            .exec();

        shipments = shipments.map(shipment => {
            return shipment;
        });

        res.json({
            success: true,
            count: shipments.length,
            data: shipments
        });
    } catch (error) {
        console.error("Error fetching shipment data:", error);
        res.status(500).json({
            error: error.message,
            success: false,
            message: "Error fetching shipment data"
        });
    }
};

/**
 * @description To get the drivers
 * @route GET /api/admin/statistics/getDrivers
 * @access Admin
 */

module.exports.getDrivers = async (req, res) => {
    try {
        const drivers = await driverModel.find({})
            .select('name phone experience licenseNumber licenseExpiry -_id')
            .exec();

        res.status(200).json({
            data: drivers
        });
    } catch (error) {
        console.error("Error fetching drivers:", error);
        res.status(500).json({ message: "Error fetching drivers." });
    }
}


/**
 * @description To get the customers (users)
 * @route GET /api/admin/statistics/getCustomers
 * @access Admin
 */

module.exports.getCustomers = async (req, res) => {
    try {
        const customers = await customerModel.find({})
            .select('name email phone companyName -_id')
            .exec();

        res.status(200).json({
            data: customers
        });
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ message: "Error fetching customers." });
    }
}