const Joi = require('joi');

module.exports.stock = (payload) =>{
    const stock = Joi.object({
        model: Joi.string().max(20).required(),
        pricePerMonth: Joi.number().required(),
        price: Joi.number().required(),
        quantity: Joi.number().required(),
        description: Joi.string().max(200).required(),
    }).unknown(false);

    const validation = stock.validate(payload);
    return validation;
}

