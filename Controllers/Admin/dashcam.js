const dashcamModel = require('../../Models/Admin/stock');


//schema validation
const { ValidateStock } = require('../../Schemas/dashcam');

/** 
 * @description To add a dashcam
 * @route POST /api/dashcam/add
 * @access Admin
*/

module.exports.addDashcamModel = async (req, res) => {
    const { error } = ValidateStock(req.body);
    if (error) {
        return res.status(400).json({ errors: error });
    }

    //check if the model already exists
    const model = await dashcamModel.findOne({ model: req.body.model });
    if (model) {
        return res.status(400).json({ msg: "Model already exists" });
    }

    try {
        const newDashcam = new dashcamModel(req.body);
        await newDashcam.save();
        return res.status(200).json({
            msg: "Dashcam added",
            status: true,
        });
    } catch (error) {
        return res.status(500).json({ errors: error });
    }
}

/**
 * @description To get all dashcams
 * @route GET /api/admin/dashcam/getModels
 * @route GET /api/customer/dashcam/getModels
 * @access Admin
 */

module.exports.getDashcamModels = async (req, res) => {
    try {
        const dashcams = await dashcamModel.find();
        return res.status(200).json({
            data: dashcams,
            status: true,
        });
    } catch (error) {
        return res.status(500).json({ errors: error });
    }
}

/**
 * @description To edit a dashcam
 * @route PUT /api/admin/dashcam/edit/:id
 * @access Admin
 */

module.exports.editDashcam = async (req, res) => {
    const { error } =  ValidateStock(req.body);
    if (error) {
        return res.status(400).json({ errors: error });
    }

    try {
        const dashcam = await dashcamModel.findById(req.params.id);
        if (!dashcam) {
            return res.status(400).json({
                errors: { msg: "Dashcam not found", status: false },
            });
        }

        await dashcamModel.updateOne({ _id: req.params.id }, req.body);
        return res.status(200).json({
            msg: "Dashcam updated",
            status: true,
        });
    } catch (error) {
        return res.status(500).json({ errors: error });
    }

}

/**
 * @description To get dashcam by id in params
 * @route GET /api/customer/dashcam/get/:id
 * @route GET /api/admin/dashcam/get/:id
 * @access Customer
 **/

module.exports.getDashcam = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if the provided ID is valid
        if (!id) {
            return res.status(400).json({ error: 'Invalid ID parameter' });
        }

        const dashcam = await dashcamModel.findById(req.params.id);
        return res.status(200).json({
            data: dashcam,
            status: true,
        });
    } catch (error) {
        return res.status(500).json({ errors: error });
    }
}


/**
 * @description To delete a dashcam
 * @route DELETE /api/admin/dashcam/delete/:id
 * @access Admin
 */

module.exports.deleteDashcam = async (req, res) => {
    try {
        const dashcam = await dashcamModel.findById(req.params.id);
        if (!dashcam) {
            return res.status(400).json({
                errors: { msg: "Dashcam not found", status: false },
            });
        }
        
        await dashcamModel.deleteOne({ _id: req.params.id });
        return res.status(200).json({
            msg: "Dashcam deleted",
            status: true,
        });
    } catch (error) {
        return res.status(500).json({ errors: error });
    }
}


