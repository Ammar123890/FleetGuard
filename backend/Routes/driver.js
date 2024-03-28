const router = require('express').Router();


//controllers
const {

    getShipment,
    startShipment
} = require('../Controllers/driver');


//paths
router.get('/shipment/upcoming/:truckId', getShipment);
router.put('/shipment/start/:shipmentId', startShipment);



module.exports = router;