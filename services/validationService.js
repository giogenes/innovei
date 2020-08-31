const Joi = require("joi");

const validateManufacturers = (object) => {
  const schema = Joi.object({
    name: Joi.string().min(4).required(),
  });

  return schema.validate(object);
};

const validateLocations = (object) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(16).required(),
    super_id: Joi.number(),
    next_ids: Joi.array(Joi.number()),
  });

  return schema.validate(object);
};

const validateTicketTypes = (object) => {
  const schema = Joi.object({
    ticket_type_name: Joi.string().min(1).max(16).required(),
  });

  return schema.validate(object);
};

const validatePallets = (object) => {
  const schema = Joi.object({
    name: Joi.string().min(16).max(16).required(),
    bay: Joi.number().required(),
    description: Joi.string().min(1).max(128),
  });

  return schema.validate(object);
};

const validateCustomers = (object) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(32).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(1).max(15).required(),
    address1: Joi.string().min(1).max(128).required(),
    address2: Joi.string().min(1).max(128).required(),
    city: Joi.string().min(1).max(32).required(),
    state: Joi.string().min(1).max(36).required(),
    zipcode: Joi.string().min(1).max(8).required(),
    country: Joi.string().min(1).max(32).required(),
  });

  return schema.validate(object);
};

const validateUnitTypes = (object) => {
  const schema = Joi.object({
    name: Joi.string().min(4).max(32).required(),
    pn: Joi.string().min(1).max(16).required(),
    manufacturer_id: Joi.number().required(),
    description: Joi.string().min(1).max(128),
  });

  return schema.validate(object);
};

const validateTickets = (object) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(16).required(),
    ticket_type_id: Joi.number().required(),
    customer_id: Joi.number().required(),
  });

  return schema.validate(object);
};

const validateUnits = (object) => {
  const schema = Joi.object({
    sn: Joi.string().min(1).max(32).required(),
    unit_type_id: Joi.number().required(),
    ticket_id: Joi.number().required(),
    pallet_id: Joi.number().required(),
    location_id: Joi.number().required(),
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

const validateId = (object) => {
  const schema = Joi.object({
    id: Joi.number(),
  });

  return schema.validate(object);
};

module.exports.validateManufacturers = validateManufacturers;
module.exports.validateLocations = validateLocations;
module.exports.validatePallets = validatePallets;
module.exports.validateUnitTypes = validateUnitTypes;
module.exports.validateCustomers = validateCustomers;
module.exports.validateTicketTypes = validateTicketTypes;
module.exports.validateTickets = validateTickets;
module.exports.validateUnits = validateUnits;
module.exports.validateRegistration = validateRegistration;
module.exports.validateLogin = validateLogin;
module.exports.validateId = validateId;
