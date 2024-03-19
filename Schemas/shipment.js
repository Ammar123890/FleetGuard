const Joi = require('joi');
const objectId = require('joi-objectid')(Joi); // for validating MongoDB ObjectIds

const shipmentSchema = Joi.object({

    truck: objectId().required().messages({
        'any.required': `"truck" is a required field`
    }),
    driver: objectId().required().messages({
        'any.required': `"driver" is a required field`
    }),
    shipmentType: Joi.string().trim().required().messages({
        'string.empty': `"shipmentType" cannot be an empty field`,
        'any.required': `"shipmentType" is a required field`
    }),
    shipmentWeight: Joi.number().integer().min(1).required().messages({
        'number.base': `"shipmentWeight" should be a number`,
        'number.min': `"shipmentWeight" should be at least 1`,
        'any.required': `"shipmentWeight" is a required field`
    }),
    shipmentArea: Joi.number().integer().min(1).required().messages({
        'number.base': `"shipmentArea" should be a number`,
        'number.min': `"shipmentArea" should be at least 1`,
        'any.required': `"shipmentArea" is a required field`
    }),
    shipmentDescription: Joi.string().trim().required().messages({
        'string.empty': `"shipmentDescription" cannot be an empty field`,
        'any.required': `"shipmentDescription" is a required field`
    }),
    shipmentPickDate: Joi.date().iso().required().messages({
        'date.base': `"shipmentPickDate" should be a valid ISO 8601 date format`,
        'any.required': `"shipmentPickDate" is a required field`
    }),
    shipmentDeliveryDate: Joi.date().iso().greater(Joi.ref('shipmentPickDate')).required().messages({
        'date.base': `"shipmentDeliveryDate" should be a valid ISO 8601 date format`,
        'date.greater': `"shipmentDeliveryDate" should be later than "shipmentPickDate"`,
        'any.required': `"shipmentDeliveryDate" is a required field`
    }),
    shipmentDestination: Joi.object({
        location: Joi.string().trim().required().messages({
            'string.empty': `"location" cannot be an empty field`,
            'any.required': `"location" is a required field`
        }),
        coordinates: Joi.array().items(Joi.number()).length(2).required().messages({
            'array.base': `"coordinates" should be an array of two numbers`,
            'array.length': `"coordinates" should have exactly 2 elements`,
            'any.required': `"coordinates" is a required field`
        })
    }),
    shipmentOrigin: Joi.object({
        location: Joi.string().trim().required().messages({
            'string.empty': `"location" cannot be an empty field`,
            'any.required': `"location" is a required field`
        }),
        coordinates: Joi.array().items(Joi.number()).length(2).required().messages({
            'array.base': `"coordinates" should be an array of two numbers`,
            'array.length': `"coordinates" should have exactly 2 elements`,
            'any.required': `"coordinates" is a required field`
        })
    }),
    shipmentCost: Joi.number().precision(2).min(0).required().messages({
        'number.base': `"shipmentCost" should be a number`,
        'number.min': `"shipmentCost" should be a non-negative number`,
        'any.required': `"shipmentCost" is a required field`
    }),
    paymentMethod: Joi.string().valid('cash', 'card').default('cash').required().messages({
        'string.empty': `"paymentMethod" cannot be an empty field`,
        'any.required': `"paymentMethod" is a required field`,
        'any.only': `"paymentMethod" must be one of ['cash', 'card']`
    }),
    sender: Joi.object({
        name: Joi.string().trim().required().messages({
            'string.empty': `"name" cannot be an empty field`,
            'any.required': `"name" is a required field`
        }),
        phone: Joi.string().trim().pattern(new RegExp('^[0-9]{7,12}$')).required().messages({
            'string.pattern.base': `"phone" should have between 7 and 12 digits`,
            'string.empty': `"phone" cannot be an empty field`,
            'any.required': `"phone" is a required field`
        }),
    }),
    receiver: Joi.object({
        name: Joi.string().trim().required().messages({
            'string.empty': `"name" cannot be an empty field`,
            'any.required': `"name" is a required field`
        }),
        phone: Joi.string().length(10).pattern(/^[0-9]+$/).required().messages({
            'string.length': `"phone" should be exactly 10 digits long`,
            'string.pattern.base': `"phone" should contain only digits`,
            'string.empty': `"phone" cannot be an empty field`,
            'any.required': `"phone" is a required field`
        })
    })
}).options({ abortEarly: false, allowUnknown: false });

module.exports.ValidateShipment = (payload) => {
    return shipmentSchema.validate(payload);
};
