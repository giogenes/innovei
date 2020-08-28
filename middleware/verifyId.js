const statusCodes = require("../services/statusCodeService");
const validationService = require("../services/validationService");

// verifies that the given id is only a number

module.exports = function (req, res, next) {
  const { error } = validationService.validateId({ id: req.params.id });
  if (error) return res.status(200).json([]);
  next();
};
