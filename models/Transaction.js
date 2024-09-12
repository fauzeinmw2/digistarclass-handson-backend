const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    method: String,
    total: Number,
    status: String,
});

const DeliverySchema = new mongoose.Schema({
    status: String,
    trackingNumber: String,
});

const TransactionSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    status: { type: String, required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    order: [
        { 
            item: { 
                type: mongoose.Schema.Types.ObjectId, ref: 'Item' 
            }, 
            quantity: Number,
        }
    ],
    payment: PaymentSchema,
    delivery: DeliverySchema,
});

module.exports = mongoose.model('Transaction', TransactionSchema);
