const customerService = require('../services/customerService');

async function registerCustomer(req, res) {
  try {
      const data = req.body;
      const result = await customerService.register(data);
      res.status(201).json({
          message: 'Customer registered successfully',
          user: result.user,
          customer: result.customer
      });
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
}

module.exports = {
  registerCustomer
};
