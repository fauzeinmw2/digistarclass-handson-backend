const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userService = require('../services/userService');

async function login(req, res) {
    try {
        const { username, password } = req.body;
        const result = await userService.login(username, password);

        res.status(200).json({
            message: 'Login successful',
            token: result.token,
            role: result.role,
            customer: result.customer ? result.customer : null
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = { login };
