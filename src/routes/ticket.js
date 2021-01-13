const express = require('express');
const router = express.Router();
const ticketCore = require('../core/ticket')
const controller = require('../helper/controller');
const ticketValidation = require('../validation/ticket.validation');

router.get('/', async (req, res) => {
    try {
        await ticketCore.getTickets(req, res)
    } catch (err) {
        return res.status(500).send(controller.errorMsgFormat({
            'message': err.message
        }, 'ticket', 500));
    }
});


router.get('/:id', async (req, res) => {
    try {
        await ticketCore.getTicketsById(req, res)
    } catch (err) {
        return res.status(500).send(controller.errorMsgFormat({
            'message': err.message
        }, 'ticket', 500));
    }
});

router.post('/', async (req, res) => {
    try {
        let { error } = await ticketValidation.addTicket(req.body.data.attributes);
        if (error) {
            return res.status(400).send(controller.errorFormat(error));
        }
        await ticketCore.addTickets(req, res);
    } catch (err) {
        return res.status(500).send(controller.errorMsgFormat({
            'message': err.message
        }, 'ticket', 500));
    }
});

router.patch('/:id', async (req, res) => {
    try {
        let { error } = await ieoValidation.ieoTokenSale(req.body.data.attributes);
        if (error) {
            return res.status(400).send(controller.errorFormat(error));
        }
        await ticketCore.patchTicket(req, res);

    } catch (err) {
        return res.status(500).send(controller.errorMsgFormat({
            'message': err.message
        }, 'ticket', 500));
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await ticketCore.deleteTicket(req, res)
    } catch (err) {
        return res.status(500).send(controller.errorMsgFormat({
            'message': err.message
        }, 'ticket', 500));
    }
})

module.exports = router;