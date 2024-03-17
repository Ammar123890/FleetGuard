const router = require('express').Router();
const { 
     login,
     register, 
     verifyOTP,
     resendOTP,
     addAdminRole,
     addCustomerDetails,
     editCustomerDetails,
     getCustomerDetails

    } = require('../Controllers/auth');

//middleware
const { adminMiddleware, customerMiddleware } = require('../Middlewares/user');

router.post('/register', register);
router.post('/login', login);
router.post('/verify', verifyOTP);
router.post('/resend', resendOTP);


router.post('/admin/register', adminMiddleware, register);
router.post('/admin/addrole', adminMiddleware, addAdminRole);

router.post('/customer/adddetails', customerMiddleware, addCustomerDetails);
router.put('/customer/editdetails', customerMiddleware, editCustomerDetails);
router.get('/customer/getdetails', customerMiddleware, getCustomerDetails);




module.exports = router;

