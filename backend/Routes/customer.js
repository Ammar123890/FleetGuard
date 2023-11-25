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
   editTruck

} = require('../Controllers/Customer/truck');

//controllers for driver

const {
    addDriver,
    getDrivers,
    editDriver
} = require('../Controllers/Customer/driver');


router.use(customerMiddleware)

//paths  fo dashcam

router.post('/dashcam/purchase', purchaseDashcam);
router.get('/dashcam/get', getDashcams);

//paths for trucks

router.post('/truck/add', addTruck);
router.get('/truck/get', getTrucks);
router.put('/truck/edit/:id', editTruck);

//paths for drivers

router.post('/driver/add', addDriver);
router.get('/driver/get', getDrivers);
router.put('/driver/edit/:id', editDriver);

module.exports = router;
