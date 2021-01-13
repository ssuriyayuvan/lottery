const _ = require('lodash');
const moment = require('moment');
const userSchema = require('../schema/users');
const ticketSchema = require('../schema/ticket');
const purchaseSchema = require('../schema/purchase');
const userExcessSchema = require('../schema/user-excess');
const controller = require('../helper/controller');
const mongoose = require('mongoose');
const { ISO_8601 } = require('moment');

const purchase = () => {
    return {
        async purchaseTicket(req, res) {
            try {
                // let data = req.body.data.attributes;
                let user_id = req.params.user;
                let excessStartOf = moment().subtract(1, 'd').startOf('d').format(), excessEndOf = moment().subtract(1, 'd').endOf('d').format();
                let ticketStartOf = moment().startOf('d').format(), ticketEndOf = moment().endOf('d').format();
                let excess = await userExcessSchema.findOne({ date: { "$gt": excessStartOf, "$lte": excessEndOf } });
                console.log(ticketStartOf, ticketEndOf)
                console.log('excess', excess)
                // let excess = await userExcessSchema.findOne({ user_id: "5ff604bd3b43d904b3ceb8db" });
                let excessAmount = excess ? excess.excess : 0;
                // console.log('excess', excess);
                let data = [
                    {
                        "user_id": "5ff604bd3b43d904b3ceb8db",
                        "ticket_number": "ABCD",
                        "ticket_master_id": "5ff9e853f045cf4f8d6d3d37",
                        "actual_price": 100,
                        "sell_price": 90,
                        "show_time": "11.00",
                        "date": new Date()
                    },
                    {
                        "user_id": "5ff604bd3b43d904b3ceb8db",
                        "ticket_number": "C",
                        "ticket_master_id": "5ff9e853f045cf4f8d6d3d37",
                        "actual_price": 100,
                        "sell_price": 90,
                        "show_time": "11.00",
                        "date": new Date()
                    },
                    {
                        "user_id": "5ff604bd3b43d904b3ceb8db",
                        "ticket_number": "ABCDEF",
                        "ticket_master_id": "5ff9e853f045cf4f8d6d3d37",
                        "actual_price": 100,
                        "sell_price": 90,
                        "show_time": "11.00",
                        "date": new Date()
                    }
                ];
                let { status, existingTicket } = await this.checkExistingTicket(data, ticketStartOf, ticketEndOf);
                if (status == false) {
                    return res.status(400).send(controller.errorMsgFormat({
                        message: 'Ticket already exists for this date',
                        'tickets': existingTicket
                    }, 'purchase', 400));
                }
                console.log('Status was', status)
                // await purchaseSchema.insertMany(data);
                let result = await this.matchedTicket(data);
                let ticketPrice = await this.totalTicketPrice(data);
                let outstanding_balance = await this.calculation(result, ticketPrice, excessAmount);
                // let payload = Object.assign({
                //     user_id,
                //     outstanding_balance,
                //     date: new Date(),
                //     excess: excessAmount
                // });
                // console.log('excess day', excessStartOf, excessEndOf);
                await userSchema.findOneAndUpdate({ _id: user_id }, { outstanding_balance });
                // let userExcess = await userExcessSchema.findOne({ user_id, date: { $gt: excessStartOf, $lte: excessEndOf } });
                // console.log('userExcess', userExcess);
                // if (_.isEmpty(userExcess)) {
                //     console.log('new data', payload);
                //     new userExcessSchema(payload).save();
                // } else {
                //     console.log('already data', userExcess)
                //     await userExcessSchema.findOneAndUpdate({ user_id }, { outstanding_balance });
                // }
                // console.log('total', outstanding_balance)
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
                let show_date = req.query.show_date ? req.query.show_date : moment().format();
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
                let date = req.query.date ? req.query.date : moment().format();
                console.log('date', moment().format())
                let startOf = moment(date).startOf('d').format(), endOf = moment(date).endOf('d').format();
                let excessStartOf = moment(date).subtract(1, 'd').startOf('d').format(), excessEndOf = moment(date).subtract(1, 'd').endOf('d').format();
                console.log(excessStartOf, excessEndOf)
                let excess = await userExcessSchema.findOne({ date: { $gt: excessStartOf, $lte: excessEndOf } });
                console.log('excess', excess)
                let excessAmount = excess ? excess.excess : 0;
                console.log(startOf, endOf)
                let purchaseData = await purchaseSchema.find({ created_date: { $gt: startOf, $lte: endOf } });
                let result = await this.matchedTicket(purchaseData);
                console.log(result, excessAmount);
                let ticketPrice = await this.totalTicketPrice(purchaseData);
                let outstanding_balance = await this.calculation(result, ticketPrice, excessAmount);
                console.log(outstanding_balance);
                await userSchema.findOneAndUpdate({ _id: user_id }, { outstanding_balance });
                // let userExcessData = await userExcessSchema.findOne({ user_id, date: { $gt: startOf, $lte: endOf } });
                // let payload = Object.assign({
                //     user_id,
                //     outstanding_balance,
                //     date: new Date(),
                //     excess: excessAmount
                // })
                // if (_.isEmpty(userExcessData)) {
                //     new userExcessSchema(payload).save();
                // } else {
                //     await userExcessSchema.findOneAndUpdate({ user_id }, { outstanding_balance });
                // }
                // await userExcessSchema.findOneAndUpdate({ user_id }, { outstanding_balance });
                return res.send({ data: purchaseData });
            } catch (error) {
                return res.status(400).send(controller.errorMsgFormat({
                    'message': error.message
                }, 'purchase', 400));
            }
        },

        async dashboardData(req, res) {
            try {
                let data = req.body.data.attributes;
                console.log(data.user, new Date(data.date))
                // let date = new Date()
                let end = moment.utc(new Date).clone().endOf('day').format()
                console.log('end', new Date(end), moment.utc(new Date).clone().endOf('day').format())
                let purchaseData = await purchaseSchema.aggregate([
                    {
                        $project: {
                            '_id': 1,
                            'user_id': 1,
                            'ticket_master_id': 1,
                            'sell_price': 1,
                            'date': 1,
                            'show_time': 1
                        }
                    },
                    {
                        "$match": {
                            $and: [
                                { 'user_id': mongoose.Types.ObjectId(data.user) },
                                {
                                    'date': {
                                        $gt: new Date(data.date),
                                        $lte: new Date(end)
                                    }
                                },
                                { show_time: data.show_time ? data.show_time : { $exists: true } }
                            ]
                        }
                    },
                    {
                        "$group": { "_id": "$ticket_master_id", qty: { $sum: 1 }, value: { $sum: "$sell_price" }, date: { $first: "$date" }, rate: { $first: "$sell_price" } }
                    },
                    { $lookup: { from: 'ticket-masters', localField: '_id', foreignField: '_id', as: 'master' } },
                    { $unwind: '$master' },
                    { $addFields: { 'name': '$master.name' } },
                    { $project: { 'qty': 1, 'value': 1, 'date': 1, '_id': 0, 'name': 1, 'rate': 1 } }
                ])
                let excessStartOf = moment(data.date).subtract(1, 'd').startOf('d').format(), excessEndOf = moment(data.date).subtract(1, 'd').endOf('d').format();
                let excessData = await userExcessSchema.findOne({ date: { "$gt": excessStartOf, "$lte": excessEndOf } });
                console.log('excess', excessData)
                let userData = await userSchema.findOne({ _id: data.user });
                return res.send({ data: purchaseData, excess: excessData ? excessData.excess : 0, balance: userData.outstanding_balance });
            } catch (error) {
                // console.log(error.stack)
                return res.status(400).send(controller.errorMsgFormat({
                    'message': error.message
                }, 'purchase', 400));
            }
        }
    }
}

module.exports = purchase();