const express = require('express');
const router = express.Router();
const ticketMasterCore = require('../core/ticket-master')
const controller = require('../helper/controller');

router.get('/', async (req, res) => {
    try {
        await ticketMasterCore.getMaster(req, res)
    } catch (err) {
        return res.status(500).send(controller.errorMsgFormat({
            'message': err.message
        }, 'master', 500));
    }
});

router.post('/', async (req, res) => {
    try {
        await ticketMasterCore.addMaster(req, res)
    } catch (err) {
        return res.status(500).send(controller.errorMsgFormat({
            'message': err.message
        }, 'master', 500));
    }
});

router.patch('/:id', async (req, res) => {
    try {
        let { error } = await ieoValidation.ieoTokenSale(req.body.data.attributes);
        if (error) {
            return res.status(400).send(controller.errorFormat(error));
        }
        await ticketMasterCore.patchMaster(req, res);

    } catch (err) {
        return res.status(500).send(controller.errorMsgFormat({
            'message': err.message
        }, 'master', 500));
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await ticketMasterCore.deleteMaster(req, res)
    } catch (err) {
        return res.status(500).send(controller.errorMsgFormat({
            'message': err.message
        }, 'master', 500));
    }
})

module.exports = router;