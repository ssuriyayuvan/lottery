const mongoose = require('mongoose');

const purchaseSchema = mongoose.Schema({
    user_id: { type: mongoose.Types.ObjectId, ref: 'lottery-users', required: true, index: true },
    ticket_number: { type: String, required: true },
    ticket_master_id: { type: mongoose.Types.ObjectId, ref: 'ticket-master', required: true, index: true },
    actual_price: { type: Number, requred: true },
    sell_price: { type: Number, requred: true },
    show_time: { type: String, requred: true, index: true },
    date: { type: Date, index: true },
    is_active: { type: Boolean, default: true }
}, {
    timestamps: { createdAt: 'created_date', updatedAt: 'modified_date' }
});

let purchase = mongoose.model('purchase', purchaseSchema);
purchase.createIndexes();
module.exports = purchase;