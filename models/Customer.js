const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    street: String,
    city: String,
    state: String,
    postalCode: String,
});

const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true},
    address: AddressSchema,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Customer', CustomerSchema);
