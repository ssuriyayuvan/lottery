const express = require('express');
const router = express.Router();
const userCore = require('../core/user')
const controller = require('../helper/controller');
const userValidation = require('../validation/user.validation');

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
        let { error } = await userValidation.addUser(req.body.data.attributes);
        if (error) {
            return res.status(400).send(controller.errorFormat(error));
        }
        await userCore.addUser(req, res)
    } catch (err) {
        return res.status(500).send(controller.errorMsgFormat({
            'message': err.message
        }, 'user', 500));
    }
});

router.patch('/:id', async (req, res) => {
    try {
        let { error } = await userValidation.patchUser(req.body.data.attributes);
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

router.post('/login', async (req, res) => {
    try {
        await userCore.login(req, res)
    } catch (err) {
        return res.status(500).send(controller.errorMsgFormat({
            'message': err.message
        }, 'user', 500));
    }
})

router.delete('/:id', async (req, res) => {
    try {
        await userCore.deleteUser(req, res)
    } catch (err) {
        return res.status(500).send(controller.errorMsgFormat({
            'message': err.message
        }, 'user', 500));
    }
})

router.get('/encrypt', async (req, res) => {
    try {
        await userCore.encrypt(req, res)
    } catch (err) {
        return res.status(500).send(controller.errorMsgFormat({
            'message': err.message
        }, 'user', 500));
    }
});

router.get('/decrypt', async (req, res) => {
    try {
        await userCore.decrypt(req, res)
    } catch (err) {
        return res.status(500).send(controller.errorMsgFormat({
            'message': err.message
        }, 'user', 500));
    }
});

router.patch('/excess/:user_id', async (req, res) => {
    try {
        await userCore.updateUserExcess(req, res);
    } catch (err) {
        return res.status(500).send(controller.errorMsgFormat({
            'message': err.message
        }, 'user', 500));
    }
});

router.patch('/balance/:user_id', async (req, res) => {
    try {
        let { error } = await userValidation.balanceUpdate(req.body.data.attributes);
        if (error) {
            return res.status(400).send(controller.errorFormat(error));
        }
        await userCore.balanceUpdate(req, res);
    } catch (err) {
        return res.status(500).send(controller.errorMsgFormat({
            'message': err.message
        }, 'user', 500));
    }
});

router.get('/date-check', async (req, res) => {
    try {
        await userCore.dateCheck(req, res);
    } catch (err) {
        return res.status(500).send(controller.errorMsgFormat({
            'message': err.message
        }, 'user', 500));
    }
});

module.exports = router