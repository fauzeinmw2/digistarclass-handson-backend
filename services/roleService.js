const Role = require('../models/Role');

exports.createRole = async (roleData) => {
  const role = new Role(roleData);
  return await role.save();
};

exports.getAllRoles = async () => {
  return await Role.find();
};

exports.getRoleById = async (id) => {
  return await Role.findById(id);
};
