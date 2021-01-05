const ticketSchema = require('../schema/ticket');
const controller = require('../helper/controller')

const ticketCore = () => {
    return {
        async getTickets(req, res) {
            try {
                let result = await ticketSchema.find();
                return res.send(controller.successFormat({ data: result }));
            } catch (error) {
                return res.status(500).send(controller.errorMsgFormat({
                    'message': error.message
                }, 'user', 500));
            }
        },

        async addTickets(req, res) {
            try {
                let data = req.body.data;
                let alreadyExists = await ticketSchema.findOne({name: data.name});
                if(!_.isEmpty(alreadyExists)) return res.status(500).send(controller.errorMsgFormat({
                    'message': 'Ticket already exists'
                }, 'ticket', 500));
                new ticketSchema(data).save();
                return res.send(controller.successFormat({ message: 'Ticket saved successfully' }))
            } catch (error) {
                return res.status(500).send(controller.errorMsgFormat({
                    'message': error.message
                }, 'ticket', 500));
            }
        },

        async patchTicket(req, res) {
            try {
                let data = req.body.data;
                await ticketSchema.findOneAndUpdate({ _id: req.params.id }, { data });
                return res.send(controller.successFormat({ message: 'Ticket update successfully' }))
            } catch (error) {
                return res.status(500).send(controller.errorMsgFormat({
                    'message': error.message
                }, 'ticket', 500));
            }
        },

        async deleteTicket(req, res) {
            try {
                await ticketSchema.deleteOne({ _id: req.params.id });
                return res.send(controller.successFormat({ message: 'Ticket deleted successfully' }))
            } catch (error) {
                return res.status(500).send(controller.errorMsgFormat({
                    'message': error.message
                }, 'ticket', 500));
            }
        }
    }
}

module.exports = ticketCore();