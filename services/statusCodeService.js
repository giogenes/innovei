const statusCodes = {
  sc_400: { code: 400, defaultMessage: "Error 400 - Bad Request" },
  sc_401: { code: 401, defaultMessage: "Error 401 - Access Denied" },
  sc_404: { code: 404, defaultMessage: "Error 404 - Not Found" },
  sc_500: { code: 500, defaultMessage: "Error 500 - Internal Server Error" },
  sc_501: { code: 501, defaultMessage: "Error 501 - Bad Gateway" },
};

module.exports = statusCodes;
