const Joi = require('joi');

const TruckSchema = Joi.object({
    truckNumber: Joi.string().trim().uppercase().pattern(new RegExp('^[A-Z0-9]{6,10}$')).required().messages({
        'string.pattern.base': `"truckNumber" should be 6 to 10 characters long and contain only uppercase letters and numbers`,
        'string.empty': `"truckNumber" cannot be an empty field`,
        'any.required': `"truckNumber" is a required field`
    }),
    make: Joi.string().trim().required().messages({
        'string.empty': `"make" cannot be an empty field`,
        'any.required': `"make" is a required field`
    }),
    year: Joi.string().trim().length(4).pattern(/^[0-9]+$/).required().messages({
        'string.length': `"year" should be exactly 4 digits long`,
        'string.pattern.base': `"year" should contain only digits`,
        'string.empty': `"year" cannot be an empty field`,
        'any.required': `"year" is a required field`
    }),
    registration: Joi.string().trim().required().messages({
        'string.empty': `"registration" cannot be an empty field`,
        'any.required': `"registration" is a required field`
    }),
    // The owner field is omitted here assuming it's set internally and not through input validation
}).options({ abortEarly: false, allowUnknown: false });

module.exports.ValidateTruck = (payload) => {
    return TruckSchema.validate(payload);
};
