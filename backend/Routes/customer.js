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
   assignDashcam

} = require('../Controllers/Customer/truck');

const {
    getDashcamModels,
    getDashcam
} = require('../Controllers/Admin/dashcam');

//controllers for driver

const {
    addDriver,
    getDrivers,
    editDriver,
    getAvailableDrivers,
    getDriver
} = require('../Controllers/Customer/driver');

//controllers for shipment
const{
    addShipment,
    getShipments,
    startShipment,
    endShipment,
    getShipment

} = require('../Controllers/Customer/shipment');
const { get } = require('mongoose');



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

//paths for drivers

router.post('/driver/add', addDriver);
router.get('/driver/get', getDrivers);
router.put('/driver/edit/:id', editDriver);
router.get('/driver/available', getAvailableDrivers);
router.get('/driver/get/:id', getDriver);

//paths for shipment
router.post('/shipment/add', addShipment);
router.get('/shipment/get', getShipments);
router.put('/shipment/start/:id', startShipment);
router.put('/shipment/end/:id', endShipment);
router.get('/shipment/get/:id', getShipment);

module.exports = router;
