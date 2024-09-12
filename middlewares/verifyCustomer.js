const Transaction = require('../models/Transaction'); 

async function verifyCustomer(req, res, next) {
    try {
        const user = req.user;
        const transactionId = req.params.id;

        const transaction = await Transaction.findById(transactionId);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        if (transaction.customer.toString() !== user.customerId) {
            return res.status(403).json({ message: 'You are not authorized to process this transaction' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
}

module.exports = verifyCustomer;
