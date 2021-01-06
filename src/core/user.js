const _ = require('lodash');
const crypto = require('crypto');
const userSchema = require('../schema/users');
const controller = require('../helper/controller');


const userCore = () => {
    return {
        async getUser(req, res) {
            try {
                let result = await userSchema.find({ is_active: true });
                return res.send(controller.successFormat({ data: result }));
            } catch (error) {
                return res.status(500).send(controller.errorMsgFormat({
                    'message': error.message
                }, 'user', 500));
            }
        },

        async addUser(req, res) {
            try {
                let data = req.body.data.attributes;
                let alreadyExists = await userSchema.findOne({ email: data.email });
                console.log('alreadyExists', alreadyExists)
                if (!_.isEmpty(alreadyExists)) return res.status(500).send(controller.errorMsgFormat({
                    'message': 'User already exists'
                }, 'user', 500));
                await new userSchema(data).save();
                return res.send(controller.successFormat({ message: 'User saved successfully' }))
            } catch (error) {
                return res.status(500).send(controller.errorMsgFormat({
                    'message': error.message
                }, 'user', 500));
            }
        },

        async patchUser(req, res) {
            try {
                let data = req.body.data.attributes;
                await userSchema.findOneAndUpdate({ _id: req.params.id, is_active: true }, data);
                return res.send(controller.successFormat({ message: 'User update successfully' }))
            } catch (error) {
                return res.status(500).send(controller.errorMsgFormat({
                    'message': error.message
                }, 'user', 500));
            }
        },

        async deleteUser(req, res) {
            try {
                await userSchema.findByIdAndUpdate({ _id: req.params.id, is_active: true }, { is_active: false });
                return res.send(controller.successFormat({ message: 'User deleted successfully' }))
            } catch (error) {
                return res.status(500).send(controller.errorMsgFormat({
                    'message': error.message
                }, 'user', 500));
            }
        },

        async login(req, res) {
            try {
                let data = req.body.data.attributes;
                let result = await userSchema.findOne({ email: data.email, password: data.password });
                if (_.isEmpty(result)) return res.status(500).send(controller.errorMsgFormat({
                    'message': 'User already exists'
                }, 'user', 500));
                return res.send(controller.successFormat({ message: 'User login successfully' }))
            } catch (error) {
                return res.status(500).send(controller.errorMsgFormat({
                    'message': error.message
                }, 'user', 500));
            }
        }
    }
}

module.exports = userCore();