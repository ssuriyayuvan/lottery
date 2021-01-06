const express = require('express');
const router = express.Router();
const user = require('./user');
const ticketMaster = require('./ticket-master');
const ticket = require('./ticket')

router.use(express.static('dist'));
router.use('/user',user);
router.use('/master',ticketMaster);
router.use('/ticket', ticket);

module.exports = router;