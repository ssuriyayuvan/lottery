const express = require('express');
const router = express.Router();
const userCore = require('../core/user')
const controller = require('../helper/controller');
// const ieoValidation = require('../validation/ieo.validation');
// const ieo = require('../core/ieo');
// const info = require('../middlewares/info');
// const auth = require('../middlewares/authentication');

router.get('/', async (req, res) => {
    try {
        await userCore.getUser(req, res)
    } catch (err) {
        return res.status(500).send(controller.errorMsgFormat({
            'message': err.message
        }, 'user', 500));
    }
});

router.post('/', async (req, res) => {
    try {
        await userCore.addUser(req, res)
    } catch (err) {
        return res.status(500).send(controller.errorMsgFormat({
            'message': err.message
        }, 'user', 500));
    }
});

router.patch('/:id', async (req, res) => {
    try {
        let { error } = await ieoValidation.ieoTokenSale(req.body.data.attributes);
        if (error) {
            return res.status(400).send(controller.errorFormat(error));
        }
        await userCore.patchUser(req, res);

    } catch (err) {
        return res.status(500).send(controller.errorMsgFormat({
            'message': err.message
        }, 'user', 500));
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await userCore.deleteUser(req, res)
    } catch (err) {
        return res.status(500).send(controller.errorMsgFormat({
            'message': err.message
        }, 'user', 500));
    }
})

module.exports = router