const Joi = require("joi");

const validateManufacturers = (object) => {
  const schema = Joi.object({
    manufacturer_name: Joi.string().min(4).required(),
  });

  return schema.validate(object);
};

const validateRegistration = (object) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(16).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(16).required(),
    is_admin: Joi.bool().required(),
  });

  return schema.validate(object);
};

const validateLogin = (object) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(16).required(),
  });

  return schema.validate(object);
};

module.exports.validateManufacturers = validateManufacturers;
module.exports.validateRegistration = validateRegistration;
module.exports.validateLogin = validateLogin;
