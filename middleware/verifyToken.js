const jwt = require("jsonwebtoken");

const statusCodes = require("../services/statusCodeService");

const bypass = true;

module.exports = function (authLevel) {
  return function (req, res, next) {
    if (bypass) return next();
    const token = req.header("auth-token");

    if (!token)
      return res.status(statusCodes.sc_401.code).json({
        status: statusCodes.sc_401.code,
        details: statusCodes.sc_401.defaultMessage,
      });

    try {
      const verified = jwt.verify(token, process.env.PRIVATE_KEY);

      if (authLevel === "admin" && verified.is_admin === false)
        return res.status(statusCodes.sc_401.code).json({
          status: statusCodes.sc_401.code,
          details: statusCodes.sc_401.defaultMessage,
        });
      //res.user = verified;
      next();
    } catch (error) {
      res.status(statusCodes.sc_400.code).json({
        status: statusCodes.sc_400.code,
        details: "invalid token",
      });
    }
  };
};
