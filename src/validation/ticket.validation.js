const Joi = require('joi');

exports.addTicket = (req) => {
    let schema = Joi.object().keys(Object.assign({
        master_id: Joi.string().required(),
        combination: Joi.string().required(),
        prize: Joi.string().required(),
    }));
    return schema.validate(req, { abortEarly: false })
}