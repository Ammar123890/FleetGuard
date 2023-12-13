const router = require('express').Router();

//middleware
const { adminMiddleware } = require('../Middlewares/user');

//controllers
const { 
    addDashcamModel,
    getDashcamModels,
    editDashcam,
    getDashcam,
    deleteDashcam
    

} = require('../Controllers/Admin/dashcam');

const {

    getSalesData,
    getStatistics

} =require( '../Controllers/Admin/statistics');
const { get } = require('mongoose');

//paths
router.use(adminMiddleware)
router.post('/dashcam/add', addDashcamModel);
router.get('/dashcam/get', getDashcamModels);
router.put('/dashcam/edit/:id', editDashcam);
router.get('/dashcam/get/:id', getDashcam );
router.get('/sales/get', getSalesData)
router.get('/statistics/get', getStatistics)
router.delete('/dashcam/delete/:id', deleteDashcam)


module.exports = router;