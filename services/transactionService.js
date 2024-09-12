const Transaction = require('../models/Transaction');
const Item = require('../models/Item');
const Customer = require('../models/Customer');

async function getAllTransactions() {
  try {
      const transactions = await Transaction.find()
          .populate({
              path: 'customer',
              select: 'name email phone address',
              populate: {
                  path: 'address',
                  select: 'street city state postalCode -_id'
              }
          })
          .populate({
              path: 'order.item',
              select: 'name price',
          })
          .select('-payment._id -delivery._id');

      return transactions;
  } catch (error) {
      throw new Error(`Failed to retrieve transactions: ${error.message}`);
  }
}

async function createTransaction(customerId, items) {
    try {
        const customer = await Customer.findById(customerId);

        if (!customer) {
            throw new Error('Customer not found');
        }

        let totalAmount = 0;
        const order = [];
        
        for (let { itemId, quantity } of items) {
            const item = await Item.findById(itemId);
            if (!item || item.stock < quantity) {
                throw new Error(`Item not available or insufficient stock for item ID: ${itemId}`);
            }

            order.push({
                item: item._id,
                quantity
            });

            totalAmount += item.price * quantity;
        }

        const transaction = new Transaction({
            status: 'pending',
            customer: customerId,
            order: order,
            payment: {
                method: 'not yet set',
                total: totalAmount,
                status: 'pending',
            },
            delivery: {
                status: 'pending',
                trackingNumber: '',
            },
        });

        await transaction.save();

        return transaction;
    } catch (error) {
        throw new Error(`Failed to create transaction: ${error.message}`);
    }
}

async function getTransactionById(id) {
  try {
      let transaction = await Transaction.findById(id)
      .populate({
          path: 'customer',
          select: 'name email phone address',
          populate: {
              path: 'address',
              select: 'street city state postalCode -_id'
          }
      })
      .populate({
          path: 'order.item',
          select: 'name price',
      })
      .select('-payment._id -delivery._id');

      return transaction;
  } catch (error) {
      throw new Error(`Failed to retrieve transaction: ${error.message}`);
  }
}

async function updateTransaction(id, updateData) {
  try {
      // Find the existing transaction
      const transaction = await Transaction.findById(id);

      if (!transaction) {
          throw new Error('Transaction not found');
      }

      // Update transaction fields
      Object.assign(transaction, updateData);

      // Calculate the new total payment
      if (updateData.order) {
          let newTotal = 0;

          // Calculate the total based on updated order data
          for (const orderItem of updateData.order) {
              const item = await Item.findById(orderItem.item);
              if (item) {
                  newTotal += item.price * orderItem.quantity;
              }
          }

          // Ensure newTotal is a valid number
          if (isNaN(newTotal) || newTotal < 0) {
              throw new Error('Invalid total payment value');
          }

          transaction.payment.total = newTotal;
      }

      // Save the updated transaction
      const updatedTransaction = await transaction.save();

      // Populate related fields for the response
      const populatedTransaction = await Transaction.findById(updatedTransaction._id)
          .populate({
              path: 'customer',
              select: 'name email phone address',
              populate: {
                  path: 'address',
                  select: 'street city state postalCode -_id'
              }
          })
          .populate({
              path: 'order.item',
              select: 'name price -_id'
          })
          .select('-payment._id -delivery._id');

      // populatedTransaction.order = populatedTransaction.order.map(o => ({
      //     item: o.item,
      //     quantity: o.quantity
      // }));

      return populatedTransaction;
  } catch (error) {
      throw new Error(`Failed to update transaction: ${error.message}`);
  }
}

async function deleteTransaction(id) {
  try {
      await Transaction.findByIdAndDelete(id);
      return { message: 'Transaction deleted successfully' };
  } catch (error) {
      throw new Error(`Failed to delete transaction: ${error.message}`);
  }
}

async function processPayment(transactionId, methodPayment) {
  try {
    // Fetch the transaction first to retain other payment fields
    const transaction = await Transaction.findById(transactionId);
    
    if (!transaction) {
        throw new Error('Transaction not found');
    }

    // Update only the payment method and status, while keeping the total intact
    transaction.payment.method = methodPayment;
    transaction.payment.status = "Done";

    // Save the updated transaction
    const updatedTransaction = await transaction.save();

    return updatedTransaction;
    } catch (error) {
        throw new Error(`Failed to process payment: ${error.message}`);
    }
}

async function processDelivery(transactionId, deliveryDetails) {
    try {
      // Update delivery details
      const result = await Transaction.findByIdAndUpdate(
          transactionId,
          { 
              delivery: {
                  status: deliveryDetails.status,
                  trackingNumber: deliveryDetails.trackingNumber,
              }
          },
          { new: true } // Return the updated document
      );

      if (!result) {
          throw new Error('Transaction not found');
      }

      return result;
  } catch (error) {
      throw new Error(`Failed to process delivery: ${error.message}`);
  }
}

module.exports = {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    processPayment,
    processDelivery
};
