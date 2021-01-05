const mongoose = require('mongoose');

const ticketMasterSchema = mongoose.Schema({
    name: { type: String, required: true, index: true },
    price: { type: Number, required: true },
    is_active: { type: Boolean, default: true }
}, {
    timestamps: { createdAt: 'created_date', updatedAt: 'modified_date' }
});

let ticketMaster = mongoose.model('ticket-master', ticketMasterSchema);
ticketMaster.createIndexes()
module.exports = ticketMaster;