const express = require('express');
const authorizeRoles = require('../middlewares/authorizeRoles');
const verifyCustomer = require('../middlewares/verifyCustomer');

const { 
    addTransaction, 
    getAllTransactions, 
    updateTransaction, 
    deleteTransaction, 
    getTransactionById,
    processPayment,
    updateDelivery
} = require('../controllers/transactionController');

const router = express.Router();

// Transaksi
router.post('/', addTransaction);
router.get('/all/admin', authorizeRoles('Admin'), getAllTransactions);
router.get('/:id', getTransactionById);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

// Payment
router.post('/:id/payment', authorizeRoles('Customer'), verifyCustomer, processPayment);

// // Delivery
router.put('/:id/delivery', updateDelivery);

module.exports = router;
