const statusCodes = {
  sc_400: { code: 400, defaultMessage: "Bad Request" },
  sc_401: { code: 401, defaultMessage: "Access Denied" },
  sc_404: { code: 404, defaultMessage: "Not Found" },
  sc_500: { code: 500, defaultMessage: "Something Went Wrong" },
  sc_501: { code: 501, defaultMessage: "Bad Gateway" },
};

module.exports = statusCodes;
module.exports.statusCodeJSON = function (code, additionalMessage = "") {
  try {
    const statusCode = statusCodes["sc_" + code];
    return { status: statusCode.code, details: `${statusCode.defaultMessage}, ${additionalMessage}` };
  } catch (error) {
    return { status: `error code ${code} not found in status code service library` };
  }
};
