const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String, required: true, index: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true, index: true },
    gender: { type: String, required: true },
    is_active: { type: Boolean, default: true }
}, {
    timestamps: { createdAt: 'created_date', updatedAt: 'modified_date' }
});

let users = mongoose.model('users', userSchema);
users.createIndexes();
module.exports = users;