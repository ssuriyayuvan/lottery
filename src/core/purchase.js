const _ = require('lodash');
const moment = require('moment');
const ticketSchema = require('../schema/ticket');
const purchaseSchema = require('../schema/purchase');
const userExcessSchema = require('../schema/user-excess');
const controller = require('../helper/controller');
const { result } = require('lodash');

const purchase = () => {
    return {
        async purchaseTicket(req, res) {
            try {
                let data = req.body.data.attributes;
                let user_id = req.params.user;
                let excessStartOf = moment().subtract(1, 'd').startOf('d').format(), excessEndOf = moment().subtract(1, 'd').endOf('d').format();
                let ticketStartOf = moment().startOf('d').format(), ticketEndOf = moment().endOf('d').format();
                let excess = await userExcessSchema.findOne({ date: { "$gt": excessStartOf, "$lte": excessEndOf } });
                console.log(ticketStartOf, ticketEndOf)
                console.log('excess', excess)
                // let excess = await userExcessSchema.findOne({ user_id: "5ff604bd3b43d904b3ceb8db" });
                let excessAmount = excess ? excess.excess : 0;
                // console.log('excess', excess);
                // let data = [
                //     {
                //         "user_id": "5ff604bd3b43d904b3ceb8db",
                //         "ticket_number": "ABCD",
                //         "ticket_master_id": "5ff9e853f045cf4f8d6d3d37",
                //         "actual_price": 100,
                //         "sell_price": 90,
                //         "show_time": "11.00",
                //         "date": new Date()
                //     },
                //     {
                //         "user_id": "5ff604bd3b43d904b3ceb8db",
                //         "ticket_number": "C",
                //         "ticket_master_id": "5ff9e853f045cf4f8d6d3d37",
                //         "actual_price": 100,
                //         "sell_price": 90,
                //         "show_time": "11.00",
                //         "date": new Date()
                //     },
                //     {
                //         "user_id": "5ff604bd3b43d904b3ceb8db",
                //         "ticket_number": "ABCDEF",
                //         "ticket_master_id": "5ff9e853f045cf4f8d6d3d37",
                //         "actual_price": 100,
                //         "sell_price": 90,
                //         "show_time": "11.00",
                //         "date": new Date()
                //     }
                // ];
                let { status, existingTicket } = await this.checkExistingTicket(data, ticketStartOf, ticketEndOf);
                if (status == false) {
                    return res.status(400).send(controller.errorMsgFormat({
                        message: 'Ticket already exists for this date',
                        'tickets': existingTicket
                    }, 'purchase', 400));
                }
                console.log('Status was', status)
                await purchaseSchema.insertMany(data);
                let result = await this.matchedTicket(data);
                let ticketPrice = await this.totalTicketPrice(data);
                let outstanding_balance = await this.calculation(result, ticketPrice, excessAmount);
                let payload = Object.assign({
                    user_id,
                    outstanding_balance,
                    date: new Date(),
                    excess: excessAmount
                });
                let userExcess = await userExcessSchema.findOne({ user_id, date: { $gt: excessStartOf, $lte: excessEndOf } });
                console.log('userExcess', userExcess);
                if (_.isEmpty(userExcess)) {
                    console.log(payload)
                    new userExcessSchema(payload).save();
                } else {
                    console.log(payload)
                    await userExcessSchema.findOneAndUpdate({ user_id }, { outstanding_balance });
                }
                console.log('total', outstanding_balance)
                return res.send(controller.successFormat({ message: 'Ticket Purchased successfully', outstanding_balance }))
            } catch (error) {
                return res.status(400).send(controller.errorMsgFormat({
                    'message': error.message
                }, 'purchase', 400));
            }
        },

        async totalTicketPrice(data) {
            let total_ticket_price = 0;
            for (let i = 0; i < data.length; i++) {
                total_ticket_price += data[i].sell_price;
            }
            return total_ticket_price;
        },

        async matchedTicket(data) {
            let result = [];
            for (let i = 0; i < data.length; i++) {
                // console.log(data[i].ticket_master_id, data[i].ticket_number)
                let match = await ticketSchema.findOne({ master_id: data[i].ticket_master_id, combination: data[i].ticket_number });
                // console.log('matched tickets', match)
                !_.isEmpty(match) ? result.push({ combination: match.combination, prize: match.prize, sell_price: data[i].sell_price }) : ''
            }
            return result;
        },

        calculation(data, ticketPrice, excessAmount) {
            try {
                let prize = 0;
                for (let i = 0; i < data.length; i++) {
                    prize += data[i].prize;
                }
                let total = (prize - ticketPrice) + excessAmount
                return total;
            } catch (error) {

            }
        },

        async checkExistingTicket(data, start, end) {
            try {
                // console.log(start, end)
                let status = true, existingTicket = [];
                for (let i = 0; i < data.length; i++) {
                    let existsData = await purchaseSchema.findOne({ ticket_number: data[i].ticket_number, date: { $gt: start, $lte: end } });
                    console.log('existsData', existsData, data[i].ticket_number)
                    if (!_.isEmpty(existsData)) {
                        status = false, existingTicket.push(data[i].ticket_number)
                        // break;
                    }
                }
                return { status, existingTicket }
            } catch (error) {

            }
        },

        async showWiseCalculation(req, res) {
            try {
                let show_time = req.query.show_time;
                let show_date = req.query.show_date ? req.query.show_date : new Date();
                let startOf = moment(show_date).startOf('d').format(), endOf = moment(show_date).endOf('d').format();
                // console.log(show_time, startOf, endOf)
                let purchaseData = await purchaseSchema.find({ show_time, created_date: { $gte: startOf, $lte: endOf } });
                console.log(purchaseData);
                return res.send({ data: purchaseData })
            } catch (error) {
                return res.status(400).send(controller.errorMsgFormat({
                    'message': error.message
                }, 'purchase', 400));
            }
        },

        async dateWiseCalculation(req, res) {
            try {
                // let user = req.params.user;
                let user_id = "5ff604bd3b43d904b3ceb8db";
                let date = req.query.date ? req.query.date : new Date();
                let startOf = moment(date).startOf('d').format(), endOf = moment(date).endOf('d').format();
                let excessStartOf = moment(date).subtract(1, 'd').startOf('d').format(), excessEndOf = moment(date).subtract(1, 'd').endOf('d').format();
                console.log(excessStartOf, excessEndOf)
                let excess = await userExcessSchema.findOne({ date: { $gt: excessStartOf, $lte: excessEndOf } });
                console.log('excess', excess)
                let excessAmount = excess ? excess.excess : 0;
                console.log(startOf, endOf)
                let purchaseData = await purchaseSchema.find({ created_date: { $gt: startOf, $lte: endOf } });
                // console.log(purchaseData)
                let result = await this.matchedTicket(purchaseData);
                console.log(result, excessAmount);
                let ticketPrice = await this.totalTicketPrice(purchaseData);
                let outstanding_balance = await this.calculation(result, ticketPrice, excessAmount);
                console.log(outstanding_balance);
                let userExcessData = await userExcessSchema.findOne({ user_id, date: { $gt: startOf, $lte: endOf } });
                let payload = Object.assign({
                    user_id,
                    outstanding_balance,
                    date: new Date(),
                    excess: excessAmount
                })
                if (_.isEmpty(userExcessData)) {
                    new userExcessSchema(payload).save();
                } else {
                    await userExcessSchema.findOneAndUpdate({ user_id }, { outstanding_balance });
                }
                await userExcessSchema.findOneAndUpdate({ user_id }, { outstanding_balance });
                return res.send({ data: purchaseData })
            } catch (error) {
                return res.status(400).send(controller.errorMsgFormat({
                    'message': error.message
                }, 'purchase', 400));
            }
        }
    }
}

module.exports = purchase();