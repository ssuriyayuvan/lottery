const Joi = require('joi');

exports.addUser = (req) => {
    let schema = Joi.object().keys(Object.assign({
        name: Joi.string().required(),
        mobile: Joi.string().required(),
        email: Joi.string().email().required(),
        gender: Joi.string().required(),
    }));
    return schema.validate(req, { abortEarly: false })
}

exports.patchUser = (req) => {
    let schema = Joi.object().keys(Object.assign({
        name: Joi.string().allow('').optional(),
        mobile: Joi.string().allow('').optional(),
        email: Joi.string().allow('').optional(),
        gender: Joi.string().allow('').optional(),
        is_active: Joi.string().valid('Yes','No').allow('').optional(),
    }));
    return schema.validate(req, { abortEarly: false })
}