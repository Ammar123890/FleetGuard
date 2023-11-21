const router = require('express').Router();

//middleware
const { customerMiddleware } = require('../Middlewares/user');

//controllers
const { 
    purchaseDashcam

} = require('../Controllers/Customer/dashcam');


//paths
router.use(customerMiddleware)
router.post('/dashcam/purchase', purchaseDashcam);

module.exports = router;
