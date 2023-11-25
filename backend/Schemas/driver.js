const Joi = require('joi');

const DriverSchema = Joi.object({
    name: Joi.string().trim().required().messages({
        'string.base': `"name" should be a type of 'text'`,
        'string.empty': `"name" cannot be an empty field`,
        'any.required': `"name" is a required field`
    }),
    phone: Joi.string().trim().pattern(new RegExp('^[0-9]{10,15}$')).required().messages({
        'string.pattern.base': `"phone" should have between 10 and 15 digits`,
        'string.empty': `"phone" cannot be an empty field`,
        'any.required': `"phone" is a required field`
    }),
    licenseNumber: Joi.string().trim().required().messages({
        'string.empty': `"licenseNumber" cannot be an empty field`,
        'any.required': `"licenseNumber" is a required field`
    }),
    licenseExpiry: Joi.date().greater('now').required().messages({
        'date.greater': `"licenseExpiry" should be a date after today`,
        'any.required': `"licenseExpiry" is a required field`
    }),
    age: Joi.number().integer().min(18).required().messages({
        'number.base': `"age" should be a number`,
        'number.min': `"age" should be at least 18`,
        'any.required': `"age" is a required field`
    }),
    address: Joi.string().trim().required().messages({
        'string.empty': `"address" cannot be an empty field`,
        'any.required': `"address" is a required field`
    }),
    experience: Joi.number().integer().min(0).required().messages({
        'number.base': `"experience" should be a number`,
        'number.min': `"experience" should be a positive number`,
        'any.required': `"experience" is a required field`
    }),
}).options({ abortEarly: false, allowUnknown: false });



module.exports.ValidateDriver = (payload) => {
    return DriverSchema.validate(payload);
};
