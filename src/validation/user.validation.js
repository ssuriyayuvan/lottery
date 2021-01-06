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
        gender: Joi.string().allow('').optional(),
    }));
    return schema.validate(req, { abortEarly: false })
}