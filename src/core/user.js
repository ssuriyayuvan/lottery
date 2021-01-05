const userSchema = require('../schema/users');
const controller = require('../helper/controller')

const userCore = () => {
    return {
        async getUser(req, res) {
            try {
                let result = await userSchema.find();
                return res.send(controller.successFormat({ data: result }));
            } catch (error) {
                return res.status(500).send(controller.errorMsgFormat({
                    'message': error.message
                }, 'user', 500));
            }
        },

        async addUser(req, res) {
            try {
                let data = req.body.data;
                let alreadyExists = await userSchema.findOne({email: data.email});
                if(!_.isEmpty(alreadyExists)) return res.status(500).send(controller.errorMsgFormat({
                    'message': 'User already exists'
                }, 'user', 500));
                new userSchema(data).save();
                return res.send(controller.successFormat({ message: 'User saved successfully' }))
            } catch (error) {
                return res.status(500).send(controller.errorMsgFormat({
                    'message': error.message
                }, 'user', 500));
            }
        },

        async patchUser(req, res) {
            try {
                let data = req.body.data;
                await userSchema.findOneAndUpdate({ _id: req.params.id }, { data });
                return res.send(controller.successFormat({ message: 'User update successfully' }))
            } catch (error) {
                return res.status(500).send(controller.errorMsgFormat({
                    'message': error.message
                }, 'user', 500));
            }
        },

        async deleteUser(req, res) {
            try {
                await userSchema.deleteOne({ _id: req.params.id });
                return res.send(controller.successFormat({ message: 'User deleted successfully' }))
            } catch (error) {
                return res.status(500).send(controller.errorMsgFormat({
                    'message': error.message
                }, 'user', 500));
            }
        }
    }
}

module.exports = userCore();