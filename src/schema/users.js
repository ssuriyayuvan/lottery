const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String, required: true, index: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true, index: true },
    gender: { type: String, required: true },
    outstanding_balance: { type: Number, index: true, default: 0 },
    is_active: { type: String, default: 'Yes' }
}, {
    timestamps: { createdAt: 'created_date', updatedAt: 'modified_date' }
});

let users = mongoose.model('users', userSchema);
users.createIndexes();
module.exports = users;