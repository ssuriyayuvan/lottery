const _ = require('lodash');
const masterSchema = require('../schema/ticket-master');
const ticketSchema = require('../schema/ticket');
const controller = require('../helper/controller')

const masterCore = () => {
    return {
        async getMaster(req, res) {
            try {
                let name = req.query.name ? req.query.name : '';
                let result = await masterSchema.find({ name: { $regex: new RegExp(name, 'i') } });
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
                let masterData = data[0];
                let ticketData = data[1];
                let alreadyExists = await masterSchema.findOne({ name: masterData.name });
                if (!_.isEmpty(alreadyExists)) return res.status(500).send(controller.errorMsgFormat({
                    'message': 'Ticket already exists'
                }, 'master', 500));
                let masterRes = await new masterSchema(masterData).save();
                for (let i = 0; i < ticketData.length; i++) {
                    ticketData[i]['master_id'] = masterRes._id;
                }
                await ticketSchema.insertMany(ticketData);
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