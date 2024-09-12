const transactionService = require('../services/transactionService');

async function getAllTransactions(req, res) {
  try {
      const transactions = await transactionService.getAllTransactions();

      return res.status(200).json({
          message: 'Transactions retrieved successfully',
          transactions,
      });
  } catch (error) {
      return res.status(500).json({ error: error.message });
  }
}

async function addTransaction(req, res) {
    try {
        const { customerId, items } = req.body;

        if (!customerId || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Invalid input' });
        }

        const transaction = await transactionService.createTransaction(customerId, items);

        return res.status(201).json({
            message: 'Transaction created successfully',
            transaction,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function getTransactionById(req, res) {
  try {
      const transaction = await transactionService.getTransactionById(req.params.id);
      if (!transaction) {
          return res.status(404).json({ message: 'Transaction not found' });
      }
      res.json({
          message: 'Transaction retrieved successfully',
          transaction
      });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}

async function updateTransaction(req, res) {
  try {
      const transaction = await transactionService.updateTransaction(req.params.id, req.body);
      if (!transaction) {
          return res.status(404).json({ message: 'Transaction not found' });
      }
      res.json({
          message: 'Transaction updated successfully',
          transaction
      });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}

async function deleteTransaction(req, res) {
  try {
      await transactionService.deleteTransaction(req.params.id);
      res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}

async function processPayment(req, res) {
  try {
      const transactionId = req.params.id;
      const { method } = req.body;

      const updatedTransaction = await transactionService.processPayment(transactionId, method);

      res.json({
          message: 'Payment processed successfully',
          transaction: updatedTransaction
      });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}

async function updateDelivery(req, res) {
  try {
      const transactionId = req.params.id;
      const deliveryDetails = req.body;

      const updatedTransaction = await transactionService.processDelivery(transactionId, deliveryDetails);

      res.json({
          message: 'Delivery processed successfully',
          transaction: updatedTransaction
      });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}

module.exports = {
  addTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  processPayment,
  updateDelivery
};
