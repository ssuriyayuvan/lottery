const Joi = require('joi');

exports.purchaseTicket = (req) => {
    let schema = Joi.object().keys(Object.assign({
        user_id: Joi.string().required(),
        ticket_number: Joi.string().required(),
        ticket_master_id: Joi.string().required(),
        actual_price: Joi.number().required(),
        sell_price: Joi.number().required(),
        show_time: Joi.string().required(),
        date: Joi.string().required()
    }));
    return schema.validate(req, { abortEarly: false })
}

exports.patchUser = (req) => {
    let schema = Joi.object().keys(Object.assign({
        name: Joi.string().allow('').optional(),
        mobile: Joi.string().allow('').optional(),
        email: Joi.string().allow('').optional(),
        gender: Joi.string().allow('').optional(),
    }));
    return schema.validate(req, { abortEarly: false })
}