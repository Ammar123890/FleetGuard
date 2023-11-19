const router = require('express').Router();

//paths
const authRouter = require('./auth');


//routes
router.use('/auth', authRouter);


module.exports = router;