const router = require('express').Router();

//middleware
const { customerMiddleware } = require('../Middlewares/user');

//controllers  for dashcam
const { 
    purchaseDashcam,
    getDashcams,

} = require('../Controllers/Customer/dashcam');

//controllers for trucks

const {
   addTruck,
   getTrucks,
   editTruck,
   getAvailableTrucks,
   getTruck,
   assignDashcam,
   deleteTruck

} = require('../Controllers/Customer/truck');

const {
    getDashcamModels,
    getDashcam
} = require('../Controllers/Admin/dashcam');

const {
    getStatistics
}= require('../Controllers/Customer/statistic');

//controllers for driver

const {
    addDriver,
    getDrivers,
    editDriver,
    getAvailableDrivers,
    getDriver,
    deleteDriver
} = require('../Controllers/Customer/driver');

//controllers for shipment
const{
    addShipment,
    getShipments,
    startShipment,
    endShipment,
    getShipment,
    updateScore,
    getWeather,
    getShipmentScore,
    getViolationDetails

} = require('../Controllers/Customer/shipment');
const { get } = require('mongoose');

//controllers for cost estimation
const {
    getCostEstimation,
    updateCostEstimation
} = require('../Controllers/Customer/costEstimation');




//update score
router.put('/shipment/updateScore', updateScore);

router.use(customerMiddleware)

//paths  fo dashcam

router.post('/dashcam/purchase', purchaseDashcam);
router.get('/dashcam/get', getDashcams);
router.get('/dashcam/list/get', getDashcamModels);
router.get('/dashcam/get/:id',getDashcam);
//paths for trucks

router.post('/truck/add', addTruck);
router.get('/truck/get', getTrucks);
router.put('/truck/edit/:id', editTruck);
router.get('/truck/available', getAvailableTrucks);
router.get('/truck/get/:id', getTruck);
router.put('/truck/assigndashcam/:dashcam_id/:truck_id', assignDashcam);
router.delete('/truck/delete/:id', deleteTruck);

//paths for drivers

router.post('/driver/add', addDriver);
router.get('/driver/get', getDrivers);
router.put('/driver/edit/:id', editDriver);
router.get('/driver/available', getAvailableDrivers);
router.get('/driver/get/:id', getDriver);
router.delete('/driver/delete/:id', deleteDriver);

//paths for shipment
router.post('/shipment/add', addShipment);
router.get('/shipment/get', getShipments);
router.put('/shipment/start/:id', startShipment);
router.put('/shipment/end/:id', endShipment);
router.get('/shipment/get/:id', getShipment);
router.get('/shipment/score/get/:id', getShipmentScore);
router.get('/shipment/weather/get/:lg/:lt', getWeather);
router.get('/shipment/violation/get/:id/:type', getViolationDetails);

//paths for statistics
router.get('/statistics/get', getStatistics);

//paths for cost estimation
router.get('/cost-estimation', getCostEstimation);
router.put('/cost-estimation/:type', updateCostEstimation);

module.exports = router;
