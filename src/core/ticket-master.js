const _ = require('lodash');
const masterSchema = require('../schema/ticket-master');
const controller = require('../helper/controller')

const masterCore = () => {
    return {
        async getMaster(req, res) {
            try {
                let result = await masterSchema.find();
                return res.send(controller.successFormat({ data: result }));
            } catch (error) {
                return res.status(500).send(controller.errorMsgFormat({
                    'message': error.message
                }, 'user', 500));
            }
        },

        async addMaster(req, res) {
            try {
                let data = req.body.data.attributes;
                let alreadyExists = await masterSchema.findOne({name: data.name});
                if(!_.isEmpty(alreadyExists)) return res.status(500).send(controller.errorMsgFormat({
                    'message': 'Ticket already exists'
                }, 'master', 500));
                new masterSchema(data).save();
                return res.send(controller.successFormat({ message: 'Ticket saved successfully' }))
            } catch (error) {
                return res.status(500).send(controller.errorMsgFormat({
                    'message': error.message
                }, 'master', 500));
            }
        },

        async patchMaster(req, res) {
            try {
                let data = req.body.data;
                await masterSchema.findOneAndUpdate({ _id: req.params.id }, { data });
                return res.send(controller.successFormat({ message: 'Ticket update successfully' }))
            } catch (error) {
                return res.status(500).send(controller.errorMsgFormat({
                    'message': error.message
                }, 'master', 500));
            }
        },

        async deleteMaster(req, res) {
            try {
                await masterSchema.deleteOne({ _id: req.params.id });
                return res.send(controller.successFormat({ message: 'Ticket deleted successfully' }))
            } catch (error) {
                return res.status(500).send(controller.errorMsgFormat({
                    'message': error.message
                }, 'master', 500));
            }
        }
    }
}

module.exports = masterCore();