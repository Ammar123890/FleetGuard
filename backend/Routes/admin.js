const router = require('express').Router();

//middleware
const { adminMiddleware } = require('../Middlewares/user');

//controllers
const { 
    addDashcamModel,
    getDashcamModels,
    editDashcam,
    getDashcamModelById
} = require('../Controllers/Admin/dashcam');

const {

    getSalesData

} =require( '../Controllers/Admin/sales')

//paths
router.use(adminMiddleware)
router.post('/dashcam/add', addDashcamModel);
router.get('/dashcam/get', getDashcamModels);
router.put('/dashcam/edit/:id', editDashcam);
router.get('/dashcam/get/:id', getDashcamModelById);

router.get('/sales/get', getSalesData)


module.exports = router;