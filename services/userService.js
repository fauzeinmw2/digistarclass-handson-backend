require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Customer = require('../models/Customer');

async function login(username, password) {

    const user = await User.findOne({ username }).populate('role');
    if (!user) {
        throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    let customer = null;
    if (user.role.name === 'Customer') {
        customer = await Customer.findOne({ user: user._id });
        if (!customer) {
            throw new Error('Customer not found');
        }
    }

    const tokenPayload = {
        userId: user._id,
        role: user.role.name,
    };

    if (customer) {
        tokenPayload.customerId = customer._id;
    }

    const token = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    return { token, role: user.role.name, customer };
}

module.exports = { login };
