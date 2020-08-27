const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  const token = req.header("auth-token");
  if (!token) res.status(401).send("access denied");
  try {
    const verified = jwt.verify(token, process.env.PRIVATE_KEY);
    res.user = verified;
    next();
  } catch (error) {
    res.status(400).send("invalid token");
  }
};
