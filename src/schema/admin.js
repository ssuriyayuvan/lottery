const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    email: { type: String, required: true, index: true },
    password: { type: String, required: true, index: true },
    is_active: { type: Boolean, default: true }
}, {
    timestamps: { createdAt: 'created_date', updatedAt: 'modified_date' }
});

let admin = mongoose.model('admin', adminSchema);
admin.createIndexes()
module.exports = admin;