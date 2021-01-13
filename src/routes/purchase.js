const express = require('express');
const router = express.Router();
const purchaseCore = require('../core/purchase')
const controller = require('../helper/controller');
const purchaseValidation = require('../validation/purchase.validation');


router.post('/dashboard', async (req, res) => {
    try {
        console.log('in dash')
        await purchaseCore.dashboardData(req, res)
    } catch (error) {
        return res.status(500).send(controller.errorMsgFormat({
            'message': error.message
        }, 'purchase', 500));
    }
})

router.post('/:user', async (req, res) => {
    try {
        await purchaseCore.purchaseTicket(req, res);
    } catch (error) {
        return res.status(500).send(controller.errorMsgFormat({
            'message': error.message
        }, 'purchase', 500));
    }
});

router.patch('/:id', async (req, res) => {
    try {
        let { error } = await ieoValidation.ieoTokenSale(req.body.data.attributes);
        if (error) {
            return res.status(400).send(controller.errorFormat(error));
        }
        await ticketCore.patchTicket(req, res);

    } catch (error) {
        return res.status(500).send(controller.errorMsgFormat({
            'message': error.message
        }, 'purchase', 500));
    }
});

// router.delete('/:id', async (req, res) => {
//     try {
//         await ticketCore.deleteTicket(req, res)
//     } catch (error) {
//         return res.status(500).send(controller.errorMsgFormat({
//             'message': error.message
//         }, 'purchase', 500));
//     }
// })

router.get('/show_wise', async (req, res) => {
    try {
        await purchaseCore.showWiseCalculation(req, res)
    } catch (error) {
        return res.status(500).send(controller.errorMsgFormat({
            'message': error.message
        }, 'purchase', 500));
    }
});

router.get('/date_wise', async (req, res) => {
    try {
        await purchaseCore.dateWiseCalculation(req, res)
    } catch (error) {
        return res.status(500).send(controller.errorMsgFormat({
            'message': error.message
        }, 'purchase', 500));
    }
})

module.exports = router;