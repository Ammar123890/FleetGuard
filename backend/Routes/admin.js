const router = require('express').Router();

//middleware
const { adminMiddleware } = require('../Middlewares/user');

//controllers
const { 
    addDashcamModel,
    getDashcamModels,
    editDashcam,

} = require('../Controllers/Admin/dashcam');

const {

    getSalesData

} =require( '../Controllers/Admin/sales')

//paths
router.use(adminMiddleware)
router.post('/dashcam/add', addDashcamModel);
router.get('/dashcam/getModels', getDashcamModels);
router.put('/dashcam/edit/:id', editDashcam);

router.get('/sales/getSalesData', getSalesData)


module.exports = router;