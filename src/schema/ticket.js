const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema({
    master_id: { type: mongoose.Types.ObjectId, ref: 'ticket-master', required: true, index: true },
    combination: { type: String, required: true, index: true },
    prize: { type: Number, required: true },
    is_active: { type: Boolean, default: true }
}, {
    timestamps: { createdAt: 'created_date', updatedAt: 'modified_date' }
});

let ticket = mongoose.model('tickets', ticketSchema);
ticket.createIndexes();
module.exports = ticket;