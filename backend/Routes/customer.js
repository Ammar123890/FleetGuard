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
   getAvailableTrucks

} = require('../Controllers/Customer/truck');

//controllers for driver

const {
    addDriver,
    getDrivers,
    editDriver,
    getAvailableDrivers
} = require('../Controllers/Customer/driver');

//controllers for shipment
const{
    addShipment,
    getShipments,
    startShipment,
    endShipment
} = require('../Controllers/Customer/shipment');



router.use(customerMiddleware)

//paths  fo dashcam

router.post('/dashcam/purchase', purchaseDashcam);
router.get('/dashcam/get', getDashcams);

//paths for trucks

router.post('/truck/add', addTruck);
router.get('/truck/get', getTrucks);
router.put('/truck/edit/:id', editTruck);
router.get('/truck/available', getAvailableTrucks);

//paths for drivers

router.post('/driver/add', addDriver);
router.get('/driver/get', getDrivers);
router.put('/driver/edit/:id', editDriver);
router.get('/driver/available', getAvailableDrivers);

//paths for shipment
router.post('/shipment/add', addShipment);
router.get('/shipment/get', getShipments);
router.put('/shipment/start/:id', startShipment);

module.exports = router;
