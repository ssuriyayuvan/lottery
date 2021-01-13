const Joi = require('joi');

exports.addTicket = (req) => {
    let schema = Joi.object().keys(Object.assign({
        name: Joi.string().required(),
        price: Joi.number().required(),
    }));
    return schema.validate(req, { abortEarly: false })
}