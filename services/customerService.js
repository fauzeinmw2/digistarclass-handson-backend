const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Customer = require('../models/Customer');
const User = require('../models/User');
const Role = require('../models/Role');

async function register(data) {
  const { username, password, name, email, phone, address } = data;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
      throw new Error('Username already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const customerRole = await Role.findOne({ name: 'Customer' });
  if (!customerRole) {
      throw new Error('Role not found');
  }

  const user = new User({
      username,
      password: hashedPassword,
      role: customerRole._id
  });
  const savedUser = await user.save();

  const customer = new Customer({
      name,
      email,
      phone,
      address,
      user: savedUser._id
  });
  const savedCustomer = await customer.save();

  return { user: savedUser, customer: savedCustomer };
}

module.exports = { 
  register
};
