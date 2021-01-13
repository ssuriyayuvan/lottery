const { date } = require('joi');
const mongoose = require('mongoose');

const userExcessSchema = mongoose.Schema({
    user_id: { type: mongoose.Types.ObjectId, ref: 'users', required: true, index: true },
    excess: { type: Number, index: true, default: 0 },
    // outstanding_balance: { type: Number, index: true, default: 0 },
    date: { type: Date, required: true, index: true, default: new Date() }
}, {
    timestamps: { createdAt: 'created_date', updatedAt: 'modified_date' }
});

let userExcess = mongoose.model('user-excesses', userExcessSchema);
userExcess.createIndexes()
module.exports = userExcess;