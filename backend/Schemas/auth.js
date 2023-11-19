const Joi = require('joi');

module.exports.SignupSchema = (payload) =>{

    const SignupSchema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        phone: Joi.string().required(),
        userType: Joi.string().valid('customer', 'admin' ).required()
    }).unknown(false);

    const validation = SignupSchema.validate(payload);
    return validation;
};


module.exports.LoginSchema = (payload) =>{
    const LoginSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }).unknown(false);

    const validation = LoginSchema.validate(payload);
    return validation;
}