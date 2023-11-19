const router = require('express').Router();
const { 
     login,
     register, 
     verifyOTP,
     resendOTP

    } = require('../Controllers/auth');

//middleware
const { adminMiddleware } = require('../Middlewares/user');

router.post('/register', register);
router.post('/login', login);
router.post('/verify', verifyOTP);
router.post('/resend', resendOTP);

router.post('/admin/register', adminMiddleware, register);



module.exports = router;

