const _ = require('lodash');
const userSchema = require('../schema/users');
const adminSchema = require('../schema/admin');
const userExcessSchema = require('../schema/user-excess');
const controller = require('../helper/controller');


const userCore = () => {
    return {
        async getUser(req, res) {
            try {
                let cnt = await userSchema.countDocuments();
                let limit = Number(req.query.limit);
                let skip = req.query.page_no * limit;
                console.log(skip, limit)
                let name = req.query.name ? req.query.name : '';
                let result = await userSchema.find({ name: { $regex: new RegExp(name, 'i') } }).skip(skip).limit(limit).sort({ _id: -1 });
                return res.send(controller.successFormat({ count: cnt, data: result }));
            } catch (error) {
                return res.status(400).send(controller.errorMsgFormat({
                    'message': error.message
                }, 'user', 400));
            }
        },

        async addUser(req, res) {
            try {
                let data = req.body.data.attributes;
                let alreadyExists = await userSchema.findOne({ email: data.email });
                console.log('alreadyExists', alreadyExists)
                if (!_.isEmpty(alreadyExists)) return res.status(400).send(controller.errorMsgFormat({
                    'message': 'User already exists'
                }, 'user', 400));
                let userDetails = await new userSchema(data).save();
                await new userExcessSchema({ user_id: userDetails._id }).save();
                return res.send(controller.successFormat({ message: 'User saved successfully' }))
            } catch (error) {
                return res.status(400).send(controller.errorMsgFormat({
                    'message': error.message
                }, 'user', 400));
            }
        },

        async patchUser(req, res) {
            try {
                let data = req.body.data.attributes;
                await userSchema.findOneAndUpdate({ _id: req.params.id, is_active: true }, data);
                return res.send(controller.successFormat({ message: 'User update successfully' }))
            } catch (error) {
                return res.status(400).send(controller.errorMsgFormat({
                    'message': error.message
                }, 'user', 400));
            }
        },

        async deleteUser(req, res) {
            try {
                await userSchema.findByIdAndUpdate({ _id: req.params.id, is_active: true }, { is_active: false });
                return res.send(controller.successFormat({ message: 'User deleted successfully' }))
            } catch (error) {
                return res.status(400).send(controller.errorMsgFormat({
                    'message': error.message
                }, 'user', 400));
            }
        },

        async login(req, res) {
            try {
                let data = req.body.data.attributes;
                let result = await adminSchema.findOne({ email: data.email, password: data.password });
                if (_.isEmpty(result)) return res.status(400).send(controller.errorMsgFormat({
                    'message': 'Email or password Incorrect!'
                }, 'user', 400));
                return res.send(controller.successFormat({ message: 'User login successfully' }))
            } catch (error) {
                return res.status(400).send(controller.errorMsgFormat({
                    'message': error.message
                }, 'user', 400));
            }
        },

        async updateUserExcess(req, res) {
            try {
                let data = req.body.data.attributes;
                let _id = req.params.excess_id;
                await userExcessSchema.findOneAndUpdate({ _id }, { excess: data.excess });
                return res.send(controller.successFormat({ message: 'User Excess Update successfully' }))
            } catch (error) {
                return res.status(400).send(controller.errorMsgFormat({
                    'message': error.message
                }, 'user', 400));
            }
        }
    }
}

module.exports = userCore();