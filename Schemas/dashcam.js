const Joi = require('joi');

const stockSchema = Joi.object({
    model: Joi.string().trim().max(20).required().messages({
        'string.base': `"model" should be a type of 'text'`,
        'string.max': `"model" should not be more than 20 characters`,
        'string.empty': `"model" cannot be an empty field`,
        'any.required': `"model" is a required field`
    }),
    pricePerMonth: Joi.number().positive().precision(2).required().messages({
        'number.base': `"pricePerMonth" should be a number`,
        'number.positive': `"pricePerMonth" should be a positive value`,
        'number.precision': `"pricePerMonth" should have at most 2 decimal places`,
        'any.required': `"pricePerMonth" is a required field`
    }),
    price: Joi.number().positive().precision(2).required().messages({
        'number.base': `"price" should be a number`,
        'number.positive': `"price" should be a positive value`,
        'number.precision': `"price" should have at most 2 decimal places`,
        'any.required': `"price" is a required field`
    }),
    quantity: Joi.number().integer().min(0).required().messages({
        'number.base': `"quantity" should be a number`,
        'number.integer': `"quantity" should be an integer`,
        'number.min': `"quantity" must be greater than or equal to 0`,
        'any.required': `"quantity" is a required field`
    }),
    description: Joi.string().trim().max(200).required().messages({
        'string.base': `"description" should be a type of 'text'`,
        'string.max': `"description" should not be more than 200 characters`,
        'string.empty': `"description" cannot be an empty field`,
        'any.required': `"description" is a required field`
    }),
}).options({ abortEarly: false, allowUnknown: false });




module.exports.ValidateStock = (payload) => {
    return stockSchema.validate(payload);
};
