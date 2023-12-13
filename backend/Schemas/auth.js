const Joi = require('joi');

const emailValidation = Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.email': `"email" must be a valid email address`,
    'any.required': `"email" is a required field`
});

const passwordValidation = Joi.string().required().messages({
    'string.empty': `"password" cannot be an empty field`,
    'any.required': `"password" is a required field`
});

module.exports.SignupSchema = (payload) => {
    const SignupSchema = Joi.object({
        email: emailValidation,
        password: passwordValidation,
        userType: Joi.string().valid('customer', 'admin').required().messages({
            'any.only': `"userType" must be either 'customer' or 'admin'`,
            'any.required': `"userType" is a required field`
        })
    }).options({ abortEarly: false, allowUnknown: false });

    return SignupSchema.validate(payload);
};

module.exports.LoginSchema = (payload) => {
    const LoginSchema = Joi.object({
        email: emailValidation,
        password: passwordValidation
    }).options({ abortEarly: false, allowUnknown: false });

    return LoginSchema.validate(payload);
};

module.exports.CustomerSchema = (payload) => {
    const CustomerSchema = Joi.object({
        profilPic: Joi.string().uri().allow(null, '').messages({
            'string.uri': `"profilPic" must be a valid URI`
        }),
        name: Joi.string().trim().required().messages({
            'string.empty': `"name" cannot be an empty field`,
            'any.required': `"name" is a required field`
        }),
        companyName: Joi.string().trim().required().messages({
            'string.empty': `"companyName" cannot be an empty field`,
            'any.required': `"companyName" is a required field`
        }),
        phone: Joi.string().trim().pattern(new RegExp('^[0-9]{10,15}$')).required().messages({
            'string.pattern.base': `"phone" should have between 10 and 15 digits`,
            'string.empty': `"phone" cannot be an empty field`,
            'any.required': `"phone" is a required field`
        }),
        location: Joi.object({
            country: Joi.string().trim().allow('', null),
            address: Joi.string().trim().allow('', null),
            city: Joi.string().trim().allow('', null)
        }).required().messages({
            'any.required': `"location" is a required field`
        })
    }).options({ abortEarly: false, allowUnknown: false });

    return CustomerSchema.validate(payload);
};
