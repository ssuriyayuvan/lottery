const mongoose = require('mongoose');

const userExcessSchema = mongoose.Schema({
    user_id: { type: mongoose.Types.ObjectId, ref: 'users', required: true, index: true },
    excess: { type: Number, required: true, index: true }
}, {
    timestamps: { createdAt: 'created_date', updatedAt: 'modified_date' }
});

let userExcess = mongoose.model('user-excesses', userExcessSchema);
userExcess.createIndexes()
module.exports = userExcess;