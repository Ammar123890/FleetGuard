const router = require('express').Router();

//paths
const authRouter = require('./auth');
const adminRouter = require('./admin');
const customerRouter = require('./customer');
const driverRouter = require('./driver');



//routes
router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/customer', customerRouter);
router.use('/driver', driverRouter);



module.exports = router;