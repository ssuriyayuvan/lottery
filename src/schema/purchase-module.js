const mongoose = require('mongoose');

const purchaseSchema = mongoose.Schema({
    ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'tickets-masters', required: true, index: true },
    winning_number: { type: String, },
    show_time: { type: String, index: true },
    date: { type: Date, index: true, default: new Date },
}, {
    timestamps: { createdAt: 'created_date', updatedAt: 'modified_date' }
});

let purchase = mongoose.model('winning-announcement', purchaseSchema);
purchase.createIndexes();
module.exports = purchase;